import { Signal, signal } from "@preact/signals";
import { WasmSong } from "../rem8x/pkg/rem8x";
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
        view_index: number,
        current_value: number
    }

export const EmptyNumberEdition : NumberEdition =
    {
        base_value: -1,
        view_index: -1,
        current_value: -1
    }

export type ChainNumberEdition = NumberEdition & Position

export const EmptyChainEdition : ChainNumberEdition =
    {
        view_index: -1,
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

export type ActiveView = "song" | "spectra"

type ElemViewKind = "phrase" | "chain" | "equ" | "instrument" | "table"
export type ElementView = { kind: ElemViewKind, view_index: number, elem_id: number }

export type SongPane =
    {
        side: PanelSide,

        /** Currently loaded song, fully parsed  */
        song: Signal<WasmSong | undefined>,

        /** Loaded file name */
        loaded_name: Signal<string | undefined>,

        /** Bytes of the raw song, used for rewriting. */
        raw_song: Signal<Uint8Array>,

        /** Currently selected empty file version */
        empty_selection: Signal<number>,

        /** Signal to force refresh */
        bumper: Signal<number>,

        /** Currently edited chain number */
        edited_chain: Signal<ChainNumberEdition | undefined>,

        /** Currently edited number  */
        edited_view: Signal<NumberEdition | undefined>,

        /** Incremented counter to allocate new views */
        fresh_view_id: number,

        /** Instrument currently being renamed */
        edited_instrument_name: Signal<InstrumentNameEditor | undefined>,

        /** All viewed elements of the song */
        song_views: Signal<ElementView[]>,

        /** Obsolete for now */
        selection_range: Signal<ChainSelection | undefined>,

        /** Current view */
        active_view: Signal<ActiveView>

        /** Is the pane currently hidden */
        closed: Signal<boolean>
    }

function highlight_view(pane: SongPane, view: number) {
}

export function fixViewId(pane: SongPane, view_id: number, elem_id: number) {
    var views = [... pane.song_views.value];

    for (let i = 0; i < views.length; i++) {
        const view = views[i];
        if (view.view_index === view_id) {
            views[i] = { ...view, elem_id };
        }
    }

    pane.song_views.value = views;
}

/** Remove a view */
export function closeView(pane: SongPane, view_id: number) {
    var views = [... pane.song_views.value];

    for (let i = 0; i < views.length; i++) {
        const view = views[i];
        if (view.view_index === view_id) {
            views.splice(i, 1);
        }
    }

    pane.song_views.value = views;
}

export function openHighlightElem(pane: SongPane, kind: ElemViewKind, elem_id: number) {
    var views = pane.song_views.value;

    for (const view of views) {
        if (view.kind === kind && view.elem_id === elem_id) {
            highlight_view(pane, view.view_index);
            return;
        }
    }

    const view_index = pane.fresh_view_id;
    pane.fresh_view_id++;
    pane.song_views.value = [...views, { kind, view_index, elem_id }];
}

function initPane(side: PanelSide) : SongPane {
    return {
        side,
        closed: signal(false),
        loaded_name: signal(undefined),
        song: signal(undefined),
        bumper: signal(0),
        edited_chain: signal(undefined),
        edited_view: signal(undefined),
        selection_range: signal(undefined),
        empty_selection: signal(7),
        song_views: signal([]),
        fresh_view_id: 0,
        edited_instrument_name: signal(undefined),
        raw_song: signal(new Uint8Array(0)),
        active_view: signal("song")
    };
}

export function clearPanel(panel : SongPane) {
    panel.loaded_name.value = undefined;
    panel.song.value = undefined;
    panel.raw_song.value = undefined;
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
        kind: PatchKind | "SNGSTEP"
        from_id: number,
        to_id: number,
        /** Only for chains */
        pos?: Position,
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
        remap_log: Signal<EditLog[]>;
        undo_stack_pointer: Signal<number>;
        left: SongPane;
        right: SongPane;
    }

export function initState() : State {
    return {
        message_banner: signal(undefined),
        undo_stack_pointer: signal(0),
        left: initPane("left"),
        right: initPane("right"),
        remap_log: signal([])
    }
}

export const GlobalState = createContext<State>(undefined);

export function never(never: never) {}

export function paneOfSide(state: State, side: PanelSide) : SongPane {
    switch (side) {
        case "left": return state.left;
        case "right": return state.right;
        default: never(side);
    }
}