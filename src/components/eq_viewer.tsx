import { useContext, useEffect, useRef } from 'preact/hooks';
import * as W from '../../m8-files/pkg/m8_files';
import { GlobalState, SongPane } from "../state";
import { hexStr } from './common';
import { JSX } from 'preact/jsx-runtime';
import { Descriptor, NestDescriptor } from './descriptor';
import { Signal } from '@preact/signals';

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

function EqPlot(props: { song: W.WasmSong, eq: number, banner: Signal<string | undefined> }) {
  let ys = new Float64Array(0);
  try {
    ys = W.plot_eq(props.song, props.eq);
  } catch (err) {
    props.banner.value = err;
  }

  let freqs = W.eq_frequencies();

  console.log(ys);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
		const current = canvasRef.current;
		if (current === null) return;

        const context = current.getContext('2d');
		if (context === null) return;

		const width = context.canvas.clientWidth;
		const height = context.canvas.clientHeight;

    context.clearRect(0, 0, width, height);

    // draw bar at 10/100/1000/10000 Hz
    let target = 10.0;
    let previous = 0.0;
    context.fillStyle = '#555';
    for (let i = 0; i < freqs.length; i++) {
      const f = freqs[i];
      if (f >= target && previous < target) {
        context.fillRect(i, 0, 1, height);
        target *= 10;
      }

      previous = f;
    }

    const db0 = 0;
    context.fillRect(0, height - db0 - 70, width, 1);

    context.fillStyle = '#ddd';

    for (let x = 0; x < ys.length; x++) {
      const y = ys[x] * 100;
      context.fillRect(x, height - y - 70, 2, 2);
    }
  });
  return <canvas ref={canvasRef} width={300} height={150} />;
}

export function EqViewer(props: { panel: SongPane, banner: Signal<string | undefined> }) {
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
    <EqPlot song={song} eq={selected} banner={props.banner} />
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
