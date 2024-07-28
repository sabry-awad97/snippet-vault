use async_trait::async_trait;
use prisma::PrismaClient;
use std::{future::Future, sync::Arc};
use tauri::{AppHandle, Manager};

use crate::{
    database::init_db,
    error::{AppError, DbError},
};

pub struct AppState {
    pub db: Arc<PrismaClient>,
}

impl AppState {
    pub fn new(db: PrismaClient) -> Self {
        Self { db: db.into() }
    }
}

#[async_trait]
pub trait ServiceAccess {
    async fn db<F, Fut, TResult>(&self, operation: F) -> Result<TResult, DbError>
    where
        F: FnOnce(Arc<prisma::PrismaClient>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = Result<TResult, DbError>> + Send + 'static,
        TResult: Send + 'static;
}

#[async_trait]
impl ServiceAccess for AppHandle {
    async fn db<F, Fut, TResult>(&self, operation: F) -> Result<TResult, DbError>
    where
        F: FnOnce(Arc<prisma::PrismaClient>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = Result<TResult, DbError>> + Send + 'static,
        TResult: Send + 'static,
    {
        let app_state: tauri::State<AppState> = self.state();
        let db_client = Arc::clone(&app_state.db);

        operation(db_client).await
    }
}

pub async fn init_state(app: AppHandle) -> Result<(), AppError> {
    let client = init_db().await?;
    let app_state = AppState::new(client);
    app.manage(app_state);
    Ok(())
}
