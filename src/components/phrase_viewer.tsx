import * as W from '../../rem8x/pkg/rem8x';
import { SongPane } from "../state";

export function PhraseViewer(props: { view_index: number, phrase_idx: number, panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return undefined;

  const isLeft = props.panel.side === 'left';
  return <pre dangerouslySetInnerHTML={{__html: W.show_phrase(song, isLeft, props.phrase_idx)}}></pre>;
}

export function TableViewer(props: { view_index: number, table_idx: number, panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return undefined;

  const isLeft = props.panel.side === 'left';
  return <pre dangerouslySetInnerHTML={{__html: W.show_table(song, isLeft, props.table_idx)}}></pre>;
}
