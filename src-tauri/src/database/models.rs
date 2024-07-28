use serde::Deserialize;

pub type User = prisma::user::Data;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserData {
    pub email: String,
    pub password_hash: String,
}

#[derive(Deserialize)]
pub struct UserFilter {
    pub email: Option<String>,
}
