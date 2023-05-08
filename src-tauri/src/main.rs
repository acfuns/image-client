#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    fs::{self, File, OpenOptions},
    io::Write,
};

use tokio::process::Command;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_file, run_bat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn save_file(file_data: Vec<u8>, file_name: String) {
    let file_path = format!("APAP-Image-Stitching/images/demo1/{}", file_name);
    let mut file = File::create(file_path).expect("Failed to create file");
    let mut txt = OpenOptions::new()
        .create(true)
        .append(true)
        .open("APAP-Image-Stitching/splits/demo1.txt")
        .unwrap();
    write!(txt, "{} ", file_name).unwrap();
    file.write_all(&file_data)
        .expect("Failed to write file data");
}

#[tauri::command]
async fn run_bat() {
    let output = Command::new("cmd")
        .args(&["/C", r".\APAP-Image-Stitching\demo_bat\demo1.bat"])
        .output()
        .await
        .unwrap();

    fs::write("APAP-Image-Stitching/splits/demo1.txt", "").unwrap();

    println!("status: {}", output.status);
    println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
    println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
}
