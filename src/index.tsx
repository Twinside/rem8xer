import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { initState, SongPane } from "./state";
import { downloadBlob } from "./utils";

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

function hexStr(n : number) : string {
  const hexStr = n.toString(16);
  return hexStr.length <= 1 ? "0" + hexStr : hexStr;
}

function StepsRender(props: { steps: Uint8Array, viewChain: (chainNumber: number) => void }) {
  const elems = [];
  const steps = props.steps;
  let read_cursor = 0;

  for (let line = 0; line < 0x100; line++) {
    elems.push(<span class="spanline">{hexStr(line)} : </span>)

    for (let col = 0; col < 8; col++) {
      const chain = steps[read_cursor++];

      if (chain === 0xFF) elems.push("-- ");
      else {
        elems.push(<span class="songchain" onClick={() => props.viewChain(chain)}>{hexStr(chain)} </span>)
      }
    }

    elems.push('\n');
  }

  return <pre class="songsteps">{elems}</pre>;
}

function SongViewer(props: { panel: SongPane }) {
  const panel = props.panel;
  const filename =  panel.loaded_name.value;
  const song = panel.song.value;

  const songName = song !== undefined
    ? W.song_name(song)
    : filename;

  const viewChain = (n : number) => panel.selected_chain.value = n;
  const steps = song !== undefined
    ? <StepsRender steps={W.get_song_steps(song)}
                   viewChain={viewChain}/>
    : "Drag an M8 song file here";

  const save = () => {
    try {
      const new_song = W.write_song(song, panel.raw_song.value);
      panel.raw_song.value = new_song;
      downloadBlob(new_song, songName + ".m8s");
    } catch (err) {
      state.message_banner.value = err.toString();
    }
  };

  return <div class="rootcolumn"
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={(evt) => loadSong(evt, props.panel)}>
    <div>
      <h3 style="display: inline-block;">{songName}</h3>
      <span class="separator" />
      {song !== undefined ? <button onClick={save}>Save</button> : undefined}
    </div>
    {steps}
  </div>;
}

function MessageBanner() {
  const msg = state.message_banner.value;
  if (msg === undefined) return <></>;
  return <div>{msg}</div>;
}

function ChainViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;

  if (song === undefined) return <div class="rootcolumn"></div>;

  const chain = props.panel.selected_chain.value;
  if (chain === undefined) {
    return <div class="rootcolumn">
      <h4>Chain viewer</h4>
      <p>Click a chain to view</p>
    </div>;
  }

  const chainSteps = W.get_chain_steps(song, chain);
  const elems = [];

  for (let i = 0; i < 32; i += 2) {
    elems.push(`${(i / 2).toString(16)} : `)
    const phrase = chainSteps[i];

    if (phrase === 0xFF) {
      elems.push("--\n")
    } else {
      elems.push(<span class="phrase">{hexStr(phrase)} {hexStr(chainSteps[i + 1])}</span>)
      elems.push('\n')
    }

  }

  return <div class="chain_viewer">
    <h4>Chain viewer</h4>
    <pre>
      {elems}
    </pre>
  </div>;
}

function App() {
  return <>
      <h1>Rem8xer</h1>
      <MessageBanner />
      <div class="rootcontainer">
        <div class="rootcolumn">
          <ChainViewer panel={state.left} />
        </div>
        <SongViewer panel={state.left} />
        <SongViewer panel={state.right} />
        <div class="rootcolumn">
          <ChainViewer panel={state.right} />
        </div>
      </div>
  </>;
}

render(<App/>, document.body);
