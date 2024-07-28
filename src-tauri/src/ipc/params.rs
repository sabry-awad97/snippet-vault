use serde::Deserialize;

#[derive(Deserialize)]
pub struct PostParams<D> {
    pub data: D,
}

#[derive(Deserialize)]
pub struct PutParams<D> {
    pub id: String,
    pub data: D,
}

#[derive(Deserialize)]
pub struct ListParams<F> {
    pub filter: Option<F>,
}

#[derive(Deserialize)]
pub struct GetParams {
    pub id: String,
}

#[derive(Deserialize)]
pub struct DeleteParams {
    pub id: String,
}
