import * as W from '../../rem8x/pkg/rem8x';
import { Signal } from "@preact/signals";
import { hexStr } from "./common";
import { openHighlightElem, SongPane } from '../state';

export function EqList(props: {
  song: W.WasmSong,
  pane: SongPane,
  bump: Signal<number>,
} ) {
  const eqs = W.allocated_eq_list(props.song);
  const elems = [];
  const eqPerRow = 8;
  let bucket = [];
  let prevEq = eqs.length > 0 ? eqs[0] : 0;

  for (const vix of eqs) {
    if ((prevEq / eqPerRow | 0 ) !== (vix / eqPerRow | 0)) {
        elems.push(<div class="instr">{bucket}</div>);
        bucket = [];
    }

    prevEq = vix;

    bucket.push(
       <span class="eq-link"
             onClick={() => openHighlightElem(props.pane, "equ", vix)}>{hexStr(vix)} </span>);
  }

  if (bucket.length !== 0) {
    elems.push(<div class="instr">{bucket}</div>);
  }

  return <pre>{elems}</pre>;
}
