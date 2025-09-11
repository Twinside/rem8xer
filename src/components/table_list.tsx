import * as W from '../../rem8x/pkg/rem8x';
import { openHighlightElem, SongPane } from "../state";
import { Signal } from "@preact/signals";
import { hexStr } from "./common";

export function TableList(props: { pane: SongPane, song: W.WasmSong, bump: Signal<number> } ) {
  const phrases = W.allocated_table(props.song);
  const elems = [];
  const bump = props.bump.value;
  let bucket = [];
  let prevPhrase = phrases.length > 0 ? phrases[0] : 0;

  for (const vix of phrases) {
    if ((prevPhrase / 16 | 0 ) !== (vix / 16 | 0)) {
        elems.push(<div class="instr">{bucket}</div>);
        bucket = [];
    }

    prevPhrase = vix;

    bucket.push(
        <span onClick={() => openHighlightElem(props.pane, "table", vix)}
              class="table-link">{hexStr(vix)} </span>);
  }

  if (bucket.length !== 0) {
    elems.push(<div class="instr">{bucket}</div>);
  }

  return <pre>{elems}</pre>;
}
