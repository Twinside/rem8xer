import { useContext, useEffect, useRef } from 'preact/hooks';
import * as W from '../../rem8x/pkg/rem8x';
import { GlobalState, SongPane } from "../state";
import { JSX } from 'preact/jsx-runtime';
import { Descriptor, NestDescriptor } from './descriptor';
import { Signal } from '@preact/signals';

function BandViewer(desc: NestDescriptor, onMode : (mode: number) => void) : JSX.Element[] {
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
        if (d.name === "MODE" && "str" in d) {
          mode = d.str;

          if ("hex" in d) { onMode(d.hex); }
        }
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

function DrawEq(context: CanvasRenderingContext2D, ys : Float64Array, color: string) {
		const height = context.canvas.clientHeight;
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = 1;

    let px = 0;
    let py = 0;

    const yy = ys[0] * 100;
    py = height - yy - 70;
    px = 0;

    for (let x = 1; x < ys.length; x++) {
      const y = ys[x] * 100;
      context.beginPath();
      context.moveTo(px, py);
      px = x;
      py = height - y - 70;
      context.lineTo(x, py);

      context.stroke();
    }
}

function DrawEqFrequencyBars(context: CanvasRenderingContext2D, freqs: Float64Array) {
		const width = context.canvas.clientWidth;
		const height = context.canvas.clientHeight;

    // draw bar at 10/100/1000/10000 Hz
    let target = 10.0;
    let previous = 0.0;
    context.fillStyle = '#555';
    context.font = "monospace";

    for (let i = 0; i < freqs.length; i++) {
      const f = freqs[i];
      if (f >= target && previous < target) {
        context.fillRect(i, 0, 1, height);
        context.fillText(target.toString(10), i - 10, 8);
        target *= 10;
      }

      previous = f;
    }

    const db0 = 0;
    context.fillRect(0, height - db0 - 70, width, 1);
}

const COLOR_MODE : readonly string[] =
  [
    '#ddd',
    '#d0d',
    '#dd0',
    '#0dd',
    '#0d0'
  ];

function EqPlot(props: { song: W.WasmSong, eq: number, banner: Signal<string | undefined>, eq_modes: number[] }) {
  let ys = new Float64Array(0);
  let freqs = W.eq_frequencies();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
		const current = canvasRef.current;
		if (current === null) return;

    const context = current.getContext('2d');
		if (context === null) return;

		const width = context.canvas.clientWidth;
		const height = context.canvas.clientHeight;

    context.clearRect(0, 0, width, height);
    DrawEqFrequencyBars(context, freqs);

    for (const mode of props.eq_modes) {
      try {
        ys = W.plot_eq(props.song, props.eq, mode) as any;
      } catch (err) {
        props.banner.value = err;
      }
      DrawEq(context, ys, COLOR_MODE[mode])
    }
  });
  return <canvas ref={canvasRef} width={300} height={150} />;
}

export function EqParamViewer(props: { panel: SongPane, banner: Signal<string | undefined>, eq:number}) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;
  const selected = props.eq;;
  const state = useContext(GlobalState);

  if (song === undefined || selected === undefined) {
        return { dom: undefined, modes: undefined };
  }

  let info : Descriptor[] = [];
  try {
    info = W.describe_eq(song, selected);
  } catch (err) {
    state.message_banner.value = err.toString();
    return { dom: undefined, modes: undefined };
  }

  let low : JSX.Element[]= [];
  let mid : JSX.Element[] = [];
  let high : JSX.Element[] = [];

  let modes : Set<number> = new Set();

  for (const nfo of info) {
    if (nfo.name === "LOW" && "nest" in nfo) {
      low = BandViewer(nfo, m => modes = modes.add(m));
    }
    if (nfo.name === "MID" && "nest" in nfo) {
      mid = BandViewer(nfo, m => modes = modes.add(m));
    }
    if (nfo.name === "HIGH" && "nest" in nfo) {
      high = BandViewer(nfo, m => modes = modes.add(m));
    }
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

  const dom = <table>
        <thead>
            <tr>
              <th></th>
              <th>LOW</th>
              <th>MID</th>
              <th>HIGH</th>
            </tr>
        </thead>
        <tbody>
            {final}
        </tbody>
    </table>;
    
    return { dom, modes };
}

export function EqViewer(props: { panel: SongPane, eq_id : number, banner: Signal<string | undefined> }) {
  return <div class="instrparam">
    <EqViewerAt panel={props.panel} eq={props.eq_id} banner={props.banner} />
  </div>;
}

export function EqViewerAt(props: { panel: SongPane, eq: number, banner: Signal<string | undefined> }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;
  const selected = props.eq;
  if (song === undefined) return undefined;

  const paramView = EqParamViewer({ panel: props.panel, banner: props.banner, eq: selected });
  return  <>
    <EqPlot song={song}
            eq={selected}
            banner={props.banner}
            eq_modes={Array.from(paramView.modes ?? [])} />
    {paramView.dom}
  </>;
}
