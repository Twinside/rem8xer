import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { initState, SongPane } from "./state";
import { downloadBlob } from "./utils";

W.init();
const state = initState();

async function loadSong(ev : DragEvent, pane: SongPane) {
  console.log("DROP!");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  const loadFile = async (buff : Promise<ArrayBuffer>) => {
      const loaded_file = new Uint8Array(await buff);

      try {
        pane.raw_song.value = loaded_file;
        pane.song.value = W.load_song(loaded_file);
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

type SongSide = "left" | "right"
type DraggedChain = {
  chain: number,
  from_song: SongSide
}

function isDraggedChain(o : any) : o is DraggedChain {
  return o !== null
    && typeof o === 'object'
    && 'chain' in o
    && 'from_song' in o
    && typeof o.chain === 'number'
    && typeof o.from_song === 'string';
}

function StepsRender(props: { side: SongSide, steps: Uint8Array, viewChain: (chainNumber: number) => void }) {
  const elems = [];
  const steps = props.steps;
  let read_cursor = 0;

  const dragStart = (evt : DragEvent, chain: number) => {
    const asJson : DraggedChain = { chain, from_song: props.side };
    evt.dataTransfer.setData("text/plain", JSON.stringify(asJson));
    evt.dataTransfer.dropEffect = "copy";
  };

  const dragEnd = (evt : DragEvent, line : number, col : number) => {
    const strPayload = evt.dataTransfer.getData('text/plain');
    try {
      const asJson = JSON.parse(strPayload);
      if (!isDraggedChain(asJson))
        return;
      alert(`Copy ${asJson.chain} from song ${asJson.from_song} at ${line}:${col}`)
    } catch {
      /* ignores */
    }
  }

  for (let line = 0; line < 0x100; line++) {
    elems.push(<span class="spanline">{hexStr(line)} : </span>)

    for (let col = 0; col < 8; col++) {
      const chain = steps[read_cursor++];

      if (chain === 0xFF) {
        const elem =
          <span onDrop={evt => dragEnd(evt, line, col)}>-- </span>;
        elems.push(elem);
      } else {
        const elem =
          <span class="songchain"
                draggable={true}
                onDragStart={(evt) => dragStart(evt, chain)}
                onDrop={evt => dragEnd(evt, line, col)}
                onClick={() => props.viewChain(chain)}>{hexStr(chain)} </span>; 

        elems.push(elem);
      }
    }

    elems.push('\n');
  }

  return <pre class="songsteps">{elems}</pre>;
}

function SongViewer(props: { side: SongSide, panel: SongPane }) {
  const panel = props.panel;
  const filename =  panel.loaded_name.value;
  const song = panel.song.value;

  const songName = song !== undefined
    ? W.song_name(song)
    : filename;

  const viewChain = (n : number) => panel.selected_chain.value = n;
  const steps = song !== undefined
    ? <StepsRender side={props.side}
                   steps={W.get_song_steps(song)}
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
        <SongViewer side="left" panel={state.left} />
        <SongViewer side="right" panel={state.right} />
        <div class="rootcolumn">
          <ChainViewer panel={state.right} />
        </div>
      </div>
  </>;
}

render(<App/>, document.body);
