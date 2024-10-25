import { Signal, signal } from "@preact/signals";
import { WasmSong } from "../m8-files/pkg/m8_files";

export type SongPane =
    {
        loaded_name: Signal<string | undefined>,
        song: Signal<WasmSong | undefined>
        selected_chain: Signal<number | undefined>
    }

function initPane() : SongPane {
    return {
        loaded_name: signal(undefined),
        song: signal(undefined),
        selected_chain: signal(undefined)
    };
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
