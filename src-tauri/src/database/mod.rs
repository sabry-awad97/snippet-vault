pub mod models;

use std::{future::Future, sync::Arc};

use prisma::PrismaClient;
use serde::Serialize;
use tauri::AppHandle;

use crate::{error::DbError, ipc::responses::IpcResponse, state::ServiceAccess};

pub async fn init_db() -> Result<PrismaClient, DbError> {
    let client: PrismaClient = PrismaClient::_builder().build().await?;
    Ok(client)
}

pub async fn handle_db_operation<T, F, Fut>(app: AppHandle, operation: F) -> IpcResponse<T>
where
    F: FnOnce(Arc<prisma::PrismaClient>) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = Result<T, DbError>> + Send + 'static,
    T: Send + 'static + Serialize,
{
    let result = app.db(operation).await.map_err(|e| e.into());
    result.into()
}
