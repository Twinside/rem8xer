import { JSX } from 'preact/jsx-runtime';
import type { PanelSide } from '../state';

export function hexStr(n : number) : string {
  const hexStr = n.toString(16).toUpperCase();
  return hexStr.length <= 1 ? "0" + hexStr : hexStr;
}

export type SongSide = "left" | "right"
export type DraggedChain = {
  chain: number,
  from_song: SongSide
}

export function isDraggedChain(o : any) : o is DraggedChain {
  return o !== null
    && typeof o === 'object'
    && 'chain' in o
    && 'from_song' in o
    && typeof o.chain === 'number'
    && typeof o.from_song === 'string';
}

export function RenumberButton(props: { name: string, onClick: () => void}) {
    return <button type="button"
                   class="modButton"
                   title={`Renumber ${props.name}`}
                   onClick={() => props.onClick()}>#</button>;
}

export function CopyElement(props: { name: string, from_side: PanelSide, onClick: () => void }) {
    let label = props.from_side === "left" ? "▶" : "◀";
    return <button type="button"
                   class="modButton"
                   title={`copy ${props.name} to other song`}
                   onClick={() => props.onClick()}>{label}</button>;
}
