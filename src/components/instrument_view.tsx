import { useContext } from 'preact/hooks';
import * as W from '../../rem8x/pkg/rem8x';
import { GlobalState, openHighlightElem, SongPane } from "../state";
import { hexStr } from './common';
import { JSX } from 'preact/jsx-runtime';
import { BoolRender, Descriptor, FloatRender, HexGauge, HexRender, NestDescriptor, StrRender } from './descriptor';

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

    return <>
        <td>{props.v.name} CC:VAL</td>
        <td>{fillNum(cc)}:{hexStr(val)}</td>
        <td><HexGauge v={val} /></td>
    </>;
}

function FmOperatorRender(desc: NestDescriptor, legend: boolean) {
    const v = desc.nest;

    let osc = "";
    let ratio = 0.0;
    let level = 0;
    let fbk = 0;
    let moda = 0;
    let modb = 0;

    for (const desc of v) {
        if (desc.name === "SHAPE" && "str" in desc) {
            osc = desc.str;
        } else if (desc.name === "LEVEL" && "hex" in desc) {
            level = desc.hex;
        } else if (desc.name === "FBK" && "hex" in desc) {
            fbk = desc.hex;
        } else if (desc.name === "RATIO" && "f32" in desc) {
            ratio = desc.f32;
        } else if (desc.name === "MOD_A" && "hex" in desc) {
            moda = desc.hex;
        } else if (desc.name === "MOD_B" && "hex" in desc) {
            modb = desc.hex;
        }
    }

    return [
        <>{legend ? <td/>           : undefined}<td>{desc.name} {osc}</td></>,
        <>{legend ? <td>RATIO</td>  : undefined}<td>{ratio}</td></>,
        <>{legend ? <td>LEV/FB</td> : undefined}<td>{hexStr(level)}/{hexStr(fbk)}</td></>,
        <>{legend ? <td>MOD</td>    : undefined}<td>{hexStr(moda)}</td></>,
        <>{legend ? <td/>           : undefined}<td>{hexStr(modb)}</td></>
    ]
}

function HyperSynthChordsRender(desc: NestDescriptor) {
    const v = desc.nest;
    let i = 0;
    const lines = [];

    for (const desc of v) {
        if ("str" in desc) {
            lines.push(
                <tr>
                    <td class="chordNumber">{hexStr(i)}</td>
                    <td><pre class="chord">{desc.str}</pre></td>
                </tr>);
            i++;
        }
    }

    return <table>
        <thead><th>Chord</th><th>offsets</th></thead>
        <tbody>
            {lines}
        </tbody>
    </table>;
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

export function DescriptorRender(props: { desc: Descriptor }) {
    const { desc } = props;

    if ("str" in desc) return <StrRender v={desc} />;
    if ("hex" in desc) return <HexRender v={desc} />;
    if ("bool" in desc) return <BoolRender v={desc} />;
    if ("f32" in desc) return <FloatRender v={desc} />;
    if ("nest" in desc) {
        const descriptors = desc.nest.map(d => {
            if (d.name in CCValues && "nest" in d)
                return <CCRender v={d} />;

            return <DescriptorRender desc={d} />
        });

        return <div class="instrparam">
            <span>{desc.name}</span>
            <ul>{descriptors}</ul>
        </div>
    }

    return undefined;
}

const InRightColumn : {[name: string]: number } = {
    "AMP": 1,
    "LIM": 1,
    "PAN": 1,
    "DRY": 1,
    "CHORUS": 1,
    "DELAY": 1,
    "REVERB": 1,
    "ALG": 2,
    "SCALE": 2,
    "CHORD": 2,
    "SAMPLE": 2,
    "PORT": 2,
    "CHANNEL": 2,
    "BANK": 2,
    "PROGRAM": 2,
    "PLAY": 2,
    "SHAPE": 2,
    "SLICE": 2
};

const OperatorName : {[name: string]: number} = {
    "A": 0, "B": 1, "C": 2, "D": 3
}

function RootDescriptorRender(props: { pane: SongPane, instr: number, desc: Descriptor }) {
    const { pane, instr, desc } = props;
    let afterLeft = [];

    if ("str" in desc) return <StrRender v={desc} />;
    if ("hex" in desc) return <HexRender v={desc} />;
    if ("bool" in desc) return <BoolRender v={desc} />;
    if ("f32" in desc) return <FloatRender v={desc} />;
    if ("nest" in desc) {

        const buckets : JSX.Element[][] = [[], [], []];
        const operators : JSX.Element[][] = [];
        const mods : JSX.Element[] = [undefined, undefined, undefined, undefined];
        let name = "";
        let transpose = true;
        let tblTic = 1;
        let eq = 0xFF;

        for (const d of desc.nest) {
            if (d.name === "NAME" && "str" in d) {
                name = d.str;
                continue;
            }

            if (d.name === "TRANSPOSE" && "bool" in d) {
                transpose = d.bool
                continue;
            }

            if (d.name === "TBL. TIC" && "hex" in d) {
                tblTic = d.hex;
                continue;
            }

            if (d.name === "EQ" && "hex" in d) {
                eq = d.hex;
                continue;
            }

            if (d.name in OperatorName && "nest" in d) {
                const ix = OperatorName[d.name];
                operators[ix] = FmOperatorRender(d, d.name === "A");
                continue;
            }

            if (d.name === "CHORDS" && "nest" in d) {
                afterLeft.push(HyperSynthChordsRender(d));
                continue;
            }

            const asMod = MODRenderers[d.name];
            if (asMod !== undefined && "nest" in d) {
                mods[asMod] = <ModRender v={d.nest} />;
                continue;
            }

            const ix = d.name in InRightColumn ? InRightColumn[d.name] : 0;

            if (d.name in CCValues && "nest" in d) {
                buckets[ix].push(<CCRender v={d} />);
            } else {
                buckets[ix].push(<DescriptorRender desc={d} />);
            }
        }


        const maxi = Math.max(buckets[0].length, buckets[1].length);
        const lines = [];

        for (let i = 0; i < maxi; i++) {
            const left = i < buckets[0].length
                ? buckets[0][i]
                : <td colSpan={3}/>;

            const right = i < buckets[1].length
                ? buckets[1][i]
                : undefined;

            lines.push(<tr>{left}{right}</tr>)
        }

        for (const after of afterLeft)
            lines.push(<tr><td colspan={3}>{after}</td></tr>);

        const globalLines =
            buckets[2].map(elems => <tr>{elems}</tr>);

        if (operators.length > 0) {
            let max = operators[0].length;
            for (let i = 0; i < max; i++) {
                globalLines.push(<tr>
                    {operators[0][i]}
                    {operators[1][i]}
                    {operators[2][i]}
                    {operators[3][i]}
                </tr>);
            }
        }

        const eqValue = eq >= 0x80
            ? "--"
            : <span class="eq-link"
                    onClick={() => openHighlightElem(pane, "equ", eq)}>{hexStr(eq)}</span>;

        return <div class="instrparam">
            <span>{desc.name}</span>
            <div>NAME {name}</div>
            <div>
                <span>TRANSP. {transpose ? "ON" : "OFF"}</span>&nbsp;&nbsp;
                <span>TBL TIC.
                    <span class="table-link"
                          title="Show table associated of instrument"
                          onClick={() => openHighlightElem(pane, "table", instr)}>{hexStr(tblTic)}</span>
                    </span>&nbsp;&nbsp;
                <span>EQ {eqValue}</span>
            </div>
            <table>
                <tbody>{globalLines}</tbody>
            </table>
            <table>
                <tbody>{lines}</tbody>
            </table>
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

export function InstrumentViewer(props: { instr_id: number, panel: SongPane }) {
  const song = props.panel.song.value;
  const bump = props.panel.bumper.value;
  const state = useContext(GlobalState);

  let info : Descriptor[] = [];
  try {
    info = W.describe_instrument(song, props.instr_id);
  } catch (err) {
    state.message_banner.value = err.toString();
    return undefined;
  }

  return <div class="instrparam">
    {info.map(d => <RootDescriptorRender pane={props.panel} instr={props.instr_id} desc={d} />)}
  </div>;
}
