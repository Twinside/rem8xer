import { useContext } from 'preact/hooks';
import * as W from '../../m8-files/pkg/m8_files';
import { GlobalState, SongPane } from "../state";
import { hexStr } from './common';
import { JSX } from 'preact/jsx-runtime';

export function PhraseViewer(props: { panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;

  if (song === undefined) return undefined;

  const phrase_idx = props.panel.selected_phrase.value;
  return (phrase_idx !== undefined)
    ? <pre>{W.show_phrase(song, phrase_idx)}</pre>
    : undefined
}

type NestDescriptor = { name: string, nest: Descriptor[] };
type Descriptor =
    | { name: string, hex: number }
    | { name: string, bool: boolean }
    | { name: string, f32: number }
    | { name: string, str: string, hex?: number }
    | NestDescriptor

function HexGauge(props: { v: number }) {
    return <div class="hexgauge" style={"--hex: " + props.v} />;
}

function HexRender(props: { v: { name: string, hex: number }}) {
    return <li>{props.v.name}: <HexGauge v={props.v.hex} /> </li>;
}

function BoolRender(props: { v: { name: string, bool: boolean }}) {
    return <li>{props.v.name}: {props.v.bool ? "ON" : "OFF"}</li>;
}

function FloatRender(props: { v: { name: string, f32: number }}) {
    return <li>{props.v.name}: {props.v.f32}</li>;
}

function StrRender(props: { v: { name: string, str: string }}) {
    return <li>{props.v.name}: {props.v.str}</li>;
}

const MODRenderers : { [name: string]: number } = {
    "MOD1": 0,
    "MOD2": 1,
    "MOD3": 2,
    "MOD4": 3,
};
const CCValues =
    {
        "CCA": 0,
        "CCB": 1,
        "CCC": 2,
        "CCD": 3,
        "CCE": 4,
        "CCF": 5,
        "CCG": 6,
        "CCH": 7,
        "CCI": 8,
        "CCJ": 9
    };

function CCRender(props: { v: NestDescriptor }) {
    let cc = 0;
    let val = 1;

    for (const v of props.v.nest) {
        if (v.name === "CC" && "hex" in v) cc = v.hex;
        if (v.name === "VAL" && "hex" in v) val = v.hex;
    }

    const fillNum = (n : number) => {
        const strN = n.toString(10);
        if (n >= 100) return strN;
        if (n >= 10) return "0" + strN;
        return "00" + strN;
    }

    return <li>
        {props.v.name} CC:VAL {fillNum(cc)}:{hexStr(val)} <HexGauge v={val} />
    </li>;
}

function ModRender(props: { v: Descriptor[]}) {
    const lines = props.v.map(desc => {
        if (!("hex" in desc)) return undefined;

        if (desc.name in MODRenderers) {
            return <tr>
                <th>{desc.name}</th>
                <td>{hexStr(desc.hex)}</td>
                <th>{"str" in desc ? desc.str : <HexGauge v={desc.hex} />}</th>
            </tr>
        }
        return <tr>
            <td>{desc.name}</td>
            <td>{hexStr(desc.hex)}</td>
            <td>{"str" in desc ? desc.str : <HexGauge v={desc.hex} />}</td>
        </tr>
    });

    return <table>
        <tbody>{lines}</tbody>
    </table>;
}

function DescriptorRender(props: { desc: Descriptor }) {
    const { desc } = props;

    if ("str" in desc) return <StrRender v={desc} />;
    if ("hex" in desc) return <HexRender v={desc} />;
    if ("bool" in desc) return <BoolRender v={desc} />;
    if ("f32" in desc) return <FloatRender v={desc} />;
    if ("nest" in desc) {
        const mods : JSX.Element[] = [undefined, undefined, undefined, undefined];
        const descriptors = desc.nest.map(d => {
            const asMod = MODRenderers[d.name];
            if (asMod !== undefined && "nest" in d) {
                mods[asMod] = <ModRender v={d.nest} />;
                return undefined;
            }

            if (d.name in CCValues && "nest" in d)
                return <CCRender v={d} />;

            return <DescriptorRender desc={d} />
        });


        return <div class="instrparam] =">
            <span>{desc.name}</span>
            <ul>{descriptors}</ul>
            <table>
                <tbody>
                    <tr><td>{mods[0]}</td><td>{mods[2]}</td></tr>
                    <tr><td>{mods[1]}</td><td>{mods[3]}</td></tr>
                </tbody>
            </table>
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
