use serde::{Deserialize, Serialize};

pub type User = prisma::user::Data;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserForm {
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
pub struct AuthPayload {
    pub token: String,
    pub refresh_token: String,
    pub user: User,
}
