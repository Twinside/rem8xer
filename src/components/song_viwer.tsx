import * as W from '../../rem8x/pkg/rem8x';
import { clearPanel, GlobalState, SongPane } from "../state";
import { downloadBlob } from "../utils";
import empty4_0_url from "../V4EMPTY.m8s";
import empty5_0_url from "../V5EMPTY.m8s";
import reverseUrl_5_0 from "../CMDMAPPING_5_0.m8s";
import { loadDroppedSong, loadUrl } from "../fileio";
import { StepsRender } from "./steps_render";
import { useContext } from 'preact/hooks';
import { UndoRedoer } from './edit_log';

const  versionHelpText =
  "Song version is important for writing song, you can only write a song of the same version, you can transfert across version though.";

export function SongHeader(props: { panel: SongPane}) {
  const state = useContext(GlobalState);

  const panel = props.panel;
  const song = panel.song.value;
  const bump = panel.bumper.value;

  if (song === undefined) {
    // debug helper
    const debugLoad = false
      ? <>
        <button onClick={() => loadUrl(state, panel, reverseUrl_5_0)}>Reversing 5.0</button>
      </>
      : undefined;

    return <div class="rootcolumn">
      <button
        onClick={() => loadUrl(state, panel, empty4_0_url)}
        title={versionHelpText}>Load M8 FW 4.0 empty song (song format 4)</button>
      <button
        onClick={() => loadUrl(state, panel, empty5_0_url)}
        title={versionHelpText}>Load M8 FW 5.0 empty song (song format 4.2)</button>
      {debugLoad}
      <div class="filetarget"
           onDragOver={(ev) => ev.preventDefault()}
           onDrop={(evt) => loadDroppedSong(state, evt, props.panel)}>
        <span>Drag M8 song file here</span>
      </div>
    </div>;
  }

  const songName = W.song_name(song);
  const songVersion = W.song_version(song);

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

  const activeTab = props.panel.active_view.value;
  const loaded_name = panel.loaded_name.value === undefined
    ? ''
    : `'${panel.loaded_name.value}' `;

  return <div>
      <h3 style="display: inline-block;" title={`${loaded_name}version ${songVersion}`}>{songName}</h3>
      <span class="separator" />
      <button onClick={save}>Save</button>
      <button onClick={clear}>Clear</button>
      <div class="tabcontainer">
        <div class="tabs">
          <div class={"tab" + (activeTab === "song" ? " tabactive" : "")}
               onClick={() => props.panel.active_view.value = "song"}>Song</div>
          <div class={"tab" + (activeTab === "spectra" ? " tabactive" : "")}
               onClick={() => props.panel.active_view.value = "spectra"}>Spectraview</div>
        </div>
      </div>
    </div>;
}

export function SongViewer(props: { panel: SongPane, undoRedo: UndoRedoer }) {
  const panel = props.panel;
  const song = panel.song.value;
  const bump = panel.bumper.value;

  if (song === undefined) return <></>;

  const steps = W.get_song_steps(song);
  return <div class="rootcolumn">
    <div class="songsteps-wrapper">
      <StepsRender steps={steps} pane={props.panel} undoRedo={props.undoRedo} />
    </div>
  </div>;
}
