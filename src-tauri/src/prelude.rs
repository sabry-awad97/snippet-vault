use crate::error::AppError;

pub type AppResult<T> = std::result::Result<T, AppError>;

#[allow(unused)]
pub struct W<T>(pub T);
