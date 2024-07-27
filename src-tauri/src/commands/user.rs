use tauri::AppHandle;

use crate::{error::DbError, state::ServiceAccess};

pub type User = prisma::user::Data;

#[tauri::command]
pub async fn get_user(app: AppHandle, user_id: String) -> Result<Option<User>, DbError> {
    app.db(|client| async move {
        let user = client
            .user()
            .find_unique(prisma::user::id::equals(user_id))
            .exec()
            .await?;

        Ok(user)
    })
    .await
}
