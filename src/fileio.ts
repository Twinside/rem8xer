import { SongPane, State } from "./state";
import * as W from '../rem8x/pkg/m8_files';

async function loadFile(state: State, pane: SongPane, buff : Promise<ArrayBuffer>) : Promise<void> {
    const loaded_file = new Uint8Array(await buff);

    try {
        pane.raw_song.value = loaded_file;
        pane.song.value = W.load_song(loaded_file);
    } catch (err) {
        state.message_banner.value = err.toString();
    }
}

export async function loadDroppedSong(state : State, ev : DragEvent, pane: SongPane) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach(async (item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        await loadFile(state, pane, file.arrayBuffer());
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

export async function loadUrl(state: State, pane: SongPane, url: string) {
    const loaded = fetch(url).then(resp => resp.arrayBuffer());
    await loadFile(state, pane, loaded);
}