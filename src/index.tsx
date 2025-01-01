import { JSX, render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { EditLog, GlobalState, initState, NumberEdition, PanelSide, PatchData, PatchKind, SongPane, SongRef } from "./state";
import { InstrumentList } from "./components/instrument_list";
import { ChainViewer } from "./components/chain_viewer";
import { SongViewer } from "./components/song_viwer";
import { PhraseList } from "./components/phrase_list";
import { PhraseViewer, TableViewer } from "./components/phrase_viewer";
import { CopyElement, hexStr, RenumberButton, UnicodeSideAction, UnicodeSideIcon } from "./components/common";
import { ChainList } from "./components/chain_list";
import { TableList } from "./components/table_list";
import { InstrumentViewer } from "./components/instrument_view";
import { EqList } from "./components/eq_list";
import { EqViewer } from "./components/eq_viewer";
import { Signal } from "@preact/signals";
import { HexNumberEditor } from "./components/hexnumbereditor";
import { UndoRedoer } from "./components/edit_log";

W.init();
const state = initState();

/** Renumbering and copy button dependent on current selected/edited. */
function EditControls(props: {
    name: string,
    side: PanelSide,
    selected: Signal<number | undefined>,
    edited_number: Signal<NumberEdition | undefined>,
    canRenumber?: (value : number) => boolean,
    onRenumber: (base_value, value: number) => void,
    onCopy?: (selected: number) => void}) : JSX.Element {

  const { name, side, selected, edited_number } = props;
  const selectedElement = selected.value;
  const edited  = edited_number.value;
  const renumbering =
    (props.canRenumber !== undefined && !props.canRenumber(selectedElement)) ? undefined :
    edited === undefined
      ? <RenumberButton
          name={name}
          onClick={() => edited_number.value = { base_value: selectedElement, current_value: selectedElement } } />
     
      : <HexNumberEditor
          value={edited.current_value}
          onChange={v => edited_number.value = { ...edited, current_value: v }}
          onCancel={() => edited_number.value = undefined}
          onValidate={v =>{
            edited_number.value = undefined;
            props.onRenumber(edited.base_value, v);
          }}/>;

  const control = selectedElement === undefined
    ? undefined
    : <span class="edit-controls">
        {renumbering}
        {props.onCopy === undefined
          ? undefined
          : <CopyElement name={name} from_side={side} onClick={() => props.onCopy(selectedElement)} />}
        
      </span>;

    return control
}

function HexRep(sig : Signal<number | undefined>) : JSX.Element {
  var value = sig.value;
  return value === undefined
    ? <></>
    : <span style="font-family: monospace;">{hexStr(value)}</span>;
}

function SongExplorer(props: {
  pane: SongPane,
  undoRedo: UndoRedoer,
  other_pane: SongPane,
  banner: Signal<string | undefined>
}) {
  const song = props.pane.song.value;
  if (song === undefined) return <></>;

  const side = props.pane.side;
  const bump = props.pane.bumper.value;
  const phraseControl =
        <EditControls
          name="phrase"
          side={props.pane.side}
          selected={props.pane.selected_phrase}
          edited_number={props.pane.edited_phrase}
          onRenumber={(base_phrase, new_phrase) => {
            if (props.undoRedo.renumberPhrase(side, base_phrase, new_phrase)) {
              props.pane.selected_phrase.value = new_phrase;
              props.pane.bumper.value = bump + 1;
            }
          }}
          onCopy={(phrase) => {
            props.undoRedo.copyPhrase(side, phrase);
            props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
          }} />

  const chainControl = 
    <EditControls
      name="chain"
      side={props.pane.side}
      selected={props.pane.selected_chain}
      edited_number={props.pane.edited_chain}
      onRenumber={(base_chain, new_chain) => {
          if (props.undoRedo.renumberChain(side, base_chain, new_chain)) {
            props.pane.selected_chain.value = new_chain;
            props.pane.bumper.value = bump + 1;
          }
      }}/>;

  const tableControl =
    <EditControls
        name="Table"
        side={props.pane.side}
        selected={props.pane.selected_table}
        edited_number={props.pane.edited_table}
        canRenumber={tbl => tbl > 0x7F}
        onRenumber={(base_table, new_table) => {
          if (props.undoRedo.renumberTable(side, base_table, new_table)) {
            props.pane.selected_table.value = new_table;
            props.pane.bumper.value = bump + 1;
          }
        }}
        onCopy={(tbl) => {
          props.undoRedo.copyTable(side, tbl);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />;

  const instrumentControl =
    <EditControls
      name="Instrument"
      side={props.pane.side}
      selected={props.pane.selected_instrument}
      edited_number={props.pane.edited_instrument}
      onRenumber={(base_instrument, new_instrument) => {
        if (props.undoRedo.renumberInstrument(side, base_instrument, new_instrument)) {
          props.pane.selected_instrument.value = new_instrument;
          props.pane.bumper.value = bump + 1;
        }
      }}
      onCopy={(instr) => {
          props.undoRedo.copyInstrument(side, instr);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }} />

  const eqControls =
    <EditControls
      name="Eq"
      side={props.pane.side}
      selected={props.pane.selected_eq}
      edited_number={props.pane.edited_eq}
      onRenumber={(base_eq, new_eq) => {
          if (props.undoRedo.renumberEq(side, base_eq, new_eq)) {
            props.pane.selected_eq.value = new_eq;
            props.pane.bumper.value = bump + 1;
          }
      }}
      onCopy={(eq) => {
        props.undoRedo.copyEq(side, eq);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }}/>;

  return <div class="rootcolumn">
    <details class="songsection">
      <summary>Chains</summary>
      <ChainList
        bump={props.pane.bumper}
        song={song}
        selected_chain={props.pane.selected_chain}
        edited_chain={props.pane.edited_chain}/>
    </details>
    <details class="songsection">
      <summary>Phrases list</summary>
      <PhraseList
        bump={props.pane.bumper}
        song={song}
        selected_phrase={props.pane.selected_phrase}
        edited_phrase={props.pane.edited_phrase} />
    </details>
    <details class="songsection">
      <summary>Intruments</summary>
      <InstrumentList
        side={props.pane.side}
        undoRedo={props.undoRedo}
        bump={props.pane.bumper}
        song={song}
        selected_instrument={props.pane.selected_instrument}
        edited_instrument={props.pane.edited_instrument}
        edited_instrument_name={props.pane.edited_instrument_name} />
    </details>
    <details class="songsection">
      <summary>Tables</summary>
      <TableList
        bump={props.pane.bumper}
        song={song}
        selected_table={props.pane.selected_table}
        edited_table={props.pane.edited_table} />
    </details>
    <details class="songsection">
      <summary>Eqs</summary>
      <EqList
        bump={props.pane.bumper}
        song={song}
        selected_eq={props.pane.selected_eq} />
    </details>
    <details class="songsection">
      <summary><div class="summary-root"><span class="summary-title">Chain {HexRep(props.pane.selected_chain)}</span> {chainControl}</div></summary>
      <ChainViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary><div class="summary-root"><span class="summary-title">Phrase {HexRep(props.pane.selected_phrase)}</span> {phraseControl}</div></summary>
      <PhraseViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary><div class="summary-root"><span class="summary-title">Instrument {HexRep(props.pane.selected_instrument)}</span> {instrumentControl}</div></summary>
      <InstrumentViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary><div class="summary-root"><span class="summary-title">Table {HexRep(props.pane.selected_table)}</span> {tableControl}</div></summary>
      <TableViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary><div class="summary-root"><span class="summary-title">Eq {HexRep(props.pane.selected_eq)}</span> {eqControls}</div></summary>
      <EqViewer panel={props.pane} banner={props.banner} />
    </details>
  </div>;
}

function UndoButton(props: { idx: number, log: EditLog, undoredo: UndoRedoer }) {
  return <button type="button"
                 class="modButton"
                 title="Undo operation and all after"
                 onClick={() => props.undoredo.undoTo(props.idx)}>↩</button>;
}

function RefRender(props: { reference: SongRef }) {
  const side = UnicodeSideIcon(props.reference.side);
  return <span class="songref">{side} {props.reference.song_name}</span>
}

function PatchKindRender(pk : PatchKind | "SNGSTEP") : string {
  return pk;
}

function PatchRender(props: { patch: PatchData }) {
  const patch = props.patch;
  return <li>{PatchKindRender(patch.kind)} {hexStr(patch.from_id)} -&gt; {hexStr(patch.to_id)}</li>;
}

function LogElement(props: { idx: number, elem: EditLog, disabled: boolean, undoredo: UndoRedoer }) {
  const elem = props.elem;
  const elem_class = props.disabled ? "logUndo disabledUndo" : "logUndo";

  switch (elem.kind) {
    case "error":
      return <div class="logError">
        🚫 <RefRender reference={elem.ref} />{elem.message}
      </div>;

    case "rename":
      return <div class={elem_class + " summary-root"} title={`Renamed instrument ${hexStr(elem.instr)}`}>
        <span class="icon">🏷</span>
        <RefRender reference={elem.ref} />
        <span>instrument {hexStr(elem.instr)}:{elem.old_name} -&gt; {elem.new_name}</span>
        <UndoButton idx={props.idx} log={elem} undoredo={props.undoredo}/>
      </div>;

    case "move":
      const elems = elem.patch.map(pe => <PatchRender patch={pe} />);

      return <div class={elem_class} title="Moved elements">
        <details>
          <summary class="summary-root">
            <span>
              <RefRender reference={elem.from_ref} /> -&gt; <RefRender reference={elem.to_ref} />
            </span>
            <span class="edit-controls">
              <UndoButton idx={props.idx} log={elem} undoredo={props.undoredo} />
            </span>
          </summary>
          <ul>{elems}</ul>
        </details>
      </div>;

    case "renumber":
      return <div class={elem_class + " summary-root"}>
        # <RefRender reference={elem.ref} /> {PatchKindRender(elem.elemKind)}:{hexStr(elem.old_value)} -&gt; {hexStr(elem.new_value)}
        <UndoButton idx={props.idx} log={elem} undoredo={props.undoredo} />
      </div>;
  }
}

function UndoRedoLog(props: { log: Signal<EditLog[]>, undo_level: Signal<number>, undoredo: UndoRedoer }) {
  const log = props.log.value;
  const log_pointer = props.undo_level.value;

  return <div class="undoredobox">
    {log.map((el,i) => <LogElement idx={i} disabled={i >= log_pointer} elem={el} undoredo={props.undoredo}/>)}
  </div>;
}

function App() {
  const undoRedo = new UndoRedoer(state);

  return <>
      <div class="selection-rect"></div>
      <div class="header">
        <div><h1>Re<pre class="titlepre">M8</pre>xer</h1><span>v0.4</span></div>
        <UndoRedoLog log={state.remap_log} undo_level={state.undo_stack_pointer} undoredo={undoRedo} />
      </div>
      <div class="rootcontainer">
        <SongExplorer pane={state.left} undoRedo={undoRedo}
                      other_pane={state.right} banner={state.message_banner} />
        <SongViewer panel={state.left} undoRedo={undoRedo} />
        <SongViewer panel={state.right} undoRedo={undoRedo} />
        <SongExplorer pane={state.right} undoRedo={undoRedo}
                      other_pane={state.left} banner={state.message_banner} />
      </div>
  </>;
}

render(
  <GlobalState.Provider value={state}><App/></GlobalState.Provider>,
  document.body);
