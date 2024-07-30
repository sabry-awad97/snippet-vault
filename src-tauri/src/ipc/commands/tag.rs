use crate::{
    database::{
        handle_db_operation,
        models::{Tag, TagFilter, TagForm},
    },
    ipc::{
        params::{DeleteParams, GetParams, ListParams, PostParams, PutParams},
        responses::IpcResponse,
    },
};
use log::{error, info};
use tauri::AppHandle;

#[tauri::command]
pub async fn create_tag(app: AppHandle, params: PostParams<TagForm>) -> IpcResponse<Tag> {
    info!("Creating tag with name: {}", params.data.name);
    handle_db_operation(app, move |client| async move {
        let data = params.data;

        let tag = match client
            .tag()
            .create(
                data.name,
                vec![
                    prisma::tag::color::set(data.color),
                    prisma::tag::snippet_ids::set(data.snippet_ids),
                ],
            )
            .exec()
            .await
        {
            Ok(tag) => {
                info!("Successfully created tag with ID: {}", tag.id);
                tag
            }
            Err(e) => {
                error!("Failed to create tag: {}", e);
                return Err(e.into());
            }
        };

        Ok(tag)
    })
    .await
}

#[tauri::command]
pub async fn get_tag(app: AppHandle, params: GetParams) -> IpcResponse<Option<Tag>> {
    info!("Fetching tag with ID: {}", params.id);
    handle_db_operation(app, |client| async move {
        let tag: Option<Tag> = client
            .tag()
            .find_unique(prisma::tag::id::equals(params.id.to_owned()))
            .with(prisma::tag::snippets::fetch(vec![]))
            .exec()
            .await?;

        if let Some(tag) = tag.as_ref() {
            info!("Successfully fetched tag with ID: {}", tag.id);
        } else {
            error!("Tag with ID: {} not found", params.id);
        }

        Ok(tag)
    })
    .await
}

#[tauri::command]
pub async fn list_tags(app: AppHandle, params: ListParams<TagFilter>) -> IpcResponse<Vec<Tag>> {
    info!("Listing tags with filter: {:?}", params.filter);
    let where_params = build_tag_filters(params.filter);
    handle_db_operation(app, |client| async move {
        let tags = match client
            .tag()
            .find_many(where_params)
            .with(prisma::tag::snippets::fetch(vec![]))
            .exec()
            .await
        {
            Ok(tags) => {
                info!("Found {} tags", tags.len());
                tags
            }
            Err(e) => {
                error!("Failed to list tags: {}", e);
                return Err(e.into());
            }
        };

        Ok(tags)
    })
    .await
}

#[tauri::command]
pub async fn update_tag(app: AppHandle, params: PutParams<TagForm>) -> IpcResponse<Tag> {
    info!("Updating tag with ID: {}", params.id);
    handle_db_operation(app, move |client| async move {
        let data = params.data;

        let update_params = vec![
            prisma::tag::name::set(data.name),
            prisma::tag::color::set(data.color),
            prisma::tag::snippet_ids::set(data.snippet_ids),
        ];

        let updated_tag = match client
            .tag()
            .update(prisma::tag::id::equals(params.id.to_owned()), update_params)
            .exec()
            .await
        {
            Ok(tag) => {
                info!("Successfully updated tag with ID: {}", tag.id);
                tag
            }
            Err(e) => {
                error!("Failed to update tag with ID: {}: {}", params.id, e);
                return Err(e.into());
            }
        };

        Ok(updated_tag)
    })
    .await
}

#[tauri::command]
pub async fn delete_tag(app: AppHandle, params: DeleteParams) -> IpcResponse<Tag> {
    info!("Deleting tag with ID: {}", params.id);
    handle_db_operation(app, |client| async move {
        let tag = match client
            .tag()
            .delete(prisma::tag::id::equals(params.id.to_owned()))
            .exec()
            .await
        {
            Ok(tag) => {
                info!("Successfully deleted tag with ID: {}", tag.id);
                tag
            }
            Err(e) => {
                error!("Failed to delete tag with ID: {}: {}", params.id, e);
                return Err(e.into());
            }
        };

        Ok(tag)
    })
    .await
}

fn build_tag_filters(filter: Option<TagFilter>) -> Vec<prisma::tag::WhereParam> {
    let mut where_params = vec![];
    if let Some(filter) = filter {
        if let Some(name) = filter.name {
            where_params.push(prisma::tag::name::contains(name));
        }
    }
    where_params
}
