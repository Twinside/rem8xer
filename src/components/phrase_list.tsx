import * as W from '../../m8-files/pkg/m8_files';
import { EmptyNumberEdition, GlobalState, NumberEdition } from "../state";
import { Signal } from "@preact/signals";
import { hexStr } from "./common";
import { HexNumberEditor } from "./hexnumbereditor";
import { useContext } from 'preact/hooks';

export function PhraseList(props: {
  song: W.WasmSong,
  bump: Signal<number>,
  selected_phrase: Signal<number | undefined>,
  edited_phrase: Signal<NumberEdition | undefined>
} ) {
  const phrases = W.allocated_phrase_list(props.song);
  const elems = [];
  const state = useContext(GlobalState);
  const current_edit = props.edited_phrase.value
  const edited_phrase = current_edit  || EmptyNumberEdition;
  const allow_new_edit = current_edit === undefined;
  const bump = props.bump.value;
  let bucket = [];
  let prevPhrase = phrases.length > 0 ? phrases[0] : 0;

  for (const vix of phrases) {
    const toggle_phrase = () =>
      props.edited_phrase.value = {
        base_value: vix,
        current_value: vix
      };

    const id_change = (v: number) =>
      props.edited_phrase.value = { ...current_edit, current_value: v };

    const id_validate = (v : number) => {
      props.edited_phrase.value = undefined;
      try {
        W.renumber_phrase(props.song, edited_phrase.base_value, v)
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
        edited_phrase.base_value === vix
        ? <HexNumberEditor
            onChange={id_change}
            onValidate={id_validate}
            onCancel={() => props.edited_phrase.value = undefined}
            value={edited_phrase.current_value}/>
        : <span onDblClick={allow_new_edit ? toggle_phrase : undefined}
                onClick={() => props.selected_phrase.value = vix}
                title="Double click to renumber phrase">{hexStr(vix)} </span>);
  }

  if (bucket.length !== 0) {
    elems.push(<div class="instr">{bucket}</div>);
  }

  return <pre>{elems}</pre>;
}
