import * as W from '../../rem8x/pkg/rem8x';
import { ChainNumberEdition, EmptyChainEdition, GlobalState } from "../state";
import { Signal } from "@preact/signals";
import { hexStr } from "./common";
import { HexNumberEditor, NameEditor } from "./hexnumbereditor";
import { useContext } from 'preact/hooks';

export function ChainList(props: {
  song: W.WasmSong,
  bump: Signal<number>,
  selected_chain: Signal<number | undefined>,
  edited_chain: Signal<ChainNumberEdition | undefined>
} ) {
  const phrases = W.allocated_chain_list(props.song);
  const elems = [];
  const state = useContext(GlobalState);
  const current_edit = props.edited_chain.value
  const edited_chain = current_edit  || EmptyChainEdition;
  const allow_new_edit = current_edit === undefined;
  const bump = props.bump.value;
  let bucket = [];
  let prevPhrase = phrases.length > 0 ? phrases[0] : 0;

  for (const vix of phrases) {
    const toggle_phrase = () =>
      props.edited_chain.value = {
        x: -1,
        y: -1,
        base_value: vix,
        current_value: vix
      };

    const id_change = (v: number) =>
      props.edited_chain.value = { ...current_edit, current_value: v };

    const id_validate = (v : number) => {
      props.edited_chain.value = undefined;
      try {
        W.renumber_chain(props.song, edited_chain.base_value, v)
        props.bump.value = bump + 1;
      }
      catch (err) {
        state.message_banner.value = err.toString();
      }
    };

    if ((prevPhrase / 16 | 0 ) !== (vix / 16 | 0)) {
        elems.push(<div class="instr">{bucket}</div>);
        bucket = [];
    }

    prevPhrase = vix;

    bucket.push(
        edited_chain.base_value === vix
            ? <HexNumberEditor
                onChange={id_change}
                onValidate={id_validate}
                onCancel={() => props.edited_chain.value = undefined}
                value={edited_chain.current_value}/>
            : <span onDblClick={allow_new_edit ? toggle_phrase : undefined}
                    onClick={() => props.selected_chain.value = vix}
                    title="Double click to renumber chain">{hexStr(vix)} </span>);
  }

  if (bucket.length !== 0) {
    elems.push(<div class="instr">{bucket}</div>);
  }

  return <pre>{elems}</pre>;
}
