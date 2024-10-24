import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { initState, SongPane } from "./state";

const state = initState();

async function loadSong(ev : DragEvent, pane: SongPane) {
  console.log("DROP!");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  const loadFile = async (buff : Promise<ArrayBuffer>) => {
      const loaded_file = await buff;

      try {
        pane.song.value = W.load_song(new Uint8Array(loaded_file));
      } catch (err) {
        state.message_banner.value = err.toString();
      }
  }

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach(async (item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        loadFile(file.arrayBuffer());
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      pane.loaded_name.value = file.name;
      loadFile(file.arrayBuffer())
    });
  }
}

function SongViewer(props: { panel: SongPane }) {
  const panel = props.panel;
  const filename =  panel.loaded_name.value;
  const song = panel.song.value;

  const songName = song !== undefined
    ? W.song_name(song)
    : filename;

  return <div class="rootcolumn"
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={(evt) => loadSong(evt, props.panel)}>
    <h3>{songName}</h3>
    BlipBloup
  </div>;
}

function MessageBanner() {
  const msg = state.message_banner.value;
  if (msg === undefined) return <></>;
  return <div>{msg}</div>;
}

function App() {
  return <div>
      <h1>Rem8xer</h1>
      <MessageBanner />
      <div class="rootcontainer">
        <SongViewer panel={state.left} />
        <SongViewer panel={state.right} />
      </div>
  </div>;
}

render(<App/>, document.getElementById("rootcontainer"));
