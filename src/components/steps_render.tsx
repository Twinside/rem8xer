import { useContext } from 'preact/hooks';
import * as W from '../../m8-files/pkg/m8_files';
import { EmptyChainEdition, EmptySelection, GlobalState, SongPane } from '../state';
import { DraggedChain, hexStr, isDraggedChain, SongSide } from "./common";
import { HexNumberEditor } from './hexnumbereditor';

export function StepsRender(props: {
    side: SongSide,
    steps: Uint8Array,
    pane: SongPane,
  }) {
  const state = useContext(GlobalState);
  const elems = [];
  const pane = props.pane;
  const steps = props.steps;
  const bump_val = props.pane.bumper.value;
  let read_cursor = 0;

  const dragStart = (evt : DragEvent, chain: number) => {
    const asJson : DraggedChain = { chain, from_song: props.side };
    evt.dataTransfer.setData("text/plain", JSON.stringify(asJson));
    evt.dataTransfer.dropEffect = "copy";
  };

  const dragOver = (evt: DragEvent) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  }

  const dragEnd = (evt : DragEvent, line : number, col : number) => {
    const strPayload = evt.dataTransfer.getData('text/plain');
    try {
      const asJson = JSON.parse(strPayload);
      if (!isDraggedChain(asJson))
        return;

      if (asJson.from_song === props.side) {
        state.message_banner.value = "We avoid copying a chain into the same song";
      } else if (asJson.from_song === "left") {
        W.copy_chain(state.left.song.value, state.right.song.value, asJson.chain, col, line);
      } else {
        W.copy_chain(state.right.song.value, state.left.song.value, asJson.chain, col, line);
      }

      pane.bumper.value = pane.bumper.value + 1;

    } catch(err) {
      state.message_banner.value = `Chain copy error: ${err}`;
    }
  }

  const selection = pane.selection_range.value || EmptySelection;
  const isSelected = (line : number, column : number) =>
      selection.start.x <= column && column <= selection.end.x &&
      selection.end.y <= line && line <= selection.end.y;

  const edition = pane.edited_chain.value || EmptyChainEdition;
  for (let line = 0; line < 0x100; line++) {
    elems.push(<span class="spanline">{hexStr(line)} : </span>)

    for (let col = 0; col < 8; col++) {
      const chain = steps[read_cursor++];
      const selClass = isSelected(line, col)
        ? " selected-chain"
        : "";

      if (chain === 0xFF) {
        const elem =
          <span class="scselect"
                data-line={line}
                data-col={col}
                onDragOver={evt => dragOver(evt)}
                onDrop={evt => dragEnd(evt, line, col)}>-- </span>;
        elems.push(elem);
      } else if (edition.x === col && edition.y === line) {
        const onChange = (value: number) => {
          pane.edited_chain.value = {...edition, current_value: value};
        };

        const onValidate = (value: number) => {
          pane.edited_chain.value = undefined;
          try {
            W.renumber_chain(pane.song.value, edition.base_chain, value);
          } catch (err) {
            state.message_banner.value = err.toString();
          }
          pane.bumper.value = pane.bumper.value + 1;
        };

        elems.push(
          <HexNumberEditor
            value={edition.current_value}
            onChange={onChange}
            onValidate={onValidate} />);
      } else {
        const elem =
          <span class={"songchain scselect" + selClass}
                data-line={line}
                data-col={col}
                draggable={true}
                onDragStart={evt => dragStart(evt, chain)}
                onDragOver={evt => dragOver(evt)}
                onDrop={evt => dragEnd(evt, line, col)}
                onDblClick={() => pane.edited_chain.value = { x: col, y: line, current_value: chain, base_chain: chain }}
                onClick={() => pane.selected_chain.value = chain}>{hexStr(chain)} </span>; 

        elems.push(elem);
      }
    }

    elems.push('\n');
  }

  // const sel = new SelectionRectangle(".selection-rect", props.selection);

  return <pre class="songsteps"
              // onMouseDown={(evt) => sel.onMouseDown(evt)}
              // onMouseMove={(evt) => sel.onMouseMove(evt)}
              // onMouseUp={(evt) => sel.onMouseUp(evt)}
              >{elems}</pre>;
}