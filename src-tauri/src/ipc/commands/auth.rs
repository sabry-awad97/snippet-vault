use crate::{
    database::{
        handle_db_operation,
        models::{AuthPayload, Credentials, UserForm},
    },
    ipc::{params::PostParams, responses::IpcResponse},
};

use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String,
    exp: i64,
    iat: i64,
}

const JWT_SECRET: &[u8] = b"SECRET_KEY";

const ACCESS_TOKEN_EXPIRATION_HOURS: i64 = 12; // 12 hours
const REFRESH_TOKEN_EXPIRATION_HOURS: i64 = 24 * 7; // 1 week

pub fn create_token(
    email: &str,
    expiration_hours: i64,
) -> Result<String, jsonwebtoken::errors::Error> {
    let claims = Claims {
        sub: email.to_owned(),
        exp: Utc::now()
            .checked_add_signed(Duration::hours(expiration_hours))
            .expect("valid timestamp")
            .timestamp(),
        iat: Utc::now().timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET),
    )?;

    Ok(token)
}

#[tauri::command]
pub async fn login(app: AppHandle, params: PostParams<Credentials>) -> IpcResponse<AuthPayload> {
    handle_db_operation(app, |client| async move {
        let user = client
            .user()
            .find_first(vec![prisma::user::email::equals(params.data.email)])
            .exec()
            .await?;

        if let Some(user) = user {
            if !verify(params.data.password, &user.password_hash).unwrap_or(false) {
                return Err("Invalid password".into());
            }

            let token = create_token(&user.email, ACCESS_TOKEN_EXPIRATION_HOURS)?;
            let refresh_token = create_token(&user.email, REFRESH_TOKEN_EXPIRATION_HOURS)?;

            return Ok(AuthPayload {
                token,
                refresh_token,
                user,
            });
        }

        Err("Invalid credentials".into())
    })
    .await
}

#[tauri::command]
pub async fn register(app: AppHandle, params: PostParams<UserForm>) -> IpcResponse<AuthPayload> {
    handle_db_operation(app, |client| async move {
        let hashed_password = hash(params.data.password, DEFAULT_COST)?;

        let new_user = client
            .user()
            .create(params.data.email, hashed_password, vec![])
            .exec()
            .await?;

        let access_token = create_token(&new_user.email, ACCESS_TOKEN_EXPIRATION_HOURS)?;
        let refresh_token = create_token(&new_user.email, REFRESH_TOKEN_EXPIRATION_HOURS)?;

        Ok(AuthPayload {
            token: access_token,
            refresh_token,
            user: new_user,
        })
    })
    .await
}

#[tauri::command]
pub async fn refresh_token(app: AppHandle, params: PostParams<String>) -> IpcResponse<AuthPayload> {
    handle_db_operation(app, |client| async move {
        let token = decode::<Claims>(
            &params.data,
            &DecodingKey::from_secret(JWT_SECRET),
            &Validation::default(),
        )?;
        let user = client
            .user()
            .find_unique(prisma::user::email::equals(token.claims.sub))
            .exec()
            .await?;

        if let Some(user) = user {
            let access_token = create_token(&user.email, ACCESS_TOKEN_EXPIRATION_HOURS)?;
            let refresh_token = create_token(&user.email, REFRESH_TOKEN_EXPIRATION_HOURS)?;

            return Ok(AuthPayload {
                token: access_token,
                refresh_token,
                user,
            });
        }

        Err("Invalid refresh token".into())
    })
    .await
}
