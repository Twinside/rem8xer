import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { GlobalState, initState, SongPane } from "./state";
import { InstrumentList } from "./components/instrument_list";
import { ChainViewer } from "./components/chain_viewer";
import { SongViewer } from "./components/song_viwer";
import { PhraseList } from "./components/phrase_list";
import { PhraseViewer, TableViewer } from "./components/phrase_viewer";
import { hexStr } from "./components/common";
import { ChainList } from "./components/chain_list";
import { TableList } from "./components/table_list";
import { InstrumentViewer } from "./components/instrument_view";
import { EqList } from "./components/eq_list";
import { EqViewer } from "./components/eq_viewer";
import { Signal } from "@preact/signals";

W.init();
const state = initState();

function MessageBanner() {
  const msg = state.message_banner.value;
  if (msg === undefined) return <></>;
  return <div>{msg}</div>;
}

function SongExplorer(props: { pane: SongPane, banner: Signal<string | undefined> }) {
  const song = props.pane.song.value;
  if (song === undefined) return <></>;

  const selectedPhrase = props.pane.selected_phrase.value;
  const displayedPhrase = selectedPhrase === undefined ? '' : ' ' + hexStr(selectedPhrase);

  const selectedChain = props.pane.selected_chain.value;
  const displayedChain = selectedChain === undefined ? '' : ' ' + hexStr(selectedChain);

  const selectedTable = props.pane.selected_table.value;
  const displayedTable = selectedTable === undefined ? '' : ' ' + hexStr(selectedTable);

  const selectedInstrument = props.pane.selected_instrument.value;
  const displayedInstrument = selectedInstrument === undefined ? '' : ' ' + hexStr(selectedInstrument );

  const selectedEq = props.pane.selected_eq.value;
  const displayedEq = selectedEq === undefined ? '' : ' ' + hexStr(selectedEq);

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
      <summary>Chain{displayedChain}</summary>
      <ChainViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Phrase{displayedPhrase}</summary>
      <PhraseViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Instrument{displayedInstrument}</summary>
      <InstrumentViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Table{displayedTable}</summary>
      <TableViewer panel={props.pane} />
    </details>
    <details class="songsection">
      <summary>Eq{displayedEq}</summary>
      <EqViewer panel={props.pane} banner={props.banner} />
    </details>
  </div>;
}

function App() {
  return <>
      <div class="selection-rect"></div>
      <div><h1>Re<pre class="titlepre">M8</pre>xer</h1><span>v0.3</span></div>
      <MessageBanner />
      <div class="rootcontainer">
        <SongExplorer pane={state.left} banner={state.message_banner} />
        <SongViewer side="left" panel={state.left} />
        <SongViewer side="right" panel={state.right} />
        <SongExplorer pane={state.right} banner={state.message_banner} />
      </div>
  </>;
}

render(
  <GlobalState.Provider value={state}><App/></GlobalState.Provider>,
  document.body);
