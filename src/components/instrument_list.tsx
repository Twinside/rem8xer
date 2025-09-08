import * as W from '../../rem8x/pkg/rem8x';
import { EmptyInstrumentNameEdition, GlobalState, InstrumentNameEditor, openHighlightElem, PanelSide, paneOfSide } from "../state";
import { Signal } from "@preact/signals";
import { hexStr } from "./common";
import { NameEditor } from "./hexnumbereditor";
import { useContext } from 'preact/hooks';
import { UndoRedoer } from './edit_log';

export function InstrumentList(props: {
  song: W.WasmSong,
  bump: Signal<number>,
  side: PanelSide,
  undoRedo: UndoRedoer,
  edited_instrument_name: Signal<InstrumentNameEditor | undefined>,
} ) {
  const instruments = W.allocated_instrument_list(props.song);
  const elems = [];
  const state = useContext(GlobalState);
  const current_edit_name = props.edited_instrument_name.value;
  const edited_name = current_edit_name  || EmptyInstrumentNameEdition;
  const allow_new_edit = current_edit_name  === undefined;
  const bump = props.bump.value;

  for (const vix of instruments) {
    const real_name = W.instrument_name(props.song, vix);
    let name =
      real_name === '' ? '\u00A0\u00A0\u00A0\u00A0' : real_name;

    const toggle_name = () =>
      props.edited_instrument_name.value = {
        instrument_id: vix,
        name: real_name
      };

    const name_change = (name: string) => {
        props.edited_instrument_name.value = { ...edited_name, name };
    }

    const name_validate = (name : string) => {
        props.edited_instrument_name.value = undefined;
        props.undoRedo.renameInstrument(props.side, edited_name.instrument_id, name);
    }

    const open_instrument = () => {
      openHighlightElem(paneOfSide(state, props.side), "instrument", vix);
    }

    elems.push(
      <div class="instr">
        {
            <span onClick={() => open_instrument()} >{hexStr(vix)} : </span>
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
                    onClick={() => open_instrument()}
                    class="instr_name"
                    title="Double click to rename">{name}</span>
        }
      </div>
    )
  }
  return <pre>{elems}</pre>;
}
