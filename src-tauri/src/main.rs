// Prevents additional console window on Windows in release
// The following attribute conditionally applies settings based on the compilation environment.
// Specifically, when the code is not being compiled in debug mode and is being compiled on a Windows OS,
// it configures the program to use the Windows subsystem for GUI applications.
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database;
mod error;
mod ipc;
mod prelude;
mod state;

use ipc::commands;
use prelude::AppResult;
use state::init_state;
use tauri::Manager;

fn main() -> AppResult<()> {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .format_timestamp(None)
        .init();

    log::info!("Starting application...");

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }

            tauri::async_runtime::block_on(async {
                init_state(app.handle())
                    .await
                    .expect("Failed to initialize state");
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::auth::login,
            commands::auth::register,
            commands::auth::refresh_token,
            commands::user::get_user,
            commands::user::list_users,
            commands::user::update_user,
            commands::user::delete_user,
            commands::snippet::create_snippet,
            commands::snippet::get_snippet,
            commands::snippet::list_snippets,
            commands::snippet::update_snippet,
            commands::snippet::delete_snippet,
            commands::snippet::update_snippet_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
