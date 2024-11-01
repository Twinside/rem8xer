import { Signal, signal } from "@preact/signals";
import { WasmSong } from "../m8-files/pkg/m8_files";

export type Position =
    {
        x: number;
        y: number
    }

export type ChainSelection =
    {
        start : Position;
        end : Position
    }

export const EmptySelection : ChainSelection =
    {
        start: { x: -1, y: -1 },
        end: { x: -1, y: -1 }
    }

export const AccumulatingSelection : ChainSelection =
    {
        start: { x: 9, y: 0x200 },
        end: { x: -1, y: -1 }
    }

export function ExtendSelection(cs : ChainSelection, x: number, y: number) : ChainSelection {
    return {
        start: {
            x: Math.min(cs.start.x, x),
            y: Math.min(cs.start.y, y),
        },
        end: {
            x: Math.max(cs.end.x, x),
            y: Math.max(cs.end.y, y),
        }
    }
}

export type ChainNumberEdition =
    {
        x: number,
        y: number,
        base_chain: number,
        current_value: number
    }

export const EmptyEdition : ChainNumberEdition =
    {
        x: -1, y: -1, base_chain: -1, current_value: -1
    };

export type SongPane =
    {
        loaded_name: Signal<string | undefined>,
        song: Signal<WasmSong | undefined>,
        raw_song: Signal<Uint8Array>,
        bumper: Signal<number>,
        edited_chain: Signal<ChainNumberEdition | undefined>,
        selected_chain: Signal<number | undefined>,
        selected_phrase: Signal<number | undefined>,
        selection_range: Signal<ChainSelection | undefined>
    }

function initPane() : SongPane {
    return {
        loaded_name: signal(undefined),
        song: signal(undefined),
        bumper: signal(0),
        edited_chain: signal(undefined),
        raw_song: signal(new Uint8Array(0)),
        selected_chain: signal(undefined),
        selected_phrase: signal(undefined),
        selection_range: signal(undefined)
    };
}

export function clearPanel(panel : SongPane) {
    panel.loaded_name.value = undefined;
    panel.song.value = undefined;
    panel.raw_song.value = undefined;
    panel.selected_chain.value = undefined;
    panel.selected_phrase.value = undefined;
    panel.selection_range.value = undefined;
}

export type State =
    {
        message_banner: Signal<string | undefined>;
        left: SongPane;
        right: SongPane;
    }

export function initState() : State {

    return {
        message_banner: signal(undefined),
        left: initPane(),
        right: initPane()
    }
}
