use wasm_bindgen::prelude::*;

use crate::{reader::Reader, song::Song};

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}


#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}


#[wasm_bindgen]
pub fn a_number() -> f32 {
    18.0
}

#[wasm_bindgen]
pub struct WasmSong {
    song: Song
}

#[wasm_bindgen]
pub fn song_name(song: &WasmSong) -> String {
    song.song.name.clone()
}

#[wasm_bindgen]
pub fn load_song(arr: js_sys::Uint8Array) -> Result<WasmSong, String> {
    let as_vec : Vec<u8> = arr.to_vec();
    let mut reader = Reader::new(as_vec);
    let song = Song::read(&mut reader);

    match song {
        Ok(song) => Ok(WasmSong { song }),
        Err(psr) => Err(psr.to_string())
    }
}
