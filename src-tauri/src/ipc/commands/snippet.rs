use tauri::AppHandle;

use crate::{
    database::{
        handle_db_operation,
        models::{Snippet, SnippetFilter, SnippetForm, SnippetStateUpdate},
    },
    ipc::{
        params::{DeleteParams, GetParams, ListParams, PutParams},
        responses::IpcResponse,
    },
};

#[tauri::command]
pub async fn create_snippet(app: AppHandle, params: SnippetForm) -> IpcResponse<Snippet> {
    handle_db_operation(app, move |client| async move {
        let snippet = client
            .snippet()
            .create(
                params.title,
                params.language,
                params.code,
                prisma::snippet_state::create(vec![
                    prisma::snippet_state::is_dark::set(params.state.is_dark),
                    prisma::snippet_state::is_favorite::set(params.state.is_favorite),
                ]),
                vec![prisma::snippet::tags::set(params.tags)],
            )
            .exec()
            .await?;
        Ok(snippet)
    })
    .await
}

#[tauri::command]
pub async fn get_snippet(app: AppHandle, params: GetParams) -> IpcResponse<Option<Snippet>> {
    handle_db_operation(app, |client| async move {
        let snippet = client
            .snippet()
            .find_unique(prisma::snippet::id::equals(params.id))
            .exec()
            .await?;
        Ok(snippet)
    })
    .await
}

fn build_snippet_filters(filter: Option<SnippetFilter>) -> Vec<prisma::snippet::WhereParam> {
    let mut where_params = vec![];
    if let Some(filter) = filter {
        if let Some(title) = filter.title {
            where_params.push(prisma::snippet::title::contains(title));
        }
    }
    where_params
}

#[tauri::command]
pub async fn list_snippets(
    app: AppHandle,
    params: ListParams<SnippetFilter>,
) -> IpcResponse<Vec<Snippet>> {
    handle_db_operation(app, |client| async move {
        let where_params = build_snippet_filters(params.filter);
        let snippets = client.snippet().find_many(where_params).exec().await?;
        Ok(snippets)
    })
    .await
}

#[tauri::command]
pub async fn update_snippet(
    app: AppHandle,
    params: PutParams<SnippetForm>,
) -> IpcResponse<Snippet> {
    handle_db_operation(app, move |client| async move {
        let update_params = vec![
            prisma::snippet::title::set(params.data.title),
            prisma::snippet::language::set(params.data.language),
            prisma::snippet::code::set(params.data.code),
            prisma::snippet::tags::set(params.data.tags),
            prisma::snippet::state::update(vec![
                prisma::snippet_state::is_dark::set(params.data.state.is_dark),
                prisma::snippet_state::is_favorite::set(params.data.state.is_favorite),
            ]),
        ];

        let snippet = client
            .snippet()
            .update(prisma::snippet::id::equals(params.id), update_params)
            .exec()
            .await?;
        Ok(snippet)
    })
    .await
}

#[tauri::command]
pub async fn delete_snippet(app: AppHandle, params: DeleteParams) -> IpcResponse<Snippet> {
    handle_db_operation(app, |client| async move {
        let snippet = client
            .snippet()
            .delete(prisma::snippet::id::equals(params.id))
            .exec()
            .await?;
        Ok(snippet)
    })
    .await
}

#[tauri::command]
pub async fn update_snippet_state(
    app: AppHandle,
    params: PutParams<SnippetStateUpdate>,
) -> IpcResponse<Snippet> {
    let mut updated_params = vec![];

    if let Some(is_dark) = params.data.is_dark {
        updated_params.push(prisma::snippet_state::is_dark::set(is_dark));
    }

    if let Some(is_favorite) = params.data.is_favorite {
        updated_params.push(prisma::snippet_state::is_favorite::set(is_favorite));
    }

    handle_db_operation(app, move |client| async move {
        let snippet = client
            .snippet()
            .update(
                prisma::snippet::id::equals(params.id),
                vec![prisma::snippet::state::update(updated_params)],
            )
            .exec()
            .await?;
        Ok(snippet)
    })
    .await
}
