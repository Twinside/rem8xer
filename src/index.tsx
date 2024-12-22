import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { EmptyInstrumentNumberEidition, GlobalState, initState, SongPane } from "./state";
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

function EditControls(name: string, number: Signal<number>) {

}
function SongExplorer(props: { pane: SongPane, other_pane: SongPane, banner: Signal<string | undefined> }) {
  const song = props.pane.song.value;
  if (song === undefined) return <></>;

  const bump = props.pane.bumper.value;
  const selectedPhrase = props.pane.selected_phrase.value;
  const displayedPhrase = selectedPhrase === undefined ? '' : ' ' + hexStr(selectedPhrase);
  const edited_phrase  = props.pane.edited_phrase.value;
  const phrase_renumbering = edited_phrase === undefined
    ? <RenumberButton name="Phrase" onClick={() => props.pane.edited_phrase.value = { base_phrase: selectedPhrase, current_value: selectedPhrase } } />
    : <HexNumberEditor
        value={edited_phrase.current_value}
        onChange={v => props.pane.edited_phrase.value = { ...edited_phrase, current_value: v }}
        onCancel={() => props.pane.edited_phrase.value = undefined}
        onValidate={v =>{
          props.pane.edited_phrase.value = undefined;
          try {
            W.renumber_phrase(song, edited_phrase.base_phrase, v)
            props.pane.selected_phrase.value = v;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
        }}/>;

  const phraseControl = selectedPhrase === undefined
    ? undefined
    : <>
        {phrase_renumbering}
        <CopyElement name="Phrase" from_side={props.pane.side} onClick={() => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_phrase(song, other, selectedPhrase, selectedPhrase);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />
      </>;

  const selectedChain = props.pane.selected_chain.value;
  const displayedChain = selectedChain === undefined ? '' : ' ' + hexStr(selectedChain);
  const edited_chain  = props.pane.edited_chain.value;
  const chain_renumbering = edited_chain === undefined
    ? <RenumberButton name="Chain" onClick={() =>
        props.pane.edited_chain.value = { base_chain: selectedChain, current_value: selectedChain, x: -1, y: -1 } } />
    : <HexNumberEditor
        value={edited_chain.current_value}
        onChange={v => props.pane.edited_chain.value = { ...edited_chain, current_value: v }}
        onCancel={() => props.pane.edited_chain.value = undefined}
        onValidate={v =>{
          props.pane.edited_chain.value = undefined;
          try {
            W.renumber_chain(song, edited_chain.base_chain, v)
            props.pane.selected_chain.value = v;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
        }}/>;

  const chainControl = selectedChain === undefined
    ? undefined
    : chain_renumbering;

  const selectedTable = props.pane.selected_table.value;
  const displayedTable = selectedTable === undefined ? '' : ' ' + hexStr(selectedTable);
  const edited_table  = props.pane.edited_table.value;
  const table_renumbering = edited_table === undefined
    ? <RenumberButton name="Table" onClick={() => props.pane.edited_table.value = { base_phrase: selectedPhrase, current_value: selectedPhrase } } />
    : <HexNumberEditor
        value={edited_table.current_value}
        onChange={v => props.pane.edited_table.value = { ...edited_table, current_value: v }}
        onCancel={() => props.pane.edited_table.value = undefined}
        onValidate={v =>{
          props.pane.edited_table.value = undefined;
          try {
            W.renumber_table(song, edited_table.base_phrase, v)
            props.pane.selected_table.value = v;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
        }}/>;

  const tableControl = selectedTable === undefined
    ? undefined
    : <>
        {table_renumbering}
        <CopyElement name="Table" from_side={props.pane.side} onClick={() => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_table(song, other, selectedTable, selectedTable);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />
      </>;

  const selectedInstrument = props.pane.selected_instrument.value;
  const edited_instrument = props.pane.edited_instrument.value;
  const current_edit = props.pane.edited_instrument.value
  const edited_instr = current_edit  || EmptyInstrumentNumberEidition;
  const displayedInstrument = selectedInstrument === undefined ? '' : ' ' + hexStr(selectedInstrument );
  const instrumentRenumbering = edited_instrument === undefined
    ? <RenumberButton
        name="Instrument"
        onClick={() => props.pane.edited_instrument.value = { base_instrument: selectedInstrument, current_value: selectedInstrument }} />
    : <HexNumberEditor
        value={edited_instr.current_value}
        onChange={v => props.pane.edited_instrument.value = { ...edited_instr, current_value: v }}
        onCancel={() => props.pane.edited_instrument.value = undefined}
        onValidate={v =>{
          props.pane.edited_instrument.value = undefined;
          try {
            W.renumber_instrument(song, edited_instr.base_instrument, v)
            props.pane.selected_instrument.value = v;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
        }}/>;

  const instrumentControl = selectedInstrument === undefined
    ? undefined
    : <>
        {instrumentRenumbering}
        <CopyElement name="Instrument" from_side={props.pane.side} onClick={() => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_instrument(song, other, selectedInstrument, selectedInstrument);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />
      </>;

  const selectedEq = props.pane.selected_eq.value;
  const displayedEq = selectedEq === undefined ? '' : ' ' + hexStr(selectedEq);
  const edited_eq  = props.pane.edited_eq.value;
  const eqRenumbering = edited_eq === undefined
    ? <RenumberButton name="EQ" onClick={() => props.pane.edited_eq.value = { base_eq: selectedEq, current_value: selectedEq } } />
    : <HexNumberEditor
        value={edited_instr.current_value}
        onChange={v => props.pane.edited_eq.value = { ...edited_eq, current_value: v }}
        onCancel={() => props.pane.edited_eq.value = undefined}
        onValidate={v =>{
          props.pane.edited_eq.value = undefined;
          try {
            W.renumber_eq(song, edited_eq.base_eq, v)
            props.pane.selected_eq.value = v;
            props.pane.bumper.value = bump + 1;
          }
          catch (err) {
            state.message_banner.value = err.toString();
          }
        }}/>;

  const eqControls = selectedEq === undefined
    ? undefined
    : <>
        {eqRenumbering}
        <CopyElement name="EQ" from_side={props.pane.side} onClick={() => {
          const other = props.other_pane.song.value
          if (other === undefined) return;
          W.copy_eq(song, other, selectedEq, selectedEq);
          props.other_pane.bumper.value = props.other_pane.bumper.value + 1;
        }} />
      </>;

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
      <summary>Chain{displayedChain} {chainControl}</summary>
      <ChainViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Phrase{displayedPhrase} {phraseControl}</summary>
      <PhraseViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Instrument{displayedInstrument} {instrumentControl}</summary>
      <InstrumentViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Table{displayedTable} {tableControl}</summary>
      <TableViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Eq{displayedEq} {eqControls}</summary>
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
