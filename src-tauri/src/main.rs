use chrono::Local;
use rodio::{Decoder, OutputStream, Sink};
use serde::{Deserialize, Serialize};
use std::{
    fs::File,
    io::BufReader,
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc, Mutex,
    },
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

#[derive(Serialize, Deserialize)]
struct AppState {
    notification_count: AtomicUsize,
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
            // Set the default tooltip here
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

    // Play the notification sound
    let sound_file_path = "./assets/notification_sound.wav";
    play_sound(sound_file_path.to_owned());

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

fn show_stats(app: &AppHandle, state: &AppState) {
    let count = state.notification_count.load(Ordering::Relaxed);
    let stats = format!("Notifications sent: {}", count);
    app.tray_handle().set_tooltip(&stats).unwrap();
}

fn play_sound(path: String) {
    std::thread::spawn(move || {
        // Get a output stream handle to the default physical sound device
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();
        let file = BufReader::new(File::open(path).unwrap());
        let source = Decoder::new(file).unwrap();
        sink.append(source);
        sink.sleep_until_end();
    });
}
