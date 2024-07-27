use prisma::PrismaClient;

use crate::error::DbError;

pub async fn init_db() -> Result<PrismaClient, DbError> {
    let client: PrismaClient = PrismaClient::_builder().build().await?;
    Ok(client)
}
