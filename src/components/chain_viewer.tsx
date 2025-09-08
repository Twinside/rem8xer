import * as W from '../../rem8x/pkg/rem8x';
import { openHighlightElem, SongPane } from "../state";
import { hexStr } from "./common";

export function ChainViewer(props: { view_id: number, chain_idx: number, panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return <div class="rootcolumn"></div>;

  const chainSteps = W.get_chain_steps(song, props.chain_idx);
  const elems = [];

  const phraseSet = (i : number) => 
      openHighlightElem(props.panel, "phrase", i);

  for (let i = 0; i < 32; i += 2) {
    elems.push(`${(i / 2).toString(16)} : `)
    const phrase = chainSteps[i];

    if (phrase === 0xFF) {
      elems.push("--\n")
    } else {
      elems.push(<span class="phrase" onClick={_ => phraseSet(phrase)}>{hexStr(phrase)} {hexStr(chainSteps[i + 1])}</span>)
      elems.push('\n')
    }
  }

  return <div class="chain_viewer">
    <pre>
      {elems}
    </pre>
  </div>;
}
