use crate::prelude::AppResult;
use serde::Serialize;

/// Represents an error message for IPC communication.
#[derive(Serialize)]
pub struct IpcError {
    pub message: String,
}

/// Represents a simple result for IPC communication, containing data.
#[derive(Serialize)]
pub struct IpcSimpleResult<D>
where
    D: Serialize,
{
    pub data: D,
}

/// Represents the status of an IPC response, which may contain either an error or a simple result.
#[derive(Serialize)]
#[serde(untagged)]
pub enum IpcResponse<D>
where
    D: Serialize,
{
    Success { result: IpcSimpleResult<D> },
    Error { error: IpcError },
}

impl<D> From<AppResult<D>> for IpcResponse<D>
where
    D: Serialize,
{
    /// Converts an `AppResult<D>` into an `IpcResponse<D>`.
    ///
    /// If the result is `Ok`, constructs an `IpcResponse` with `result` containing the data.
    /// If the result is `Err`, constructs an `IpcResponse` with `error` containing the error message.
    fn from(res: AppResult<D>) -> Self {
        match res {
            Ok(data) => IpcResponse::Success {
                result: IpcSimpleResult { data },
            },
            Err(err) => IpcResponse::Error {
                error: IpcError {
                    message: format!("{}", err),
                },
            },
        }
    }
}

impl<D> From<Result<D, IpcError>> for IpcResponse<D>
where
    D: Serialize,
{
    /// Converts a `Result<D, IpcError>` into an `IpcResponse<D>`.
    ///
    /// If the result is `Ok`, constructs an `IpcResponse` with `result` containing the data.
    /// If the result is `Err`, constructs an `IpcResponse` with `error` containing the error message.
    fn from(res: Result<D, IpcError>) -> Self {
        match res {
            Ok(data) => IpcResponse::Success {
                result: IpcSimpleResult { data },
            },
            Err(err) => IpcResponse::Error { error: err },
        }
    }
}

impl<D> IpcResponse<D>
where
    D: Serialize,
{
    /// Converts the `IpcResponse<D>` into a `Result<D, IpcError>`.
    #[allow(dead_code)]
    fn into_result(self) -> Result<D, IpcError> {
        match self {
            IpcResponse::Success { result } => Ok(result.data),
            IpcResponse::Error { error } => Err(error),
        }
    }
}
