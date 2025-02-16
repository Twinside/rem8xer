import * as W from '../../rem8x/pkg/m8_files';
import { Signal } from "@preact/signals";
import { hexStr } from "./common";

export function EqList(props: {
  song: W.WasmSong,
  bump: Signal<number>,
  selected_eq: Signal<number | undefined>
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
       <span onClick={() => props.selected_eq.value = vix}>{hexStr(vix)} </span>);
  }

  if (bucket.length !== 0) {
    elems.push(<div class="instr">{bucket}</div>);
  }

  return <pre>{elems}</pre>;
}
