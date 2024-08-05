#[allow(warnings, unused)]
mod prisma;

pub use prisma::*;
pub use prisma_client_rust::{or, Direction, NewClientError, QueryError};
