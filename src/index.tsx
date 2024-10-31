import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { ChainNumberEdition, ChainSelection, clearPanel, EmptyEdition, EmptySelection, initState, SongPane } from "./state";
import { downloadBlob } from "./utils";
import { Signal } from "@preact/signals";
import emptyUrl from "./V4EMPTY.m8s";
import { loadDroppedSong, loadUrl } from "./fileio";

W.init();
const state = initState();

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

function ChainNumberEditor(props: {
    bump: Signal<number>,
    song: W.WasmSong,
    chain: Signal<ChainNumberEdition | undefined>
  }) {
  const chn = props.chain.value;

  const onDown = (evt : KeyboardEvent) => {
    if (evt.key === 'Enter') {
      props.chain.value = undefined;
      const strVal = (evt.currentTarget as HTMLInputElement).value;
      const asNum = Number.parseInt(strVal, 16)
      try {
        W.renumber_chain(props.song, chn.base_chain, asNum);
      } catch (err) {
        state.message_banner.value = err.toString();
      }
      props.bump.value = props.bump.value + 1;
    }
  };

  const onChange = (evt : Event) => {
    const strVal = (evt.currentTarget as HTMLInputElement).value;
    const asNum = Number.parseInt(strVal, 16)
    props.chain.value = { ...chn, current_value: asNum };
  };

  return <input
    class="songchain scselect"
    type="text"
    maxlength={2}
    pattern="[a-fA-F0-9]{2}"
    value={hexStr(chn.current_value)}
    onChange={(evt) => onChange(evt)}
    onKeyDown={(evt) => onDown(evt)} />
}

function StepsRender(props: {
    side: SongSide,
    steps: Uint8Array,
    pane: SongPane,
  }) {
  const elems = [];
  const pane = props.pane;
  const steps = props.steps;
  const bump_val = props.pane.bumper.value;
  let read_cursor = 0;

  const dragStart = (evt : DragEvent, chain: number) => {
    const asJson : DraggedChain = { chain, from_song: props.side };
    evt.dataTransfer.setData("text/plain", JSON.stringify(asJson));
    evt.dataTransfer.dropEffect = "copy";
  };

  const dragOver = (evt: DragEvent) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  }

  const dragEnd = (evt : DragEvent, line : number, col : number) => {
    const strPayload = evt.dataTransfer.getData('text/plain');
    try {
      const asJson = JSON.parse(strPayload);
      if (!isDraggedChain(asJson))
        return;

      if (asJson.from_song === props.side) {
        state.message_banner.value = "We avoid copying a chain into the same song";
      } else if (asJson.from_song === "left") {
        W.copy_chain(state.left.song.value, state.right.song.value, asJson.chain, col, line);
      } else {
        W.copy_chain(state.right.song.value, state.left.song.value, asJson.chain, col, line);
      }

      pane.bumper.value = pane.bumper.value + 1;

    } catch(err) {
      state.message_banner.value = `Chain copy error: ${err}`;
    }
  }

  const selection = pane.selection_range.value || EmptySelection;
  const isSelected = (line : number, column : number) =>
      selection.start.x <= column && column <= selection.end.x &&
      selection.end.y <= line && line <= selection.end.y;

  const edition = pane.edited_chain.value || EmptyEdition;
  for (let line = 0; line < 0x100; line++) {
    elems.push(<span class="spanline">{hexStr(line)} : </span>)

    for (let col = 0; col < 8; col++) {
      const chain = steps[read_cursor++];
      const selClass = isSelected(line, col)
        ? " selected-chain"
        : "";

      if (chain === 0xFF) {
        const elem =
          <span class="scselect"
                data-line={line}
                data-col={col}
                onDragOver={evt => dragOver(evt)}
                onDrop={evt => dragEnd(evt, line, col)}>-- </span>;
        elems.push(elem);
      } else if (edition.x === col && edition.y === line) {
        elems.push(<ChainNumberEditor song={pane.song.value} bump={pane.bumper} chain={pane.edited_chain} />);
      } else {
        const elem =
          <span class={"songchain scselect" + selClass}
                data-line={line}
                data-col={col}
                draggable={true}
                onDragStart={evt => dragStart(evt, chain)}
                onDragOver={evt => dragOver(evt)}
                onDrop={evt => dragEnd(evt, line, col)}
                onDblClick={() => pane.edited_chain.value = { x: col, y: line, current_value: chain, base_chain: chain }}
                onClick={() => pane.selected_chain.value = chain}>{hexStr(chain)} </span>; 

        elems.push(elem);
      }
    }

    elems.push('\n');
  }

  // const sel = new SelectionRectangle(".selection-rect", props.selection);

  return <pre class="songsteps"
              // onMouseDown={(evt) => sel.onMouseDown(evt)}
              // onMouseMove={(evt) => sel.onMouseMove(evt)}
              // onMouseUp={(evt) => sel.onMouseUp(evt)}
              >{elems}</pre>;
}


function SongViewer(props: { side: SongSide, panel: SongPane }) {
  const panel = props.panel;
  const filename =  panel.loaded_name.value;
  const song = panel.song.value;
  const bump = panel.bumper.value;

  const songName = song !== undefined
    ? W.song_name(song)
    : filename;

  if (song === undefined) {
    return <div class="rootcolumn">
      <button onClick={() => loadUrl(state, panel, emptyUrl)}>Load empty song</button>
      <div class="filetarget"
           onDragOver={(ev) => ev.preventDefault()}
           onDrop={(evt) => loadDroppedSong(state, evt, props.panel)}>Drag M8 song file here</div>
    </div>;
  }

  const steps =
    <StepsRender side={props.side}
                 steps={W.get_song_steps(song)}
                 pane={props.panel} />;

  const save = () => {
    try {
      const new_song = W.write_song(song, panel.raw_song.value);
      panel.raw_song.value = new_song;
      downloadBlob(new_song, songName + ".m8s");
    } catch (err) {
      state.message_banner.value = err.toString();
    }
  };

  const clear = () => {
    clearPanel(props.panel)
  };

  return <div class="rootcolumn">
    <div>
      <h3 style="display: inline-block;">{songName}</h3>
      <span class="separator" />
      {song !== undefined ? <button onClick={save}>Save</button> : undefined}
      {song !== undefined ? <button onClick={clear}>Clear</button> : undefined}
    </div>
    <div class="songsteps-wrapper">
      {steps}
    </div>
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

  const phraseSet = (i : number) => {
    props.panel.selected_phrase.value = i;
  }

  for (let i = 0; i < 32; i += 2) {
    elems.push(`${(i / 2).toString(16)} : `)
    const phrase = chainSteps[i];

    if (phrase === 0xFF) {
      elems.push("--\n")
    } else {
      elems.push(<span class="phrase" onClick={_ => phraseSet(phrase)}>{hexStr(phrase)} {hexStr(chainSteps[i + 1])}</span>)
      elems.push('\n')
    }
  }

  const phrase_idx = props.panel.selected_phrase.value;
  const phrase = (phrase_idx !== undefined)
    ? <>
        <h4>Phrase {phrase_idx}</h4>
        <pre>{W.show_phrase(song, phrase_idx)}</pre>
      </>
    : undefined

  return <div class="chain_viewer">
    <h4>Chain viewer</h4>
    <pre>
      {elems}
    </pre>
    {phrase}
  </div>;
}

function App() {
  return <>
      <div class="selection-rect"></div>
      <h1>Re<pre class="titlepre">M8</pre>xer</h1>
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
