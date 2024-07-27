#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error("Prisma Client Error: {0}")]
    NewClientError(#[from] prisma::NewClientError),
    #[error("Prisma Query Error: {0}")]
    QueryError(#[from] prisma::QueryError),
}

impl serde::Serialize for DbError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error(transparent)]
    QueryError(#[from] DbError),

    #[error("Error: {0}")]
    Other(String),
}

impl From<&str> for AppError {
    fn from(s: &str) -> Self {
        AppError::Other(s.to_string())
    }
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
