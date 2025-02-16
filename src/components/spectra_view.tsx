import { Signal } from '@preact/signals';
import * as W from '../../rem8x/pkg/m8_files';
import { SongPane } from "../state";
import { EqViewerAt } from './eq_viewer';
import { Descriptor } from './descriptor';
import { hexStr } from './common';
import { DescriptorRender } from './instrument_view';


function InstrumentView(props : { panel: SongPane, song: W.WasmSong, ix: number, banner: Signal<string | undefined>  }) {
    const instr_name = W.instrument_name(props.song, props.ix);
    const succint  : Descriptor[] = W.describe_succint_instrument(props.song, props.ix);

    let eq = -1;
    let isMidi = false;
    for (const s of succint) {
        if (s.name == "EQ" && "hex" in s)
            eq = s.hex;
        if (s.name == "KIND" && "str" in s)
            isMidi = s.str === "MIDIOUT";

    }

    // TODO: render succing
    return <div class="succint">
        <div class="succintfields">
            
            <table>
                <tr><th colSpan={2}>{hexStr(props.ix)} {instr_name}</th></tr>
                {succint.map(d => <tr><DescriptorRender desc={d} /></tr>)}
            </table>
        </div>
        {
            eq >= 0 && eq < 35 && !isMidi
                ? <EqViewerAt panel={props.panel} banner={props.banner} eq={eq} />
                : undefined
        }
    </div>;
}

export function SpectraView(props: { panel: SongPane, banner: Signal<string | undefined> }) {
    const song = props.panel.song.value;
    const bump = props.panel.bumper.value;

    if (song === undefined) return <></>;

    const instruments = W.allocated_instrument_list(song);
    const views = [];

    for (const idx of instruments) {
        views.push(<InstrumentView panel={props.panel} song={song} ix={idx} banner={props.banner} />);
    }

    return <div>{views}</div>;
}