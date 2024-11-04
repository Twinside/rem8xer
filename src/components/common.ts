export function hexStr(n : number) : string {
  const hexStr = n.toString(16);
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
