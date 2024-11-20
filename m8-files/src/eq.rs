use crate::{reader::*, ParameterGatherer, Version};

const EQ_TYPE_STR : [&'static str; 6] =
    [
        "LOWCUT",
        "LOWSHELF",
        "BELL",
        "BANDPASS",
        "HI.SHELF",
        "HI.CUT"
    ];

const EQ_MODE_STR : [&'static str; 5] =
    [
        "STEREO",
        "MID",
        "SIDE",
        "LEFT",
        "RIGHT"
    ];

#[derive(PartialEq, Eq, Clone, Debug, Copy, Default)]
pub struct EqModeType(pub u8);

impl EqModeType {
    pub fn eq_mode(&self) -> u8 { self.0 & 0xF }
    pub fn eq_type(&self) -> u8 { (self.0 >> 4) & 0xF }

    pub fn mode_str(&self) -> &'static str {
        let index = self.eq_mode() as usize;
        EQ_MODE_STR.get(index).unwrap_or(&"")
    }

    pub fn type_str(&self) -> &'static str {
        let index = self.eq_type() as usize;
        EQ_TYPE_STR.get(index).unwrap_or(&"")
    }
}

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
    pub fn is_empty(&self) -> bool {
        self.level == 0 && self.level_fin == 0
    }

    pub fn describe<PG : ParameterGatherer>(&self, pg: &mut PG, _ver: Version) {
        let gain = self.level as f64 + self.level_fin as f64 / 100.0;
        pg.float("GAIN", gain);
        let freq = ((self.freq as usize) << 8) + self.freq_fin as usize;
        pg.float("FREQ", freq as f64);
        pg.hex("Q", self.q);
        pg.enumeration("TYPE", self.mode.eq_type(), self.mode.type_str());
        pg.enumeration("MODE", self.mode.eq_mode(), self.mode.mode_str());
    }

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
    pub fn describe<PG : ParameterGatherer>(&self, pg: &mut PG, ver: Version) {
        self.low.describe(&mut pg.nest("LOW"), ver);
        self.mid.describe(&mut pg.nest("MID"), ver);
        self.high.describe(&mut pg.nest("HIGH"), ver);
    }

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
