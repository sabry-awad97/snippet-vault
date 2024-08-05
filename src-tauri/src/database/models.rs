use serde::{Deserialize, Serialize};

pub type User = prisma::user::Data;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserForm {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UserFilter {
    pub email: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthPayload {
    pub access_token: String,
    pub refresh_token: String,
    pub user: User,
}

pub type SnippetState = prisma::snippet_state::Data;
pub type Snippet = prisma::snippet::Data;
pub type Tag = prisma::tag::Data;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SnippetForm {
    pub title: String,
    pub description: String,
    pub language: String,
    pub code: String,
    pub tag_ids: Vec<String>,
    pub snippet_state_id: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SnippetFilter {
    pub search: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub language: Option<String>,
    pub code: Option<String>,
    pub state: Option<SnippetStateUpdate>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SnippetStateUpdate {
    pub is_favorite: Option<bool>,
    pub is_dark: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TagForm {
    pub name: String,
    pub color: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TagFilter {
    pub name: Option<String>,
}
