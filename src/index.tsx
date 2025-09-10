import { JSX, render } from "preact";
import "./style.css";
import * as W from '../rem8x/pkg/rem8x';
import { closeView, EditLog, ElementView, fixViewId, GlobalState, initState, NumberEdition, openHighlightElem, PanelSide, PatchData, PatchKind, SongPane, SongRef } from "./state";
import { InstrumentList } from "./components/instrument_list";
import { ChainViewer } from "./components/chain_viewer";
import { SongHeader, SongViewer } from "./components/song_viwer";
import { PhraseList } from "./components/phrase_list";
import { PhraseViewer, TableViewer } from "./components/phrase_viewer";
import { CloseElement, CopyElement, hexStr, RenumberButton, UnicodeSideAction, UnicodeSideIcon } from "./components/common";
import { ChainList } from "./components/chain_list";
import { TableList } from "./components/table_list";
import { InstrumentViewer } from "./components/instrument_view";
import { EqList } from "./components/eq_list";
import { EqViewer } from "./components/eq_viewer";
import { Signal } from "@preact/signals";
import { HexNumberEditor } from "./components/hexnumbereditor";
import { UndoRedoer } from "./components/edit_log";
import { SpectraView } from "./components/spectra_view";

W.init();
const state = initState();
globalThis.show_instrument = (side: "l"|"r", n : number) => {
  const pane = side === "l" ? state.left : state.right;
  openHighlightElem(pane, "instrument", n);
};

globalThis.show_table = (side: "l"|"r", n : number) => {
  const pane = side === "l" ? state.left : state.right;
  openHighlightElem(pane, "table", n);
};

globalThis.show_eq = (side: "l"|"r", n : number) => {
  const pane = side === "l" ? state.left : state.right;
  openHighlightElem(pane, "equ", n);
};

/** Renumbering and copy button dependent on current selected/edited. */
function EditControls(props: {
    name: string,
    panel: SongPane,
    view_index: number,
    selectedElement: number,
    edited_number: Signal<NumberEdition | undefined>,
    canRenumber?: (value : number) => boolean,
    onRenumber: (base_value, value: number) => void,
    onCopy?: (selected: number) => void}) : JSX.Element {

  const { name, panel, selectedElement, view_index, edited_number } = props;
  const side = panel.side;
  const edited  = edited_number.value;
  const renumbering =
    (props.canRenumber !== undefined && !props.canRenumber(selectedElement)) ? undefined :
    (edited === undefined || edited.view_index !== props.view_index)
      ? <RenumberButton
          name={name}
          onClick={() =>
            edited_number.value = { view_index, base_value: selectedElement, current_value: selectedElement } } />
     
      : <HexNumberEditor
          value={edited.current_value}
          onChange={v => edited_number.value = { ...edited, current_value: v }}
          onCancel={() => edited_number.value = undefined}
          onValidate={v =>{
            edited_number.value = undefined;
            props.onRenumber(edited.base_value, v);
          }}/>;

  const control = selectedElement !== undefined && props.onCopy !== undefined
      ? <CopyElement name={name} from_side={side} onClick={() => props.onCopy(selectedElement)} />
      : undefined;

    return <span class="edit-controls">
      {renumbering}
      {control}
      <CloseElement from_side={side} onClick={() => closeView(panel, props.view_index) } />
    </span>
}

function HexRep(sig : number) : JSX.Element {
  return <span style="font-family: monospace;">{hexStr(sig)}</span>;
}

function PhraseElementView(
  props: {
    pane: SongPane,
    undoRedo: UndoRedoer,
    other_pane: SongPane,
    banner: Signal<string | undefined>,
    elem: ElementView
  }) {
  const side = props.pane.side;
  const bump = props.pane.bumper.value;
  const { view_index, elem_id } = props.elem;

  const phraseControl =
        <EditControls
          name="phrase"
          view_index={view_index}
          panel={props.pane}
          selectedElement={props.elem.elem_id}
          edited_number={props.pane.edited_view}
          onRenumber={(base_phrase, new_phrase) => {
            if (props.undoRedo.renumberPhrase(side, base_phrase, new_phrase)) {
              fixViewId(props.pane, view_index, new_phrase);
              props.pane.bumper.value = bump + 1;
            }
          }}
          onCopy={(phrase) => {
            props.undoRedo.copyPhrase(side, phrase);
            props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
          }} />;

  return <details class="songsection" open>
      <summary><div class="summary-root"><span class="summary-title">Phrase {HexRep(elem_id)}</span> {phraseControl}</div></summary>
      <PhraseViewer panel={props.pane} view_index={view_index} phrase_idx={elem_id} />
    </details>;
}

function ChainElementView(
  props: {
    pane: SongPane,
    undoRedo: UndoRedoer,
    other_pane: SongPane,
    banner: Signal<string | undefined>,
    elem: ElementView
  }) {
  const side = props.pane.side;
  const bump = props.pane.bumper.value;
  const { view_index, elem_id } = props.elem;

  const chainControl = 
    <EditControls
      name="chain"
      panel={props.pane}
      selectedElement={elem_id}
      view_index={view_index}
      edited_number={props.pane.edited_chain}
      onRenumber={(base_chain, new_chain) => {
          if (props.undoRedo.renumberChain(side, base_chain, new_chain)) {
            fixViewId(props.pane, view_index, new_chain);
            props.pane.bumper.value = bump + 1;
          }
      }}/>;

  return <details class="songsection" open>
    <summary><div class="summary-root"><span class="summary-title">Chain {HexRep(elem_id)}</span> {chainControl}</div></summary>
    <ChainViewer view_id={view_index} chain_idx={elem_id} panel={props.pane} />
  </details>;
}

function EqElementView(
  props: {
    pane: SongPane,
    undoRedo: UndoRedoer,
    other_pane: SongPane,
    banner: Signal<string | undefined>,
    elem: ElementView
  }) {
  const side = props.pane.side;
  const bump = props.pane.bumper.value;
  const { view_index, elem_id } = props.elem;

  const eqControls =
    <EditControls
      name="Eq"
      panel={props.pane}
      selectedElement={elem_id}
      view_index={view_index}
      edited_number={props.pane.edited_view}
      onRenumber={(base_eq, new_eq) => {
          if (props.undoRedo.renumberEq(side, base_eq, new_eq)) {
            fixViewId(props.pane, view_index, new_eq);
            props.pane.bumper.value = bump + 1;
          }
      }}
      onCopy={(eq) => {
        props.undoRedo.copyEq(side, eq);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }}/>;

  return <details class="songsection" open>
      <summary><div class="summary-root"><span class="summary-title">Eq {HexRep(elem_id)}</span> {eqControls}</div></summary>
      <EqViewer eq_id={elem_id} panel={props.pane} banner={props.banner} />
  </details>;
}

function InstrumentElementView(
  props: {
    pane: SongPane,
    undoRedo: UndoRedoer,
    other_pane: SongPane,
    banner: Signal<string | undefined>,
    elem: ElementView
  }) {
  const side = props.pane.side;
  const bump = props.pane.bumper.value;
  const { view_index, elem_id } = props.elem;

  const instrumentControl =
    <EditControls
      name="Instrument"
      panel={props.pane}
      selectedElement={elem_id}
      view_index={view_index}
      edited_number={props.pane.edited_view}
      onRenumber={(base_instrument, new_instrument) => {
        if (props.undoRedo.renumberInstrument(side, base_instrument, new_instrument)) {
          fixViewId(props.pane, view_index, new_instrument);
          props.pane.bumper.value = bump + 1;
        }
      }}
      onCopy={(instr) => {
          props.undoRedo.copyInstrument(side, instr);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }} />
  return <details class="songsection" open>
    <summary><div class="summary-root"><span class="summary-title">Instrument {HexRep(elem_id)}</span> {instrumentControl}</div></summary>
    <InstrumentViewer panel={props.pane} instr_id={elem_id} />
  </details>;
}

function TableElementView(
  props: {
    pane: SongPane,
    undoRedo: UndoRedoer,
    other_pane: SongPane,
    banner: Signal<string | undefined>,
    elem: ElementView
  }) {
  const side = props.pane.side;
  const bump = props.pane.bumper.value;
  const { view_index, elem_id } = props.elem;

  const tableControl =
    <EditControls
        name="Table"
        panel={props.pane}
        selectedElement={elem_id}
        edited_number={props.pane.edited_view}
        view_index={view_index}
        canRenumber={tbl => tbl > 0x7F}
        onRenumber={(base_table, new_table) => {
          if (props.undoRedo.renumberTable(side, base_table, new_table)) {
            fixViewId(props.pane, view_index, new_table);
            props.pane.bumper.value = bump + 1;
          }
        }}
        onCopy={(tbl) => {
          props.undoRedo.copyTable(side, tbl);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />;

    return <details class="songsection" open>
      <summary><div class="summary-root"><span class="summary-title">Table {HexRep(elem_id)}</span> {tableControl}</div></summary>
      <TableViewer view_index={view_index} table_idx={elem_id} panel={props.pane} />
    </details>;
}

function SongElementView(props: {
  pane: SongPane,
  undoRedo: UndoRedoer,
  other_pane: SongPane,
  banner: Signal<string | undefined>,
  elem: ElementView
}) {
  const elem = props.elem;
  const bump = props.pane.bumper.value;

  switch (elem.kind) {
    case "phrase":
      return <PhraseElementView pane={props.pane} undoRedo={props.undoRedo} other_pane={props.other_pane} banner={props.banner} elem={elem} />;
    case "chain":
      return <ChainElementView pane={props.pane} undoRedo={props.undoRedo} other_pane={props.other_pane} banner={props.banner} elem={elem} />;
    case "equ":
      return <EqElementView pane={props.pane} undoRedo={props.undoRedo} other_pane={props.other_pane} banner={props.banner} elem={elem} />;
    case "instrument":
      return <InstrumentElementView pane={props.pane} undoRedo={props.undoRedo} other_pane={props.other_pane} banner={props.banner} elem={elem} />;
    case "table":
      return <TableElementView pane={props.pane} undoRedo={props.undoRedo} other_pane={props.other_pane} banner={props.banner} elem={elem} />;
  }
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

  const songViews =
    props.pane.song_views.value.map(view =>
      <SongElementView elem={view} pane={props.pane} undoRedo={props.undoRedo} other_pane={props.other_pane} banner={props.banner} />);

  return <div class="rootcolumn">
    <details class="songsection-list">
      <summary>Chain list</summary>
      <ChainList pane={props.pane} song={song} />
    </details>
    <details class="songsection-list">
      <summary>Phrases list</summary>
      <PhraseList pane={props.pane} bump={props.pane.bumper} song={song} />
    </details>
    <details class="songsection-list">
      <summary>Intruments list</summary>
      <InstrumentList
        side={props.pane.side}
        undoRedo={props.undoRedo}
        bump={props.pane.bumper}
        song={song}
        edited_instrument_name={props.pane.edited_instrument_name} />
    </details>
    <details class="songsection-list">
      <summary>Table list</summary>
      <TableList pane={props.pane} bump={props.pane.bumper} song={song} />
    </details>
    <details class="songsection-list">
      <summary>Eq list</summary>
      <EqList pane={props.pane}bump={props.pane.bumper} song={song} />
    </details>
    {songViews}
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

  const leftView = 
    state.left.closed.value ? undefined :
      state.left.active_view.value === "song"
      ?  <div class="rootcontent">
          <SongExplorer pane={state.left} undoRedo={undoRedo}
                        other_pane={state.right} banner={state.message_banner} />
          <SongViewer panel={state.left} undoRedo={undoRedo} />
        </div>
      : <SpectraView panel={state.left} banner={state.message_banner} />;

  const rightView =
    state.right.closed.value ? undefined :
      state.right.active_view.value === "song"
      ? <div class="rootcontent">
          <SongViewer panel={state.right} undoRedo={undoRedo} />
          <SongExplorer pane={state.right} undoRedo={undoRedo}
                        other_pane={state.left} banner={state.message_banner} />
        </div>
      : <SpectraView panel={state.right} banner={state.message_banner} />;

  return <>
      <div class="selection-rect"></div>
      <div class="header">
        <div><h1>Re<pre class="titlepre">M8</pre>xer</h1><span>v0.10</span></div>
        <UndoRedoLog log={state.remap_log} undo_level={state.undo_stack_pointer} undoredo={undoRedo} />
      </div>
      <div class="rootcontainer">
        <div class={state.left.closed.value ? "rootcollape" : "rootheader"}>
          <SongHeader panel={state.left} />
          {leftView}
        </div>
        <div class={state.right.closed.value ? "rootcollape" : "rootheader"}>
          <SongHeader panel={state.right} />
          {rightView}
        </div>
      </div>
  </>;
}

render(
  <GlobalState.Provider value={state}><App/></GlobalState.Provider>,
  document.body);
