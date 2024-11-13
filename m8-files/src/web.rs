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
    pub fn alert(s: &str);

    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}


#[wasm_bindgen]
pub fn init() { set_panic_hook(); }

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
    if phrase >= Song::N_PHRASES {
        return format!("Invalid phrase number {phrase:02x}");
    }

    let song = &song.song;
    song.phrases[phrase].print_screen(&song.instruments)
}

#[wasm_bindgen]
pub fn show_table(song: &WasmSong, table: usize) -> String {
    if table >= Song::N_TABLES {
        return format!("Invalid table number {table:02x}");
    }

    let song = &song.song;
    song.table_view(table).to_string()
}

#[wasm_bindgen]
pub fn rename_instrument(song: &mut WasmSong, instrument: usize, new_name: String) -> Result<bool, String> {
    if instrument >= Song::N_INSTRUMENTS {
        return Err(format!("Error invalid source instrument number {instrument}"));
    }

    if new_name.len() > 12 {
        return Err(format!("name \"{new_name}\" is too long (12 max) "));
    }

    song.song.instruments[instrument].set_name(new_name);

    Ok(true)
}


#[wasm_bindgen]
pub fn renumber_table(song: &mut WasmSong, table: usize, to_table: usize) -> Result<bool, String> {
    if table >= Song::N_TABLES {
        return Err(format!("Invalid table number {table:02X}"))
    }

    if to_table >= Song::N_TABLES {
        return Err(format!("Invalid destination table number {to_table:02X}"))
    }

    if table <= Song::N_INSTRUMENTS {
        return Err(format!("Cannot renumber instrument table {table:02X}"))
    }

    if to_table <= Song::N_INSTRUMENTS {
        return Err(format!("Cannot renumber to instrument table {to_table:02X}"))
    }

    if !song.song.tables[to_table].is_empty() {
        return Err(format!("Destination table is not empty"))
    }

    let mut remapper = Remapper::default();
    remapper.table_mapping.remap_table(table as u8, to_table as u8);
    remapper.renumber(&mut song.song);

    Ok(true)
}

#[wasm_bindgen]
pub fn renumber_instrument(song: &mut WasmSong, instrument: usize, to_instrument: usize) -> Result<bool, String> {
    if instrument >= Song::N_INSTRUMENTS {
        return Err(format!("Error invalid source instrument number {instrument:02X}"));
    }

    if to_instrument >= Song::N_INSTRUMENTS {
        return Err(format!("Error invalid source destination number {to_instrument:02X}"));
    }

    if ! song.song.instruments[to_instrument].is_empty() {
        return Err(format!("Destination instrument {to_instrument:02X} is not empty"));
    }

    let mut remapper = Remapper::default();
    remapper.instrument_mapping.mapping[instrument] = to_instrument as u8;
    remapper.instrument_mapping.to_move.push(instrument as u8);
    remapper.renumber(&mut song.song);

    Ok(true)
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
    song.song.chains[chain].clear();

    let song_steps = &mut song.song.song.steps;
    for i in 0 .. song_steps.len() {
        if song_steps[i] == chain as u8 {
            song_steps[i] = to_chain as u8 ;
        }
    }

    Ok(true)
}

#[wasm_bindgen]
pub fn renumber_phrase(song: &mut WasmSong, phrase: usize, to_phrase: usize) -> Result<bool, String> {
    if phrase >= Song::N_PHRASES { return Err(format!("Error invalid source phrase number {phrase}")) }
    if to_phrase >= Song::N_PHRASES { return Err(format!("Error invalid destination phrase number {to_phrase}")) }

    if phrase == to_phrase { return Ok(true) }

    if !song.song.phrases[to_phrase].is_empty() {
        return Err(format!("Destination phrase {to_phrase} is not empty"))
    }

    let mut remapper = Remapper::default();
    remapper.phrase_mapping.mapping[phrase] = to_phrase as u8;
    remapper.phrase_mapping.to_move.push(phrase as u8);
    remapper.renumber(&mut song.song);

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

#[wasm_bindgen]
pub fn instrument_name(song: &WasmSong, instr: u8) -> String {
    String::from(song.song.instruments[instr as usize].name().unwrap_or(&""))
}

#[wasm_bindgen]
pub fn allocated_instrument_list(song: &WasmSong) -> Vec<usize> {
    song.song.instruments
        .iter()
        .enumerate()
        .filter_map(|(i, inst)|
            if inst.is_empty() { None } else { Some(i) })
        .collect()
}

#[wasm_bindgen]
pub fn allocated_phrase_list(song: &WasmSong) -> Vec<usize> {
    song.song.phrases
        .iter()
        .enumerate()
        .filter_map(|(i, phrase)|
            if phrase.is_empty() { None } else { Some(i) })
        .collect()
}

#[wasm_bindgen]
pub fn allocated_chain_list(song: &WasmSong) -> Vec<usize> {
    song.song.chains
        .iter()
        .enumerate()
        .filter_map(|(i, chain)|
            if chain.is_empty() { None } else { Some(i) })
        .collect()
}

#[wasm_bindgen]
pub fn allocated_table(song: &WasmSong) -> Vec<usize> {
    song.song.tables
        .iter()
        .enumerate()
        .filter_map(|(i, table)| {
            if i < Song::N_INSTRUMENTS  {
                // always show instrument table
                if song.song.instruments[i].is_empty() {
                    return None;
                } else {
                    return Some(i)
                }
            }

            if table.is_empty() { None } else { Some(i) }
        })
        .collect()
}