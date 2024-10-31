use std::iter;

use wasm_bindgen::prelude::*;

use crate::{reader::{Reader, Writer}, remapper::Remapper, song::{Song, SongSteps, V4_OFFSETS}};

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    // #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}


#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}


#[wasm_bindgen]
pub fn init() {
    set_panic_hook();
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
pub fn write_song(song: &WasmSong, current_song: js_sys::Uint8Array) -> Result<js_sys::Uint8Array, String> {
    if !song.song.version.at_least(4, 0) {
        return Err("Only version 4 song can be written".into())
    }

    let mut w = Writer::new(current_song.to_vec());
    song.song.write_patterns(V4_OFFSETS, &mut w);
    Ok(js_sys::Uint8Array::from(&w.finish()[..]))
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

#[wasm_bindgen]
pub unsafe fn get_song_steps(song: &WasmSong) -> js_sys::Uint8Array {
    let slice : &[u8] = &song.song.song.steps;
    js_sys::Uint8Array::view(slice)
}

/// Get a chain by copy of its content
#[wasm_bindgen]
pub unsafe fn get_chain_steps(song: &WasmSong, chain_index: usize) -> js_sys::Uint8Array {
    let chain = &song.song.chains[chain_index].steps;
    let out_arr = js_sys::Uint8Array::new_with_length((chain.len() * 2) as u32);
    let mut write_cursor = 0;

    for cs in chain {
        out_arr.set_index(write_cursor, cs.phrase);
        write_cursor += 1;
        out_arr.set_index(write_cursor, cs.transpose);
        write_cursor += 1;
    }

    out_arr
}

#[wasm_bindgen]
pub fn show_phrase(song: &WasmSong, phrase: usize) -> String {
    song.song.phrases[phrase].print_screen()
}

#[wasm_bindgen]
pub fn renumber_chain(song: &mut WasmSong, chain: usize, to_chain: usize) -> Result<bool, String> {
    if chain >= Song::N_CHAINS { return Err(format!("Error invalid source chain number {chain}")) }
    if to_chain >= Song::N_CHAINS { return Err(format!("Error invalid destination chain number {to_chain}")) }

    if chain == to_chain { return Ok(true) }

    if !song.song.chains[to_chain].is_empty() {
        return Err(format!("Destination chain {to_chain} is not empty"))
    }

    song.song.chains[to_chain] = song.song.chains[chain].clone();

    let song_steps = &mut song.song.song.steps;
    for i in 0 .. song_steps.len() {
        if song_steps[i] == chain as u8 {
            song_steps[i] = to_chain as u8 ;
        }
    }

    log(&format!("RENUMBERED {chain} -> {to_chain}"));

    Ok(true)
}

#[wasm_bindgen]
pub fn copy_chain(
    from: &WasmSong,
    to: &mut WasmSong,
    chain: usize,
    x: usize,
    y: usize) -> Result<String, String> {

    if x >= SongSteps::TRACK_COUNT { return Err(format!("Invalid track number {x}")) }
    if y >= SongSteps::ROW_COUNT { return Err(format!("Invalid row number {y}")) }

    let from_song = &from.song;
    let to_song = &mut to.song;

    let mapping =
        Remapper::create(from_song, to_song, iter::once(&(chain as u8)))?;

    mapping.apply(from_song, to_song);
    let final_chain = mapping.out_chain(chain as u8);

    to_song.song.steps[x + y * SongSteps::TRACK_COUNT] = final_chain;

    Ok(mapping.print())
}