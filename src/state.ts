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

export type NumberEdition =
    {
        base_value: number,
        current_value: number
    }

export const EmptyNumberEdition : NumberEdition =
    {
        base_value: -1,
        current_value: -1
    }

export type ChainNumberEdition = NumberEdition & Position

export const EmptyChainEdition : ChainNumberEdition =
    {
        x: -1, y: -1, base_value: -1, current_value: -1
    };

export type InstrumentNameEditor =
    {
        instrument_id: number
        name: string
    }

export const EmptyInstrumentNameEdition =
    { instrument_id: -1, name: '' }

export type PanelSide = "left" | "right"

export type SongPane =
    {
        side: PanelSide,

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

        /** Currently selected table in the explorer */
        selected_table: Signal<number | undefined>,

        /** Currently selected instrument in the explorer */
        selected_instrument: Signal<number | undefined>,

        /** Currently selected phrase within the selected chain */
        selected_phrase: Signal<number | undefined>,

        /** Currently selected eq */
        selected_eq: Signal<number | undefined>,

        /** Currently edited chain number */
        edited_chain: Signal<ChainNumberEdition | undefined>,

        /** Currently edited phrase number */
        edited_phrase: Signal<NumberEdition | undefined>,

        /** Currently edited table number */
        edited_table: Signal<NumberEdition | undefined>,

        /** Currently edited phrase number */
        edited_instrument: Signal<NumberEdition | undefined>,

        /** Currently edited Eq number */
        edited_eq: Signal<NumberEdition | undefined>,

        /** Instrument currently being renamed */
        edited_instrument_name: Signal<InstrumentNameEditor | undefined>,

        /** Obsolete for now */
        selection_range: Signal<ChainSelection | undefined>
    }

function initPane(side: PanelSide) : SongPane {
    return {
        side,
        loaded_name: signal(undefined),
        song: signal(undefined),
        bumper: signal(0),
        edited_chain: signal(undefined),
        edited_phrase: signal(undefined),
        edited_instrument: signal(undefined),
        edited_instrument_name: signal(undefined),
        edited_table: signal(undefined),
        edited_eq: signal(undefined),
        raw_song: signal(new Uint8Array(0)),
        selected_eq: signal(undefined),
        selected_chain: signal(undefined),
        selected_phrase: signal(undefined),
        selection_range: signal(undefined),
        selected_table: signal(undefined),
        selected_instrument: signal(undefined)
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

export type SongRef =
    {
        song_name: string,
        side: PanelSide
    }

export type PatchKind = "CHN" | "PHR" | "INS" | "EQ" | "TBL"

export type PatchData =
    {
        kind: PatchKind
        from_id: number,
        to_id: number,
        data?: Uint8Array
    }

export type EditLog =
    | { kind: "renumber", ref: SongRef, elemKind: PatchKind, old_value: number, new_value: number }
    | { kind: "rename", ref: SongRef, instr: number, old_name: string, new_name: string }
    | { kind: "move", from_ref: SongRef, to_ref: SongRef, patch: PatchData[] }
    | { kind: "error", ref: SongRef, message: string }

export type State =
    {
        message_banner: Signal<string | undefined>;
        remap_log: Signal<EditLog[]>
        left: SongPane;
        right: SongPane;
    }

export function initState() : State {
    return {
        message_banner: signal(undefined),
        left: initPane("left"),
        right: initPane("right"),
        remap_log: signal([])
    }
}

export const GlobalState = createContext<State>(undefined);