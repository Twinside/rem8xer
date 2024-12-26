import { JSX, render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { GlobalState, initState, NumberEdition, PanelSide, SongPane } from "./state";
import { InstrumentList } from "./components/instrument_list";
import { ChainViewer } from "./components/chain_viewer";
import { SongViewer } from "./components/song_viwer";
import { PhraseList } from "./components/phrase_list";
import { PhraseViewer, TableViewer } from "./components/phrase_viewer";
import { CopyElement, hexStr, RenumberButton } from "./components/common";
import { ChainList } from "./components/chain_list";
import { TableList } from "./components/table_list";
import { InstrumentViewer } from "./components/instrument_view";
import { EqList } from "./components/eq_list";
import { EqViewer } from "./components/eq_viewer";
import { Signal } from "@preact/signals";
import { HexNumberEditor } from "./components/hexnumbereditor";

W.init();
const state = initState();

function MessageBanner() {
  const msg = state.message_banner.value;
  if (msg === undefined) return <></>;
  return <div>{msg}</div>;
}

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

function SongExplorer(props: { pane: SongPane, other_pane: SongPane, banner: Signal<string | undefined> }) {
  const song = props.pane.song.value;
  if (song === undefined) return <></>;

  const bump = props.pane.bumper.value;
  const phraseControl =
        <EditControls
          name="phrase"
          side={props.pane.side}
          selected={props.pane.selected_phrase}
          edited_number={props.pane.edited_phrase}
          onRenumber={(base_phrase, new_phrase) => {
            try {
              W.renumber_phrase(song, base_phrase, new_phrase)
              props.pane.selected_phrase.value = new_phrase;
              props.pane.bumper.value = bump + 1;
            }
            catch (err) {
              state.message_banner.value = err.toString();
            }
          }}
          onCopy={(phrase) => {
            const other = props.other_pane.song.value
            if (other === undefined) return;
            W.copy_phrase(song, other, phrase, phrase);
            props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
          }} />

  const chainControl = 
    <EditControls
      name="chain"
      side={props.pane.side}
      selected={props.pane.selected_chain}
      edited_number={props.pane.edited_chain}
      onRenumber={(base_chain, new_chain) => {
          try {
            W.renumber_chain(song, base_chain, new_chain)
            props.pane.selected_chain.value = new_chain;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
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
          try {
            W.renumber_table(song, base_table, new_table)
            props.pane.selected_table.value = new_table;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
        }}
        onCopy={(tbl) => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_table(song, other, tbl, tbl);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />;

  const instrumentControl =
    <EditControls
      name="Instrument"
      side={props.pane.side}
      selected={props.pane.selected_instrument}
      edited_number={props.pane.edited_instrument}
      onRenumber={(base_instrument, new_instrument) => {
        try {
          W.renumber_instrument(song, base_instrument, new_instrument)
          props.pane.selected_instrument.value = new_instrument;
          props.pane.bumper.value = bump + 1;
        }
        catch (err) {
          state.message_banner.value = err.toString();
        }
      }}
      onCopy={(instr) => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_instrument(song, other, instr, instr);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
      }} />

  const eqControls =
    <EditControls
      name="Eq"
      side={props.pane.side}
      selected={props.pane.selected_eq}
      edited_number={props.pane.edited_eq}
      onRenumber={(base_eq, new_eq) => {
          try {
            W.renumber_eq(song, base_eq, new_eq)
            props.pane.selected_eq.value = new_eq;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
      }}
      onCopy={(eq) => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_eq(song, other, eq, eq);
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

function App() {
  return <>
      <div class="selection-rect"></div>
      <div><h1>Re<pre class="titlepre">M8</pre>xer</h1><span>v0.4</span></div>
      <MessageBanner />
      <div class="rootcontainer">
        <SongExplorer pane={state.left} other_pane={state.right} banner={state.message_banner} />
        <SongViewer side="left" panel={state.left} />
        <SongViewer side="right" panel={state.right} />
        <SongExplorer pane={state.right} other_pane={state.left} banner={state.message_banner} />
      </div>
  </>;
}

render(
  <GlobalState.Provider value={state}><App/></GlobalState.Provider>,
  document.body);
