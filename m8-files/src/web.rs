use arr_macro::arr;
use wasm_bindgen::prelude::*;

use crate::{reader::{Reader, Writer}, song::{EqMapping, InstrumentMapping, Phrase, Song, V4_OFFSETS}, Instrument};

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
pub fn copy_chain(
    from: &WasmSong,
    to: &mut WasmSong,
    chain: usize,
    x: usize,
    y: usize) -> Result<usize, String> {

    let from_song = &from.song;
    let mut to_song = &mut to.song;

    let from_chain = &from_song.chains[chain];

    // flags on instruments in "from"
    let mut instrument_flags = arr![false; 0x100];
    // flags on eqsin "from"
    let mut eq_flags = arr![false; 32];
    // flags on eqs in "to"
    let mut allocated_eqs = arr![false; 32];
    let mut instrument_mapping = InstrumentMapping::default();
    // eqs from "from" to "to"
    let mut eq_mapping = EqMapping::default();


    for instr in &to_song.instruments {
        match instr.eq() {
            None => {}
            Some(eq) =>  allocated_eqs[eq as usize] = true
        }
    }

    for chain_step in &from_chain.steps {
        let phrase = &from_song.phrases[chain_step.phrase as usize];

        for step in &phrase.steps {
            let instr_ix = step.instrument as usize;

            // out of bound instrument, dont bother or if already allocated
            if step.instrument >= 0x80 || instrument_flags[instr_ix] {
                continue;
            }

            let mut instr = from_song.instruments[instr_ix].clone();

            // first we search the new EQ
            if let Some(equ) = instr.eq() {
                let equ = equ as usize;

                if equ <= 32 && !eq_flags[equ] {
                    eq_flags[equ as usize] = true;
                    let from_eq = &from_song.eqs[equ];
                    // try to find an already exisint Eq with same parameters
                    match to_song.eqs.iter().position(|to_eq| to_eq == from_eq) {
                        Some(eq_idx) => eq_mapping.mapping[equ] = eq_idx as u8,
                        None => {
                            match allocated_eqs.iter().position(|alloc| !alloc) {
                                None => return Err(format!("No more available eqs for instrument {instr_ix}")),
                                Some(eq_slot) => {
                                    allocated_eqs[eq_slot] = true;
                                    eq_mapping.mapping[equ] = eq_slot as u8;
                                    to_song.eqs[eq_slot] = from_eq.clone();
                                }
                            }
                        }
                    }

                    // finally update our Eq in our local copy
                    instr.set_eq(eq_mapping.mapping[equ]);
                }
            }

            instrument_flags[instr_ix] = true;
            match to_song.instruments.iter().position(|i| i == &instr) {
                // horray we have a matching instrument, reuse it
                Some(to_instr_ix) =>
                    instrument_mapping.mapping[instr_ix] = to_instr_ix as u8,
                // no luck, allocate a fresh one
                None => {
                    match to_song.instruments.iter().position(|i| i == &Instrument::None) {
                        None => return Err(format!("No more available instrument slots for instrument {instr_ix}")),
                        Some(to_instr_ix) => {
                            instrument_mapping.mapping[instr_ix] = to_instr_ix as u8;
                            to_song.instruments[to_instr_ix] = instr;
                        }
                    }
                }
            }
        }
    }

    let mut allocated_phrases = arr![false; 0x80];
    for chain in &to_song.chains {
        for step in &chain.steps {
            allocated_phrases[step.phrase as usize] = true;
        }
    }

    let mut seen_phrase = arr![false; 0xFF];
    let mut phrase_mapping = arr![0 as u8; 0xFF];
    let mut to_chain = from_chain.clone();

    for (pos, chain_step) in from_chain.steps.iter().enumerate() {
        let phrase_ix = chain_step.phrase as usize;

        if phrase_ix == 0xFF {
            continue;
        } else if seen_phrase[phrase_ix] {
            to_chain.steps[pos].phrase = phrase_mapping[phrase_ix];
            continue;
        }
        seen_phrase[phrase_ix] = true;
        let phrase = from_song.phrases[phrase_ix].map_instruments(&instrument_mapping);
        match to_song.phrases.iter().position(|p| p.steps == phrase.steps) {
            Some(known) => {
                phrase_mapping[phrase_ix] = known as u8;
                to_chain.steps[pos].phrase = known as u8;
            }
            None => {
                match allocated_phrases.iter().position(|v| !v) {
                    None => return Err(format!("No more available phrase slots for phrase {phrase_ix}")),
                    Some(slot) => {
                        allocated_phrases[slot] = true;
                        phrase_mapping[phrase_ix] = slot as u8;
                        to_chain.steps[pos].phrase = slot as u8;
                    }
                }
            }
        }
    }

    let mut allocated_chains = arr![false; 0xFF];
    for song_step in to_song.song.steps {
        if song_step < 0xFF {
            allocated_chains[song_step as usize] = true;
        }
    }

    match to_song.chains.iter().position(|c| c.steps == to_chain.steps) {
        Some(c) => {
            to_song.song.steps[x + y * 8] = c as u8;
            Ok(c)
        },
        None => {
            match allocated_chains.iter().position(|a| !a) {
                None => return Err(format!("No more available chain slots for chain {chain}")),
                Some(free_slot) => {
                    to_song.chains[free_slot].steps = to_chain.steps;
                    to_song.song.steps[x + y * 8] = free_slot as u8;
                    Ok(free_slot)
                }
            }
        }
    }
}