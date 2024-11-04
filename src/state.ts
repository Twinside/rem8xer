import { Signal, signal } from "@preact/signals";
import { WasmSong } from "../m8-files/pkg/m8_files";
import { createContext } from "preact";

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

export const EmptyChainEdition : ChainNumberEdition =
    {
        x: -1, y: -1, base_chain: -1, current_value: -1
    };

export type PhraseNumberEdition =
    {
        chain_source: number,
        chain_offset: number,
        base_phrase: number,
        current_value: number
    }

export const EmptyPhraseEdition : PhraseNumberEdition =
    {
        chain_source: -1,
        chain_offset: -1,
        base_phrase: -1,
        current_value: -1
    }

export type InstrumentNameEditor =
    {
        instrument_id: number
        name: string
    }

export const EmptyInstrumentNameEdition =
    { instrument_id: -1, name: '' }

export type InstrumentNumberEdition =
    {
        base_instrument: number,
        current_value: number
    }

export const EmptyInstrumentNumberEidition : InstrumentNumberEdition =
    { base_instrument: -1, current_value: -1 }

export type SongPane =
    {
        /** Currently loaded song, fully parsed  */
        song: Signal<WasmSong | undefined>,

        /** Loaded file name */
        loaded_name: Signal<string | undefined>,

        /** Bytes of the raw song, used for rewriting. */
        raw_song: Signal<Uint8Array>,

        /** Signal to force refresh */
        bumper: Signal<number>,

        /** Currently selected chain in the song view */
        selected_chain: Signal<number | undefined>,

        /** Currently selected phrase within the selected chain */
        selected_phrase: Signal<number | undefined>,

        /** Currently edited chain number */
        edited_chain: Signal<ChainNumberEdition | undefined>,

        /** Currently edited phrase number */
        edited_phrase: Signal<PhraseNumberEdition | undefined>,

        /** Currently edited phrase number */
        edited_instrument: Signal<InstrumentNumberEdition | undefined>,

        /** Instrument currently being renamed */
        edited_instrument_name: Signal<InstrumentNameEditor | undefined>,

        /** Obsolete for now */
        selection_range: Signal<ChainSelection | undefined>
    }

function initPane() : SongPane {
    return {
        loaded_name: signal(undefined),
        song: signal(undefined),
        bumper: signal(0),
        edited_chain: signal(undefined),
        edited_phrase: signal(undefined),
        edited_instrument: signal(undefined),
        edited_instrument_name: signal(undefined),
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

export const GlobalState = createContext<State>(undefined);