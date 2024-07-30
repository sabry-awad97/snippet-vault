use tauri::AppHandle;

use crate::{
    database::{
        handle_db_operation,
        models::{Snippet, SnippetState, SnippetStateUpdate},
    },
    ipc::{params::PutParams, responses::IpcResponse},
};

#[tauri::command]
pub async fn update_snippet_state(
    app: AppHandle,
    params: PutParams<SnippetStateUpdate>,
) -> IpcResponse<Snippet> {
    handle_db_operation(app, move |client| async move {
        let mut updated_params = vec![];

        if let Some(is_dark) = params.data.is_dark {
            updated_params.push(prisma::snippet_state::is_dark::set(is_dark));
        }

        if let Some(is_favorite) = params.data.is_favorite {
            updated_params.push(prisma::snippet_state::is_favorite::set(is_favorite));
        }

        // Update the SnippetState
        let _updated_state: SnippetState = client
            .snippet_state()
            .update(
                prisma::snippet_state::id::equals(params.id.clone()),
                updated_params,
            )
            .exec()
            .await?;

        // Fetch the updated Snippet with its relations
        let snippet_with_relations = client
            .snippet()
            .find_unique(prisma::snippet::id::equals(params.id))
            .with(prisma::snippet::state::fetch())
            .with(prisma::snippet::tags::fetch(vec![]))
            .exec()
            .await?
            .ok_or("Updated snippet not found")?;

        Ok(snippet_with_relations)
    })
    .await
}
