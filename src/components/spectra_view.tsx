import { Signal } from '@preact/signals';
import * as W from '../../m8-files/pkg/m8_files';
import { SongPane } from "../state";
import { EqViewerAt } from './eq_viewer';
import { Descriptor } from './descriptor';


function InstrumentView(props : { panel: SongPane, song: W.WasmSong, ix: number, banner: Signal<string | undefined>  }) {
    const instr_name = W.instrument_name(props.song, props.ix);
    const succint  : Descriptor[] = W.describe_succint_instrument(props.song, props.ix);

    // TODO: render succing
    return <div>
        <div>
            {instr_name}
        </div>
        <EqViewerAt panel={props.panel} banner={props.banner} eq={props.ix} />
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