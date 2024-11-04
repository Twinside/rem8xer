import { render } from "preact";
import "./style.css";
import * as W from '../m8-files/pkg/m8_files';
import { GlobalState, initState, SongPane } from "./state";
import { InstrumentList } from "./components/instrument_list";
import { ChainViewer } from "./components/chain_viewer";
import { SongViewer } from "./components/song_viwer";

W.init();
const state = initState();

function MessageBanner() {
  const msg = state.message_banner.value;
  if (msg === undefined) return <></>;
  return <div>{msg}</div>;
}

function SongExplorer(props: { pane: SongPane }) {
  const song = props.pane.song.value;
  if (song === undefined) return <></>;

  return <>
    <details class="songsection">
      <summary>Chains</summary>
    </details>
    <details class="songsection">
      <summary>Phrases</summary>
    </details>
    <details class="songsection">
      <summary>Intruments</summary>
      <InstrumentList
        bump={props.pane.bumper}
        song={song}
        edited_instrument={props.pane.edited_instrument}
        edited_instrument_name={props.pane.edited_instrument_name} />
    </details>
  </>;
}

function App() {
  return <>
      <div class="selection-rect"></div>
      <div><h1>Re<pre class="titlepre">M8</pre>xer</h1><span>v0.3</span></div>
      <MessageBanner />
      <div class="rootcontainer">
        <div class="rootcolumn">
          <SongExplorer pane={state.left} />
          <ChainViewer panel={state.left} />
        </div>
        <SongViewer side="left" panel={state.left} />
        <SongViewer side="right" panel={state.right} />
        <div class="rootcolumn">
          <SongExplorer pane={state.right}/>
          <ChainViewer panel={state.right} />
        </div>
      </div>
  </>;
}

render(
  <GlobalState.Provider value={state}><App/></GlobalState.Provider>,
  document.body);
