import * as W from '../m8-files/pkg/m8_files';

import { expect, test } from 'vitest'
import { initState } from '../src/state';
import CMDMAPPING from '../src/CMDMAPPING.m8s'
import EMPTY_SONG from '../src/V4EMPTY.m8s'

import * as Fs from 'fs';
import * as Path from 'path';

export function setup() {
    W.init();
}

type Songs = 
    {
        empty: W.WasmSong
        empty_song_bytes: Uint8Array,
        cmd_mapping: W.WasmSong
        raw_song_bytes: Uint8Array
    }

function withSongs(f: (songs: Songs) => void) : () => void {
  return () => {
    const empty_song_bytes = Fs.readFileSync('./' + EMPTY_SONG);
    const raw_song_bytes = Fs.readFileSync('./' + CMDMAPPING);

    const empty = W.load_song(empty_song_bytes);
    const cmd_mapping = W.load_song(raw_song_bytes);

    f({ empty, cmd_mapping, empty_song_bytes, raw_song_bytes });

    empty.free();
    cmd_mapping.free();
  }
}

test('Copy EQ', withSongs(songs => {
    const eq_number = 1;

    W.copy_eq(songs.cmd_mapping, songs.empty, eq_number, eq_number);

    const orig = W.dump_eq(songs.cmd_mapping, eq_number);
    const copy = W.dump_eq(songs.empty, eq_number);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Blast EQ', withSongs(songs => {
    const eq_number = 1;

    const orig = W.dump_eq(songs.cmd_mapping, eq_number);
    W.blast_eq(songs.cmd_mapping, eq_number, orig);
}));


test('Renumber EQ', withSongs(songs => {
    const eq_number = 1;

    const orig = W.dump_eq(songs.cmd_mapping, eq_number);
    W.renumber_eq(songs.cmd_mapping, eq_number, 23);
    const copy = W.dump_eq(songs.cmd_mapping, 23);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Copy Chain', withSongs(songs => {
    const chain_number = 10;

    const remapping = W.remap_chain(songs.cmd_mapping, songs.empty, chain_number);
    W.remap_chain_apply(songs.cmd_mapping, songs.empty, remapping, chain_number, 1, 1);

    const orig = W.dump_chain(songs.cmd_mapping, chain_number);
    const copy = W.dump_chain(songs.empty, chain_number);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Blast Chain', withSongs(songs => {
    const chain_number = 10;

    const orig = W.dump_chain(songs.cmd_mapping, chain_number);
    W.blast_chain(songs.cmd_mapping, chain_number, orig);
}));


test('Renumber Chain', withSongs(songs => {
    const chain_number = 10;

    const orig = W.dump_chain(songs.cmd_mapping, chain_number);
    W.renumber_chain(songs.cmd_mapping, chain_number, 27);
    const copy = W.dump_chain(songs.cmd_mapping, 27);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Copy Instr', withSongs(songs => {
    const instr_number = 10;

    W.copy_instrument(songs.cmd_mapping, songs.empty, instr_number, instr_number);

    const orig = W.dump_instrument(songs.cmd_mapping, instr_number);
    const copy = W.dump_instrument(songs.empty, instr_number);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Blast Instr', withSongs(songs => {
    const instr_number = 10;

    const orig = W.dump_instrument(songs.cmd_mapping, instr_number);
    W.blast_instrument(songs.cmd_mapping, instr_number, orig);
}));

test('Renumber Instrument', withSongs(songs => {
    const instrument_number = 10;

    const orig = W.dump_instrument(songs.cmd_mapping, instrument_number);
    W.renumber_instrument(songs.cmd_mapping, instrument_number, 27);
    const copy = W.dump_instrument(songs.cmd_mapping, 27);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Copy phrase', withSongs(songs => {
    const phrase_number = 20;

    W.copy_phrase(songs.cmd_mapping, songs.empty, phrase_number, phrase_number);

    const orig = W.dump_phrase(songs.cmd_mapping, phrase_number);
    const copy = W.dump_phrase(songs.empty, phrase_number);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Blast phrase', withSongs(songs => {
    const phrase_number = 20;

    const orig = W.dump_phrase(songs.cmd_mapping, phrase_number);
    W.blast_phrase(songs.cmd_mapping, phrase_number, orig);
}));

test('Renumber phrase', withSongs(songs => {
    const phrase_number = 10;

    const orig = W.dump_phrase(songs.cmd_mapping, phrase_number);
    W.renumber_phrase(songs.cmd_mapping, phrase_number, 27);
    const copy = W.dump_phrase(songs.cmd_mapping, 27);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Copy table', withSongs(songs => {
    const table_number = 80;

    W.copy_table(songs.cmd_mapping, songs.empty, table_number, table_number);

    const orig = W.dump_table(songs.cmd_mapping, table_number);
    const copy = W.dump_table(songs.empty, table_number);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Renumber table', withSongs(songs => {
    const table_number = 0x81;

    const orig = W.dump_table(songs.cmd_mapping, table_number);
    W.renumber_table(songs.cmd_mapping, table_number, 0x97);
    const copy = W.dump_table(songs.cmd_mapping, 0x97);

    expect(Array.from(orig)).toEqual(Array.from(copy));
}));

test('Blast table', withSongs(songs => {
    const table_number = 0x81;

    const orig = W.dump_table(songs.cmd_mapping, table_number);
    W.blast_table(songs.cmd_mapping, table_number, orig);
}));
