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

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SnippetForm {
    pub title: String,
    pub language: String,
    pub code: String,
    pub tags: Vec<String>,
    pub state: SnippetState,
}

#[derive(Deserialize)]
pub struct SnippetFilter {
    pub title: Option<String>,
}
