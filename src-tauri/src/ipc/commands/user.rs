use tauri::AppHandle;

use crate::{
    database::{
        handle_db_operation,
        models::{User, UserData, UserFilter},
    },
    ipc::{
        params::{GetParams, ListParams, PostParams, PutParams},
        responses::IpcResponse,
    },
};

#[tauri::command]
pub async fn create_user(app: AppHandle, params: PostParams<UserData>) -> IpcResponse<User> {
    handle_db_operation(app, |client| async move {
        let new_user = client
            .user()
            .create(params.data.email, params.data.password_hash, vec![])
            .exec()
            .await?;
        Ok(new_user)
    })
    .await
}

#[tauri::command]
pub async fn get_user(app: AppHandle, params: GetParams) -> IpcResponse<Option<User>> {
    handle_db_operation(app, |client| async move {
        let user = client
            .user()
            .find_unique(prisma::user::id::equals(params.id))
            .exec()
            .await?;
        Ok(user)
    })
    .await
}

fn build_user_filters(filter: Option<UserFilter>) -> Vec<prisma::user::WhereParam> {
    let mut where_params = vec![];
    if let Some(filter) = filter {
        if let Some(email) = filter.email {
            where_params.push(prisma::user::email::contains(email));
        }
    }
    where_params
}

#[tauri::command]
pub async fn list_users(app: AppHandle, params: ListParams<UserFilter>) -> IpcResponse<Vec<User>> {
    handle_db_operation(app, |client| async move {
        let where_params = build_user_filters(params.filter);
        let users = client.user().find_many(where_params).exec().await?;
        Ok(users)
    })
    .await
}

#[tauri::command]
pub async fn update_user(app: AppHandle, params: PutParams<UserData>) -> IpcResponse<User> {
    handle_db_operation(app, |client| async move {
        let user = client
            .user()
            .update(
                prisma::user::id::equals(params.id),
                vec![
                    prisma::user::email::set(params.data.email),
                    prisma::user::password_hash::set(params.data.password_hash),
                ],
            )
            .exec()
            .await?;
        Ok(user)
    })
    .await
}

#[tauri::command]
pub async fn delete_user(app: AppHandle, user_id: String) -> IpcResponse<User> {
    handle_db_operation(app, |client| async move {
        let user = client
            .user()
            .delete(prisma::user::id::equals(user_id))
            .exec()
            .await?;
        Ok(user)
    })
    .await
}
