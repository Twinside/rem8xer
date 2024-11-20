import { useContext } from 'preact/hooks';
import * as W from '../../m8-files/pkg/m8_files';
import { GlobalState, SongPane } from "../state";
import { hexStr } from './common';
import { JSX } from 'preact/jsx-runtime';
import { Descriptor, NestDescriptor } from './descriptor';

function BandViewer(desc: NestDescriptor) : JSX.Element[] {
    let gain = 0;
    let freq = 0;
    let q = 0;
    let type = "";
    let mode = "";

    for (const d of desc.nest) {
        if (d.name === "GAIN" && "f32" in d) gain = d.f32;
        if (d.name === "FREQ" && "f32" in d) freq = d.f32;
        if (d.name === "Q" && "hex" in d) q = d.hex;
        if (d.name === "TYPE" && "str" in d) type = d.str;
        if (d.name === "MODE" && "str" in d) mode = d.str;
    }

    return [
        <td>{gain}</td>,
        <td>{freq}</td>,
        <td>{q}</td>,
        <td>{type}</td>,
        <td>{mode}</td>,
    ];
}

const NAMES : ReadonlyArray<string> =
    [ "GAIN", "FREQ", "Q", "TYPE", "MODE" ];

export function EqViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;
  const selected = props.panel.selected_eq.value;
  const state = useContext(GlobalState);

  if (song === undefined || selected === undefined)
        return undefined;

  let info : Descriptor[] = [];
  try {
    info = W.describe_eq(song, selected);
  } catch (err) {
    state.message_banner.value = err.toString();
    return undefined;
  }

  let low : JSX.Element[]= [];
  let mid : JSX.Element[] = [];
  let high : JSX.Element[] = [];

  for (const nfo of info) {
    if (nfo.name === "LOW" && "nest" in nfo) low = BandViewer(nfo);
    if (nfo.name === "MID" && "nest" in nfo) mid = BandViewer(nfo);
    if (nfo.name === "HIGH" && "nest" in nfo) high = BandViewer(nfo);
  }

  const final = [];

  for (let i = 0; i < NAMES.length; i++) {
    final.push(<tr>
        <td>{NAMES[i]}</td>
        {low[i]}
        {mid[i]}
        {high[i]}
    </tr>);
  }

  return <div class="instrparam">
    <table>
        <thead>
            <th></th>
            <th>LOW</th>
            <th>MID</th>
            <th>HIGH</th>
        </thead>
        <tbody>
            {final}
        </tbody>
    </table>
  </div>;
}
