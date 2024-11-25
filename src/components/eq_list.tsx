import * as W from '../../m8-files/pkg/m8_files';
import { Signal } from "@preact/signals";
import { hexStr } from "./common";

export function EqList(props: {
  song: W.WasmSong,
  bump: Signal<number>,
  selected_eq: Signal<number | undefined>
} ) {
  const phrases = W.allocated_table(props.song);
  const elems = [];
  const eqPerRow = 8;
  let bucket = [];
  let prevEq = phrases.length > 0 ? phrases[0] : 0;

  for (let vix = 0; vix < 32 + 3; vix++) {
    if ((prevEq / eqPerRow | 0 ) !== (vix / eqPerRow | 0)) {
        elems.push(<div class="instr">{bucket}</div>);
        bucket = [];
    }

    prevEq = vix;

    bucket.push(
       <span onClick={() => props.selected_eq.value = vix}>{hexStr(vix)} </span>);
  }

  if (bucket.length !== 0) {
    elems.push(<div class="instr">{bucket}</div>);
  }

  return <pre>{elems}</pre>;
}
