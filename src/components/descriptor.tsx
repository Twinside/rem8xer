import { hexStr } from "./common";

export type NestDescriptor = { name: string, nest: Descriptor[] };

export type Descriptor =
    | { name: string, hex: number }
    | { name: string, bool: boolean }
    | { name: string, f32: number }
    | { name: string, str: string, hex?: number }
    | NestDescriptor

export function HexGauge(props: { v: number }) {
    return <div class="hexgauge" style={"--hex: " + props.v} />;
}

export function HexRender(props: { v: { name: string, hex: number }}) {
    return <>
        <td>{props.v.name}</td>
        <td>{hexStr(props.v.hex)}</td>
        <td><HexGauge v={props.v.hex} /></td>
    </>;
}

export function BoolRender(props: { v: { name: string, bool: boolean }}) {
    return <>
        <td>{props.v.name}</td>
        <td colSpan={2}>{props.v.bool ? "ON" : "OFF"}</td>
    </>;
}

export function FloatRender(props: { v: { name: string, f32: number }}) {
    return <li>{props.v.name}: {props.v.f32}</li>;
}

export function StrRender(props: { v: { name: string, str: string, hex?: number }}) {
    if ("hex" in props.v) {
        return <>
            <td>{props.v.name}</td>
            <td>{hexStr(props.v.hex)}</td>
            <td>{props.v.str}</td>
        </>;
    }

    return <>
        <td>{props.v.name}</td>
        <td colSpan={2}>{props.v.str}</td>
    </>;
}
