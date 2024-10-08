// Prevents additional console window on Windows in release
// The following attribute conditionally applies settings based on the compilation environment.
// Specifically, when the code is not being compiled in debug mode and is being compiled on a Windows OS,
// it configures the program to use the Windows subsystem for GUI applications.
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chrono::Local;
use rodio::{Decoder, OutputStream, Sink};
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Arc, Mutex,
};
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, SystemTraySubmenu,
};

mod database;
mod error;
mod ipc;
mod prelude;
mod state;

use ipc::commands;
use prelude::AppResult;
use state::init_state;

// Include the sound file as bytes
const NOTIFICATION_SOUND: &[u8] = include_bytes!("../assets/notification_sound.wav");

#[derive(Clone, Serialize, Deserialize)]
struct NotificationSettings {
    sound_enabled: bool,
    volume: f32,
}

#[derive(Serialize, Deserialize)]
struct AppState {
    notification_count: AtomicUsize,
    notification_settings: NotificationSettings,
}

#[derive(Clone)]
enum MenuItemType {
    Normal(MenuItem),
    Submenu(String, Vec<MenuItem>),
    Separator,
}

type MenuItemHandler = Arc<dyn Fn(&AppHandle, &mut AppState) + Send + Sync>;

#[derive(Clone)]
struct MenuItem {
    id: String,
    title: String,
    handler: MenuItemHandler,
}

fn main() -> AppResult<()> {
    env_logger::init();
    log::info!("Starting application...");

    let app_state = Arc::new(Mutex::new(AppState {
        notification_count: AtomicUsize::new(0),
        notification_settings: NotificationSettings {
            sound_enabled: true,
            volume: 0.7,
        },
    }));

    let menu_items = vec![
        MenuItemType::Normal(MenuItem {
            id: "toggle_window".into(),
            title: "Toggle Window".into(),
            handler: Arc::new(|app, _| toggle_window(app)),
        }),
        MenuItemType::Separator,
        MenuItemType::Normal(MenuItem {
            id: "show_time".into(),
            title: "Show Time".into(),
            handler: Arc::new(|app, _| show_time(app)),
        }),
        MenuItemType::Normal(MenuItem {
            id: "send_notification".into(),
            title: "Send Notification".into(),
            handler: Arc::new(send_notification),
        }),
        MenuItemType::Normal(MenuItem {
            id: "show_stats".into(),
            title: "Show Stats".into(),
            handler: Arc::new(|app, state| show_stats(app, state)),
        }),
        MenuItemType::Normal(MenuItem {
            id: "change_notification_settings".into(),
            title: "Toggle Notification Sound".into(),
            handler: Arc::new(change_notification_settings),
        }),
        MenuItemType::Separator,
        MenuItemType::Normal(MenuItem {
            id: "quit".into(),
            title: "Quit".into(),
            handler: Arc::new(|app, _| app.exit(0)),
        }),
    ];

    let tray_menu = build_tray_menu(&menu_items);

    let app = tauri::Builder::default()
        .manage(app_state.clone())
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(move |app, event| match event {
            SystemTrayEvent::LeftClick { .. } => toggle_window(app),
            SystemTrayEvent::MenuItemClick { id, .. } => {
                handle_menu_item_click(app, &id, &menu_items, &app_state)
            }
            _ => {}
        })
        .setup(|app| {
            app.tray_handle()
                .set_tooltip("Welcome to the Snippet Vault")
                .expect("Failed to set default tooltip");

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
            commands::tag::create_tag,
            commands::tag::get_tag,
            commands::tag::list_tags,
            commands::tag::update_tag,
            commands::tag::delete_tag
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_, _| {});

    Ok(())
}

fn build_tray_menu(menu_items: &[MenuItemType]) -> SystemTrayMenu {
    let mut tray_menu = SystemTrayMenu::new();

    for item in menu_items {
        match item {
            MenuItemType::Normal(menu_item) => {
                tray_menu = tray_menu.add_item(CustomMenuItem::new(
                    menu_item.id.clone(),
                    menu_item.title.clone(),
                ));
            }
            MenuItemType::Submenu(title, submenu_items) => {
                let submenu = build_submenu(submenu_items);
                tray_menu = tray_menu.add_submenu(SystemTraySubmenu::new(title.clone(), submenu));
            }
            MenuItemType::Separator => {
                tray_menu = tray_menu.add_native_item(SystemTrayMenuItem::Separator);
            }
        }
    }

    tray_menu
}

fn build_submenu(submenu_items: &[MenuItem]) -> SystemTrayMenu {
    let mut submenu = SystemTrayMenu::new();
    for item in submenu_items {
        submenu = submenu.add_item(CustomMenuItem::new(item.id.clone(), item.title.clone()));
    }
    submenu
}

fn handle_menu_item_click(
    app: &AppHandle,
    id: &str,
    menu_items: &[MenuItemType],
    app_state: &Arc<Mutex<AppState>>,
) {
    let find_and_execute = |items: &[MenuItem]| {
        if let Some(item) = items.iter().find(|item| item.id == id) {
            let mut state = app_state.lock().unwrap();
            (item.handler)(app, &mut state);
            return true;
        }
        false
    };

    for item in menu_items {
        match item {
            MenuItemType::Normal(menu_item) => {
                if find_and_execute(&[menu_item.clone()]) {
                    return;
                }
            }
            MenuItemType::Submenu(_, submenu_items) => {
                if find_and_execute(submenu_items) {
                    return;
                }
            }
            MenuItemType::Separator => {}
        }
    }
}

fn toggle_window(app: &AppHandle) {
    if let Some(window) = app.get_window("main") {
        if window.is_visible().unwrap_or(false) {
            window.hide().unwrap();
        } else {
            window.show().unwrap();
            window.set_focus().unwrap();
        }
    }
}

fn show_time(app: &AppHandle) {
    let time = Local::now().format("%H:%M:%S").to_string();
    app.tray_handle()
        .set_tooltip(&format!("Current time: {}", time))
        .unwrap();
}

fn send_notification(app: &AppHandle, state: &mut AppState) {
    let count = state.notification_count.fetch_add(1, Ordering::Relaxed) + 1;

    // Update the system tray icon
    app.tray_handle()
        .set_icon(tauri::Icon::Raw(
            include_bytes!("../icons/icon_notification.png").to_vec(),
        ))
        .unwrap();

    // Create and show the notification
    tauri::api::notification::Notification::new(app.config().tauri.bundle.identifier.clone())
        .title("New Notification")
        .body(format!("This is test notification #{}", count))
        .icon("icon.png")
        .notify(app)
        .unwrap();

    // Play notification sound
    if state.notification_settings.sound_enabled {
        play_notification_sound(&state.notification_settings);
    }

    // Reset the tray icon after 5 seconds
    let app_handle = app.clone();
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_secs(5));
        app_handle
            .tray_handle()
            .set_icon(tauri::Icon::Raw(
                include_bytes!("../icons/icon_default.png").to_vec(),
            ))
            .unwrap();
    });
}

fn play_notification_sound(settings: &NotificationSettings) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    let cursor = Cursor::new(NOTIFICATION_SOUND);
    let source = Decoder::new(cursor).unwrap();

    sink.set_volume(settings.volume);
    sink.append(source);
    sink.sleep_until_end();
}

fn show_stats(app: &AppHandle, state: &AppState) {
    let count = state.notification_count.load(Ordering::Relaxed);
    let stats = format!("Notifications sent: {}", count);
    app.tray_handle().set_tooltip(&stats).unwrap();
}

fn change_notification_settings(app: &AppHandle, state: &mut AppState) {
    state.notification_settings.sound_enabled = !state.notification_settings.sound_enabled;

    let status = if state.notification_settings.sound_enabled {
        "enabled"
    } else {
        "disabled"
    };

    app.tray_handle()
        .set_tooltip(&format!("Notification sound {}", status))
        .unwrap();
}
