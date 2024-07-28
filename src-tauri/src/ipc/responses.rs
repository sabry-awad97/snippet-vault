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

/// Represents the status of an IPC response.
#[derive(Serialize)]
pub enum IpcStatus {
    Success,
    Error,
}

/// Represents an IPC response, which may contain either an error or a simple result.
#[derive(Serialize)]
#[serde(untagged)]
pub enum Response<D>
where
    D: Serialize,
{
    Success { result: IpcSimpleResult<D> },
    Error { error: IpcError },
}

/// Represents an IPC response, which contains a status and a response.
#[derive(Serialize)]
pub struct IpcResponse<D>
where
    D: Serialize,
{
    pub status: IpcStatus,
    #[serde(flatten)]
    pub response: Response<D>,
}

impl<D> From<AppResult<D>> for IpcResponse<D>
where
    D: Serialize,
{
    /// Converts an `AppResult<D>` into an `IpcResponse<D>`.
    ///
    /// If the result is `Ok`, constructs an `IpcResponse` with `status` "Success" and `result` containing the data.
    /// If the result is `Err`, constructs an `IpcResponse` with `status` "Error" and `error` containing the error message.
    fn from(res: AppResult<D>) -> Self {
        match res {
            Ok(data) => IpcResponse {
                status: IpcStatus::Success,
                response: Response::Success {
                    result: IpcSimpleResult { data },
                },
            },
            Err(err) => IpcResponse {
                status: IpcStatus::Error,
                response: Response::Error {
                    error: IpcError {
                        message: format!("{}", err),
                    },
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
    /// If the result is `Ok`, constructs an `IpcResponse` with `status` "Success" and `result` containing the data.
    /// If the result is `Err`, constructs an `IpcResponse` with `status` "Error" and `error` containing the error message.
    fn from(res: Result<D, IpcError>) -> Self {
        match res {
            Ok(data) => IpcResponse {
                status: IpcStatus::Success,
                response: Response::Success {
                    result: IpcSimpleResult { data },
                },
            },
            Err(err) => IpcResponse {
                status: IpcStatus::Error,
                response: Response::Error { error: err },
            },
        }
    }
}
