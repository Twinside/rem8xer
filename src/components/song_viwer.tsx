import * as W from '../../m8-files/pkg/m8_files';
import { clearPanel, GlobalState, SongPane } from "../state";
import { downloadBlob } from "../utils";
import emptyUrl from "../V4EMPTY.m8s";
import revUrl from "../CMDMAPPING.m8s";
import { loadDroppedSong, loadUrl } from "../fileio";
import { SongSide } from "./common";
import { StepsRender } from "./steps_render";
import { useContext } from 'preact/hooks';

export function SongViewer(props: { side: SongSide, panel: SongPane }) {
  const state = useContext(GlobalState);

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
      <button onClick={() => loadUrl(state, panel, revUrl)}>Reversing</button>
      <div class="filetarget"
           onDragOver={(ev) => ev.preventDefault()}
           onDrop={(evt) => loadDroppedSong(state, evt, props.panel)}>
        <span>Drag M8 song file here</span>
      </div>
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
