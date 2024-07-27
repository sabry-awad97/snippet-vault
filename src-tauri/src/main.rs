// Prevents additional console window on Windows in release
// The following attribute conditionally applies settings based on the compilation environment.
// Specifically, when the code is not being compiled in debug mode and is being compiled on a Windows OS,
// it configures the program to use the Windows subsystem for GUI applications.
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod database;
mod error;
mod state;

use state::init_state;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
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
        .invoke_handler(tauri::generate_handler![greet, commands::user::get_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
