import { SongPane, State } from "./state";
import * as W from '../rem8x/pkg/rem8x';

async function loadFile(state: State, pane: SongPane, buff : Promise<ArrayBuffer>) : Promise<W.WasmSong | undefined> {
    const loaded_file = new Uint8Array(await buff);

    try {
        pane.raw_song.value = loaded_file;
        const song = W.load_song(loaded_file);
        pane.song.value = song;
        return song;
    } catch (err) {
        state.message_banner.value = err.toString();
        return undefined;
    }
}

async function loadInstrument(state : State, song: W.WasmSong, buff : Promise<ArrayBuffer>) : Promise<void> {
    const loaded_file = new Uint8Array(await buff);

    try {
        W.load_instrument(song, 0, loaded_file);
    } catch (err) {
        state.message_banner.value = err.toString();
    }
}

export async function loadDroppedSong(state : State, ev : DragEvent, pane: SongPane, emptyUrl: URL | undefined) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach(async (item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();

        if (file.name.endsWith("m8i")) {
          // first we load the empty song, then...
          const song = await loadUrl(state, pane, emptyUrl);
          await loadInstrument(state, song, file.arrayBuffer());
          pane.bumper.value = pane.bumper.value + 1;
        } else {
          await loadFile(state, pane, file.arrayBuffer());
        }
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach(async (file, i) => {
      pane.loaded_name.value = file.name;
      await loadFile(state, pane, file.arrayBuffer())
    });
  }
}

export async function loadUrl(state: State, pane: SongPane, url: URL | undefined) : Promise<W.WasmSong | undefined> {
    if (url === undefined) return;
    const loaded = fetch(url).then(resp => resp.arrayBuffer());
    return await loadFile(state, pane, loaded);
}