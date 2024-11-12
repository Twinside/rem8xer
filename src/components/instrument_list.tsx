import * as W from '../../m8-files/pkg/m8_files';
import { EmptyInstrumentNameEdition, EmptyInstrumentNumberEidition, GlobalState, InstrumentNameEditor, InstrumentNumberEdition } from "../state";
import { Signal } from "@preact/signals";
import { hexStr } from "./common";
import { HexNumberEditor, NameEditor } from "./hexnumbereditor";
import { useContext } from 'preact/hooks';

export function InstrumentList(props: {
  song: W.WasmSong,
  bump: Signal<number>,
  edited_instrument: Signal<InstrumentNumberEdition | undefined>,
  edited_instrument_name: Signal<InstrumentNameEditor | undefined>,
} ) {
  const instruments = W.allocated_instrument_list(props.song);
  const elems = [];
  const state = useContext(GlobalState);
  const current_edit_name = props.edited_instrument_name.value;
  const edited_name = current_edit_name  || EmptyInstrumentNameEdition;
  const current_edit = props.edited_instrument.value
  const edited_instr = current_edit  || EmptyInstrumentNumberEidition;
  const allow_new_edit = current_edit_name  === undefined && current_edit === undefined;
  const bump = props.bump.value;

  for (const vix of instruments) {
    const real_name = W.instrument_name(props.song, vix);
    let name =
      real_name === '' ? '\u00A0\u00A0\u00A0\u00A0' : real_name;

    const toggle_instr = () =>
      props.edited_instrument.value = {
        base_instrument: vix,
        current_value: vix
      };

    const toggle_name = () =>
      props.edited_instrument_name.value = {
        instrument_id: vix,
        name: real_name
      };

    const id_change = (v: number) =>
      props.edited_instrument.value = { ...edited_instr, current_value: v };

    const id_validate = (v : number) => {
      props.edited_instrument.value = undefined;
      try {
        W.renumber_instrument(props.song, edited_instr.base_instrument, v)
        props.bump.value = bump + 1;
      }
      catch (err) {
        state.message_banner.value = err.toString();
      }
    };

    const name_change = (name: string) => {
        props.edited_instrument_name.value = { ...edited_name, name };
    }

    const name_validate = (name : string) => {
        props.edited_instrument_name.value = undefined;
        try {
            W.rename_instrument(props.song, edited_name.instrument_id, name);
            props.bump.value = bump + 1;
        }
        catch (err) {
            state.message_banner.value = err.toString();
        }
    }

    elems.push(
      <div class="instr">
        {
          edited_instr.base_instrument === vix
            ? <HexNumberEditor
                onChange={id_change}
                onValidate={id_validate}
                onCancel={() => props.edited_instrument.value = undefined}
                value={edited_instr.current_value}/>
            : <span onDblClick={allow_new_edit ? toggle_instr : undefined}
                    title="Double click to renumber">{hexStr(vix)} : </span>
        }
        {
          edited_name.instrument_id === vix
            ? <NameEditor
                onValidate={name_validate}
                onChange={name_change}
                onCancel={() => {
                  props.edited_instrument_name.value = undefined;
                  props.bump.value = bump + 1;
                }}
                value={edited_name.name}
                max={12} />
            : <span onDblClick={allow_new_edit ? toggle_name : undefined}
                    class="instr_name"
                    title="Double click to rename">{name}</span>
        }
      </div>
    )
  }
  return <pre>{elems}</pre>;
}
