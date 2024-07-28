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

/// Represents an IPC response, which may contain either an error or a simple result.
#[derive(Serialize)]
pub struct IpcResponse<D>
where
    D: Serialize,
{
    pub error: Option<IpcError>,
    pub result: Option<IpcSimpleResult<D>>,
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
            Ok(data) => Self::from_ok(data),
            Err(err) => Self::from_error(IpcError {
                message: format!("{}", err),
            }),
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
            Ok(data) => Self::from_ok(data),
            Err(err) => Self::from_error(err),
        }
    }
}

impl<D> IpcResponse<D>
where
    D: Serialize,
{
    /// Converts the `IpcResponse<D>` into a `Result<D, IpcError>`.
    fn into_result(self) -> Result<D, IpcError> {
        match self {
            Self {
                error: None,
                result: Some(IpcSimpleResult { data }),
            } => Ok(data),
            Self {
                error: Some(err),
                result: None,
            } => Err(err),
            _ => panic!("IpcResponse is in an invalid state"),
        }
    }

    /// Constructs an `IpcResponse` from an error.
    fn from_error(error: IpcError) -> Self {
        Self {
            error: Some(error),
            result: None,
        }
    }

    /// Constructs an `IpcResponse` from a successful result.
    fn from_ok(data: D) -> Self {
        Self {
            error: None,
            result: Some(IpcSimpleResult { data }),
        }
    }
}
