import * as W from '../../rem8x/pkg/rem8x';
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

export function TableViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return undefined;

  const table_idx = props.panel.selected_table.value;
  return (table_idx !== undefined)
    ? <pre>{W.show_table(song, table_idx)}</pre>
    : undefined
}
