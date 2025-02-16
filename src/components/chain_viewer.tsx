import * as W from '../../rem8x/pkg/m8_files';
import { SongPane } from "../state";
import { hexStr } from "./common";

export function ChainViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return <div class="rootcolumn"></div>;

  const chain = props.panel.selected_chain.value;
  if (chain === undefined) {
    return <div class="rootcolumn">
      <p>Select a chain to view</p>
    </div>;
  }

  const chainSteps = W.get_chain_steps(song, chain);
  const elems = [];

  const phraseSet = (i : number) => {
    props.panel.selected_phrase.value = i;
  }

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
