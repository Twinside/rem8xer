import { useContext } from 'preact/hooks';
import * as W from '../../m8-files/pkg/m8_files';
import { GlobalState, SongPane } from "../state";
import { hexStr } from './common';

export function PhraseViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return undefined;

  const phrase_idx = props.panel.selected_phrase.value;
  return (phrase_idx !== undefined)
    ? <pre>{W.show_phrase(song, phrase_idx)}</pre>
    : undefined
}

type Descriptor =
    | { name: string, hex: number }
    | { name: string, bool: boolean }
    | { name: string, f32: number }
    | { name: string, str: string }
    | { name: string, nest: Descriptor[] }

function HexRender(props: { v: { name: string, hex: number }}) {
    return <li>{props.v.name}: {hexStr(props.v.hex)}</li>;
}

function BoolRender(props: { v: { name: string, bool: boolean }}) {
    return <li>{props.v.name}: {props.v.bool}</li>;
}

function FloatRender(props: { v: { name: string, f32: number }}) {
    return <li>{props.v.name}: {props.v.f32}</li>;
}

function StrRender(props: { v: { name: string, str: string }}) {
    return <li>{props.v.name}: {props.v.str}</li>;
}

function DescriptorRender(props: { desc: Descriptor }) {
    const { desc } = props;

    if ("hex" in desc) return <HexRender v={desc} />;
    if ("bool" in desc) return <BoolRender v={desc} />;
    if ("str" in desc) return <StrRender v={desc} />;
    if ("f32" in desc) return <FloatRender v={desc} />;
    if ("nest" in desc) {
        return <div class="instrparam">
            <span>{desc.name}</span>
            <ul>
                {desc.nest.map(d => <DescriptorRender desc={d} />)}
            </ul>
        </div>
    }

    return undefined;
}

export function InstrumentViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;
  const selected = props.panel.selected_instrument.value;
  const state = useContext(GlobalState);

  if (song === undefined || selected === undefined)
        return undefined;

  let info : Descriptor[] = [];
  try {
    info = W.describe_instrument(song, selected);
  } catch (err) {
    state.message_banner.value = err.toString();
    return undefined;
  }

  return <div class="instrparam">
    {info.map(d => <DescriptorRender desc={d} />)}
  </div>;
}
