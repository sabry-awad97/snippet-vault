use crate::{
    database::{
        handle_db_operation,
        models::{Snippet, SnippetFilter, SnippetForm, SnippetState, SnippetStateUpdate},
    },
    ipc::{
        params::{DeleteParams, GetParams, ListParams, PostParams, PutParams},
        responses::IpcResponse,
    },
};
use log::{debug, error, info};
use prisma::Direction;
use serde::Serialize;
use tauri::AppHandle;

#[tauri::command]
pub async fn create_snippet(
    app: AppHandle,
    params: PostParams<SnippetForm>,
) -> IpcResponse<Snippet> {
    info!("Creating snippet with title: {}", params.data.title);
    handle_db_operation(app, move |client| async move {
        let data = params.data;

        let state = client.snippet_state().create(vec![]).exec().await?;

        let snippet = match client
            .snippet()
            .create(
                data.title,
                data.description,
                data.language,
                data.code,
                prisma::snippet_state::id::equals(state.id),
                vec![prisma::snippet::tag_ids::set(data.tag_ids)],
            )
            .exec()
            .await
        {
            Ok(snippet) => snippet,
            Err(e) => {
                error!("Failed to create snippet: {}", e);
                return Err(e.into());
            }
        };

        let snippet_with_relations: Option<Snippet> = client
            .snippet()
            .find_unique(prisma::snippet::id::equals(snippet.id))
            .with(prisma::snippet::state::fetch())
            .with(prisma::snippet::tags::fetch(vec![]))
            .exec()
            .await?;

        if let Some(snippet) = snippet_with_relations {
            info!("Successfully created snippet with ID: {}", snippet.id);
            return Ok(snippet);
        }

        error!("Snippet not found after creation");
        Err("Snippet not found".into())
    })
    .await
}

#[tauri::command]
pub async fn get_snippet(app: AppHandle, params: GetParams) -> IpcResponse<Option<Snippet>> {
    info!("Fetching snippet with ID: {}", params.id);
    handle_db_operation(app, |client| async move {
        let snippet_with_relations: Option<Snippet> = client
            .snippet()
            .find_unique(prisma::snippet::id::equals(params.id.to_owned()))
            .with(prisma::snippet::state::fetch())
            .with(prisma::snippet::tags::fetch(vec![]))
            .exec()
            .await?;

        if snippet_with_relations.is_some() {
            info!("Successfully fetched snippet with ID: {}", params.id);
        } else {
            debug!("Snippet with ID: {} not found", params.id);
        }

        Ok(snippet_with_relations)
    })
    .await
}

#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub total: i64,
    pub page: usize,
    pub page_size: usize,
}

#[tauri::command]
pub async fn list_snippets(
    app: AppHandle,
    params: ListParams<SnippetFilter>,
) -> IpcResponse<Vec<Snippet>> {
    // const DEFAULT_PAGE: i64 = 0;
    // const DEFAULT_PAGE_SIZE: i64 = 20;

    info!("Listing snippets with filter: {:?}", params.filter);
    handle_db_operation(app, move |client| async move {
        let where_params = build_snippet_filters(params.filter);

        // let total = client.snippet().count(where_params.clone()).exec().await?;

        // let page = params.page.unwrap_or(DEFAULT_PAGE);
        // let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);

        let snippets = client
            .snippet()
            .find_many(where_params)
            .with(prisma::snippet::state::fetch())
            .with(prisma::snippet::tags::fetch(vec![]))
            .order_by(prisma::snippet::created_at::order(Direction::Desc))
            // .skip(page * page_size)
            // .take(page_size)
            .exec()
            .await?;

        info!("Found {} snippets", snippets.len());
        Ok(snippets)
    })
    .await
}

#[tauri::command]
pub async fn update_snippet(
    app: AppHandle,
    params: PutParams<SnippetForm>,
) -> IpcResponse<Snippet> {
    info!("Updating snippet with ID: {}", params.id);
    handle_db_operation(app, move |client| async move {
        let data = params.data;

        let update_params = vec![
            prisma::snippet::title::set(data.title),
            prisma::snippet::description::set(data.description),
            prisma::snippet::language::set(data.language),
            prisma::snippet::code::set(data.code),
            prisma::snippet::tag_ids::set(data.tag_ids),
            prisma::snippet::snippet_state_id::set(data.snippet_state_id),
        ];

        let updated_snippet = match client
            .snippet()
            .update(
                prisma::snippet::id::equals(params.id.to_owned()),
                update_params,
            )
            .exec()
            .await
        {
            Ok(snippet) => snippet,
            Err(e) => {
                error!("Failed to update snippet with ID: {}: {}", params.id, e);
                return Err(e.into());
            }
        };

        let snippet_with_relations: Option<Snippet> = client
            .snippet()
            .find_unique(prisma::snippet::id::equals(updated_snippet.id))
            .with(prisma::snippet::state::fetch())
            .with(prisma::snippet::tags::fetch(vec![]))
            .exec()
            .await?;

        if let Some(snippet) = snippet_with_relations {
            info!("Successfully updated snippet with ID: {}", snippet.id);
            return Ok(snippet);
        }

        error!("Updated snippet with ID: {} not found", params.id);
        Err("Updated snippet not found".into())
    })
    .await
}

#[tauri::command]
pub async fn delete_snippet(app: AppHandle, params: DeleteParams) -> IpcResponse<Snippet> {
    info!("Deleting snippet with ID: {}", params.id);
    handle_db_operation(app, |client| async move {
        let snippet = match client
            .snippet()
            .delete(prisma::snippet::id::equals(params.id.to_owned()))
            .exec()
            .await
        {
            Ok(snippet) => {
                info!("Successfully deleted snippet with ID: {}", params.id);
                snippet
            }
            Err(e) => {
                error!("Failed to delete snippet with ID: {}: {}", params.id, e);
                return Err(e.into());
            }
        };

        Ok(snippet)
    })
    .await
}

fn build_snippet_filters(filter: Option<SnippetFilter>) -> Vec<prisma::snippet::WhereParam> {
    let mut where_params = vec![];
    if let Some(filter) = filter {
        if let Some(search) = filter.search {
            where_params.push(prisma::or![
                prisma::snippet::title::contains(search.clone()),
                prisma::snippet::description::contains(search.clone()),
                prisma::snippet::code::contains(search.clone()),
                prisma::snippet::language::contains(search),
            ]);
        }

        if let Some(title) = filter.title {
            where_params.push(prisma::snippet::title::contains(title));
        }
        if let Some(description) = filter.description {
            where_params.push(prisma::snippet::description::contains(description));
        }
        if let Some(language) = filter.language {
            where_params.push(prisma::snippet::language::equals(language));
        }
        if let Some(code) = filter.code {
            where_params.push(prisma::snippet::code::contains(code));
        }
        if let Some(state) = filter.state {
            let mut state_params = vec![];
            if let Some(is_favorite) = state.is_favorite {
                state_params.push(prisma::snippet_state::is_favorite::equals(is_favorite));
            }
            if let Some(is_dark) = state.is_dark {
                state_params.push(prisma::snippet_state::is_dark::equals(is_dark));
            }
            if !state_params.is_empty() {
                where_params.push(prisma::snippet::state::is(state_params));
            }
        }
        if let Some(tags) = filter.tags {
            if !tags.is_empty() {
                where_params.push(prisma::snippet::tags::some(vec![
                    prisma::tag::name::in_vec(tags),
                ]));
            }
        }
    }
    where_params
}

#[tauri::command]
pub async fn update_snippet_state(
    app: AppHandle,
    params: PutParams<SnippetStateUpdate>,
) -> IpcResponse<SnippetState> {
    handle_db_operation(app, move |client| async move {
        let mut updated_params = vec![];

        if let Some(is_dark) = params.data.is_dark {
            updated_params.push(prisma::snippet_state::is_dark::set(is_dark));
        }

        if let Some(is_favorite) = params.data.is_favorite {
            updated_params.push(prisma::snippet_state::is_favorite::set(is_favorite));
        }

        // Update the SnippetState
        let updated_state: SnippetState = client
            .snippet_state()
            .update(
                prisma::snippet_state::id::equals(params.id.clone()),
                updated_params,
            )
            .exec()
            .await?;

        Ok(updated_state)
    })
    .await
}
