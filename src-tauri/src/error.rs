#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Bcrypt error: {0}")]
    BcryptError(#[from] bcrypt::BcryptError),
    #[error("Figment error: {0}")]
    FigmentError(#[from] figment::Error),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("JWT error: {0}")]
    JwtError(#[from] jsonwebtoken::errors::Error),
    #[error("Prisma query error: {0}")]
    PrismaQueryError(#[from] prisma::QueryError),
    #[error("Serde error: {0}")]
    SerdeError(#[from] serde_json::Error),
    #[error("Tauri error: {0}")]
    TauriError(#[from] tauri::Error),

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
