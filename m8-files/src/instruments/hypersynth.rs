use crate::reader::*;
use super::common::SynthParams;
use super::common::TranspEq;

use arr_macro::arr;

#[derive(PartialEq, Debug, Clone)]
pub struct HyperSynth {
    pub number: u8,
    pub name: String,
    pub transp_eq: TranspEq,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub scale: u8,
    pub default_chord: [u8; 7],
    pub shift: u8,
    pub swarm: u8,
    pub width: u8,
    pub subosc: u8,

    pub chords: [[u8; 6]; 0x10]
}

impl HyperSynth {
    const MOD_OFFSET : usize = 23;

    pub fn write(&self, w: &mut Writer) {
        w.write_string(&self.name, 12);
        w.write(self.transp_eq.into());
        w.write(self.table_tick);
        w.write(self.synth_params.volume);
        w.write(self.synth_params.pitch);
        w.write(self.synth_params.fine_tune);

        for c in self.default_chord {
            w.write(c);
        }

        w.write(self.scale);
        w.write(self.shift);
        w.write(self.swarm);
        w.write(self.width);
        w.write(self.subosc);

        self.synth_params.write(w, HyperSynth::MOD_OFFSET);

        for chd in self.chords {
            w.write(0xFF);
            for k in chd { w.write(k); }
        }
    }

    fn load_chord(reader: &mut Reader) -> [u8; 6] {
        // padding
        let _ = reader.read();
        arr![reader.read(); 6]
    }

    pub fn from_reader(reader: &mut Reader, number: u8) -> M8Result<Self> {
        let name = reader.read_string(12);
        let transp_eq = reader.read().into();
        let table_tick = reader.read();
        let volume = reader.read();
        let pitch = reader.read();
        let fine_tune = reader.read();

        let default_chord = arr![reader.read(); 7];
        let scale = reader.read();
        let shift = reader.read();
        let swarm = reader.read();
        let width = reader.read();
        let subosc = reader.read();
        let synth_params =
            SynthParams::from_reader3(reader, volume, pitch, fine_tune, HyperSynth::MOD_OFFSET)?;

        let chords =
            arr![HyperSynth::load_chord(reader); 0x10];

        Ok(HyperSynth {
            number,
            name,
            transp_eq,
            table_tick,
            synth_params,

            scale,
            default_chord,
            shift,
            swarm,
            width,
            subosc,
            chords
        })
    }
}
