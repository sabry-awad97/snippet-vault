pub mod models;

use std::{future::Future, sync::Arc};

use prisma::PrismaClient;
use serde::Serialize;
use tauri::AppHandle;

use crate::{error::AppError, ipc::responses::IpcResponse, state::ServiceAccess};

pub async fn init_db() -> PrismaClient {
    PrismaClient::_builder().build().await.unwrap()
}

pub async fn handle_db_operation<T, F, Fut>(app: AppHandle, operation: F) -> IpcResponse<T>
where
    F: FnOnce(Arc<prisma::PrismaClient>) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = Result<T, AppError>> + Send + 'static,
    T: Send + 'static + Serialize,
{
    let result = app.db(operation).await;
    result.into()
}
