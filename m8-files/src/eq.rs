use crate::reader::*;

#[derive(PartialEq, Eq, Clone, Debug, Copy, Default)]
pub struct EqModeType(pub u8);

#[derive(PartialEq, Clone, Debug, Default)]
pub struct EqBand {
    pub mode      : EqModeType,
    pub freq      : u8,
    pub freq_fin  : u8,

    pub level     : u8,
    pub level_fin : u8,

    pub q         : u8
}

impl EqBand {
    pub fn write(&self, w: &mut Writer) {
        w.write(self.mode.0);
        w.write(self.freq);
        w.write(self.freq_fin);
        w.write(self.level);
        w.write(self.level_fin);
        w.write(self.q);
    }

    pub fn from_reader(reader: &mut Reader) -> EqBand {
        let mode = EqModeType(reader.read());
        let freq = reader.read();
        let freq_fin = reader.read();
        let level = reader.read();
        let level_fin = reader.read();
        let q = reader.read();

        Self { level, level_fin, freq, freq_fin, mode, q }
    }
}

#[derive(PartialEq, Clone, Debug, Default)]
pub struct Equ {
    pub low : EqBand,
    pub mid : EqBand,
    pub high : EqBand
}

impl Equ {
    pub fn write(&self, w: &mut Writer) {
        self.low.write(w);
        self.mid.write(w);
        self.high.write(w);
    }

    pub fn from_reader(reader: &mut Reader) -> Equ {
        let low = EqBand::from_reader(reader);
        let mid = EqBand::from_reader(reader);
        let high = EqBand::from_reader(reader);
        Self { low, mid, high }
    }
}

pub const CHORUS_EQ_IDX : usize = 33;
pub const DELAY_EQ_IDX : usize = 34;
pub const REVERB_EQ_IDX : usize = 35;
