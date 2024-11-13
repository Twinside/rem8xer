import * as W from '../../m8-files/pkg/m8_files';
import { SongPane } from "../state";

export function PhraseViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return undefined;

  const phrase_idx = props.panel.selected_phrase.value;
  return (phrase_idx !== undefined)
    ? <pre>{W.show_phrase(song, phrase_idx)}</pre>
    : undefined
}
