use std::iter;

use wasm_bindgen::prelude::*;

use crate::{eq::EqMode, reader::{Reader, Writer}, remapper::Remapper, song::{Song, SongSteps, V4_OFFSETS}, ParameterGatherer};

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


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////  Renumbering
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
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
pub fn renumber_eq(song: &mut WasmSong, eq: usize, to_eq: usize) -> Result<bool, String> {
    if eq >= Song::N_INSTRUMENT_EQS {
        return Err(format!("Error invalid source eq number {eq:02X}"));
    }

    if to_eq >= Song::N_INSTRUMENT_EQS {
        return Err(format!("Error invalid source destination number {to_eq:02X}"));
    }

    /*
    if ! song.song.eqs[to_eq].is_empty() {
        return Err(format!("Destination instrument {to_instrument:02X} is not empty"));
    } */

    let mut remapper = Remapper::default();
    remapper.eq_mapping.mapping[eq] = to_eq as u8;
    remapper.eq_mapping.to_move.push(eq as u8);
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

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////  Moving stuff
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
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
pub fn copy_instrument(
    from: &WasmSong,
    to: &mut WasmSong,
    instrument: usize,
    to_instrument: usize) -> Result<String, String> {

    if instrument >= Song::N_INSTRUMENTS {
        return Err(format!("Invalid instrument source number"))
    }

    if to_instrument >= Song::N_INSTRUMENTS {
        return Err(format!("Invalid instrument destination number"))
    }

    let from_song = &from.song;
    let to_song = &mut to.song;

    let mut mapping =
        Remapper::create(from_song, to_song, iter::empty())?;

    mapping.instrument_mapping.to_move.push(instrument as u8);
    mapping.instrument_mapping.mapping[instrument] = to_instrument as u8;
    mapping.apply(from_song, to_song);

    Ok(mapping.print())
}

#[wasm_bindgen]
pub fn copy_phrase(
    from: &WasmSong,
    to: &mut WasmSong,
    phrase: usize,
    to_phrase: usize) -> Result<String, String> {

    if phrase >= Song::N_PHRASES {
        return Err(format!("Invalid phrase source number"))
    }

    if to_phrase >= Song::N_PHRASES {
        return Err(format!("Invalid phrase destination number"))
    }

    let from_song = &from.song;
    let to_song = &mut to.song;

    let mut mapping =
        Remapper::create(from_song, to_song, iter::empty())?;

    mapping.phrase_mapping.to_move.push(phrase as u8);
    mapping.phrase_mapping.mapping[phrase] = to_phrase as u8;
    mapping.apply(from_song, to_song);

    Ok(mapping.print())
}

#[wasm_bindgen]
pub fn copy_eq(
    from: &WasmSong,
    to: &mut WasmSong,
    eq: usize,
    to_eq: usize) -> Result<String, String> {

    if eq >= Song::N_INSTRUMENT_EQS {
        return Err(format!("Invalid phrase source number"))
    }

    if to_eq >= Song::N_INSTRUMENT_EQS {
        return Err(format!("Invalid phrase destination number"))
    }

    let from_song = &from.song;
    let to_song = &mut to.song;

    let mut mapping =
        Remapper::create(from_song, to_song, iter::empty())?;

    mapping.eq_mapping.to_move.push(eq as u8);
    mapping.eq_mapping.mapping[eq] = to_eq as u8;
    mapping.apply(from_song, to_song);

    Ok(mapping.print())
}

#[wasm_bindgen]
pub fn copy_table(
    from: &WasmSong,
    to: &mut WasmSong,
    table: usize,
    to_table: usize) -> Result<String, String> {

    if table >= Song::N_TABLES {
        return Err(format!("Invalid table source number"))
    }

    if to_table >= Song::N_TABLES {
        return Err(format!("Invalid table destination number"))
    }

    let from_song = &from.song;
    let to_song = &mut to.song;

    let mut mapping =
        Remapper::create(from_song, to_song, iter::empty())?;

    mapping.table_mapping.to_move.push(table as u8);
    mapping.table_mapping.mapping[table] = to_table as u8;
    mapping.apply(from_song, to_song);

    Ok(mapping.print())
}

#[wasm_bindgen]
pub fn instrument_name(song: &WasmSong, instr: u8) -> String {
    String::from(song.song.instruments[instr as usize].name().unwrap_or(&""))
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////  List elements
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////  Parameter listing
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
struct JsonGatherer {
    gather: js_sys::Array
}

impl JsonGatherer {
    pub fn new() -> Self {
        Self { gather: js_sys::Array::new() }
    }
}

impl From<JsonGatherer> for js_sys::Array {
    fn from(v: JsonGatherer) -> Self { v.gather }
}

impl ParameterGatherer for JsonGatherer {
    fn hex(&mut self, name: &str, val: u8) {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"name".into(), 
            &JsValue::from_str(name));

        let _ = js_sys::Reflect::set(
            &obj,
            &"hex".into(), 
            &JsValue::from_f64(val as f64));

        self.gather.push(&obj);
    }

    fn bool(&mut self, name: &str, val: bool) {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"name".into(), 
            &JsValue::from_str(name));

        let _ = js_sys::Reflect::set(
            &obj,
            &"bool".into(), 
            &JsValue::from_bool(val));

        self.gather.push(&obj);
    }

    fn float(&mut self, name: &str, val: f64) {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"name".into(), 
            &JsValue::from_str(name));

        let _ = js_sys::Reflect::set(
            &obj,
            &"f32".into(), 
            &JsValue::from_f64(val));

        self.gather.push(&obj);
    }

    fn enumeration(&mut self, name: &str, hex: u8, val: &str) {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"name".into(), 
            &JsValue::from_str(name));

        let _ = js_sys::Reflect::set(
            &obj,
            &"str".into(), 
            &JsValue::from_str(val));

        let _ = js_sys::Reflect::set(
            &obj,
            &"hex".into(), 
            &JsValue::from_f64(hex as f64));

        self.gather.push(&obj);
    }

    fn str(&mut self, name: &str, val: &str) {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"name".into(), 
            &JsValue::from_str(name));

        let _ = js_sys::Reflect::set(
            &obj,
            &"str".into(), 
            &JsValue::from_str(val));

        self.gather.push(&obj);
    }

    fn nest(&mut self, name: &str) -> Self {
        let obj = js_sys::Object::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"name".into(), 
            &JsValue::from_str(name));

        let gather = js_sys::Array::new();
        let _ = js_sys::Reflect::set(
            &obj,
            &"nest".into(), 
            &gather);

        self.gather.push(&obj);

        Self { gather }
    }
    
}

/// Instrument parameters description.
#[wasm_bindgen]
pub fn describe_instrument(song: &WasmSong, instrument: usize) -> Result<js_sys::Array, String> {
    if instrument >= Song::N_INSTRUMENTS {
        return Err(format!("Error invalid source instrument number {instrument:02X}"));
    }

    let mut pg = JsonGatherer::new();
    song.song.instruments[instrument].describe(&mut pg, song.song.version);

    Ok(pg.into())
}

/// Eq parameter description.
#[wasm_bindgen]
pub fn describe_eq(song: &WasmSong, eq_idx: usize) -> Result<js_sys::Array, String> {
    if eq_idx >= Song::N_EQS {
        return Err(format!("Error invalid eq number {eq_idx:02X}"));
    }

    let mut pg = JsonGatherer::new();
    song.song.eqs[eq_idx].describe(&mut pg, song.song.version);

    Ok(pg.into())
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/////  Eq rendering
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const LOG_BASE : f64 = 10.0;

const MIN_EQ_PLOT_FREQUENCY : usize = 30;
const MAX_EQ_PLOT_FREQUENCY : usize = 22000;
const EQ_PLOT_POINT_COUNT : usize = 300;

fn frequencies(_mini: usize, maxi: usize, point_count: usize) -> Vec<f64> {
    let max = (maxi as f64).log(LOG_BASE);
    let mini = 0.0; // (mini as f64).log(LOG_BASE);
    let log_step = (max - mini) / point_count as f64;

    let frequencies : Vec<_> = (0 .. point_count)
        .map(|i| LOG_BASE.powf(mini + ((i as f64) * log_step)))
        .collect();

    frequencies
}

/// Retrieve an array of log scaled frequencies used in EQ plotting.
#[wasm_bindgen]
pub fn eq_frequencies() -> js_sys::Float64Array {
    frequencies(MIN_EQ_PLOT_FREQUENCY,
                MAX_EQ_PLOT_FREQUENCY,
                EQ_PLOT_POINT_COUNT)
        .as_slice()
        .into()
}

/// Plot a an eq just plotting a specific mode.
#[wasm_bindgen]
pub fn plot_eq(song: &WasmSong, eq_idx: usize, mode: usize) -> Result<js_sys::Float64Array, String>{
    if eq_idx >= Song::N_EQS {
        return Err(format!("Error invalid eq number {eq_idx:02X}"));
    }

    let mode =
        match EqMode::try_from(mode as u8) {
            Err(_) => return Err(format!("Error invalid eq mode {mode:02X}")),
            Ok(m) => m
        };

    let frequencies =
        frequencies(MIN_EQ_PLOT_FREQUENCY, MAX_EQ_PLOT_FREQUENCY, EQ_PLOT_POINT_COUNT);
    let gains : Vec<f64> = song.song.eqs[eq_idx].accumulate(&frequencies, mode);

    Ok(gains.as_slice().into())
}