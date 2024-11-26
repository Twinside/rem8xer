use num_enum::{IntoPrimitive, TryFromPrimitive};
use num_complex::Complex;

use crate::{reader::*, ParameterGatherer, Version};

#[repr(u8)]
#[derive(IntoPrimitive, TryFromPrimitive)]
#[derive(PartialEq, Copy, Clone, Default, Debug)]
pub enum EqType {
    #[default]
    LowCut,
    LowShelf,
    Bell,
    BandPass,
    HiShelf,
    HiCut
}

const EQ_TYPE_STR : [&'static str; 6] =
    [
        "LOWCUT",
        "LOWSHELF",
        "BELL",
        "BANDPASS",
        "HI.SHELF",
        "HI.CUT"
    ];

const EQ_MODE_STR : [&'static str; 6] =
    [
        "STEREO",
        "LEFT",
        "MID",
        "RIGHT",
        "SIDE",
        "LEFT"
    ];

#[derive(PartialEq, Eq, Clone, Debug, Copy, Default)]
pub struct EqModeType(pub u8);

impl EqModeType {
    pub fn eq_mode_hex(&self) -> u8 {
        (self.0 >> 4)& 0x7
    }

    pub fn eq_mode(&self) -> EqType {
        EqType::try_from(self.eq_mode_hex())
            .unwrap_or(EqType::Bell)
    }

    pub fn eq_type(&self) -> u8 { self.0 & 0x7 }

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

    pub freq_fin  : u8,
    pub freq      : u8,

    pub level_fin : u8,
    pub level     : u8,

    pub q         : u8
}

impl EqBand {
    pub fn is_empty(&self) -> bool {
        self.level == 0 && self.level_fin == 0
    }

    /// Accumulate band in bode plote
    /// 
    /// See https://www.w3.org/TR/audio-eq-cookbook/
    pub fn accumulate(&self, freqs: &[f64], gains: &mut[f64]) {
        let cut_off = self.frequency();
        let q = self.q as f64;

        match self.mode.eq_mode() {
            EqType::LowCut => {
                let gain = self.gain();

                for (i, freq) in freqs.iter().enumerate() {
                    // normalized frequency
                    let s = Complex::new(0.0, freq / (cut_off as f64));
                    gains[i] += (1.0 / (s * s + s / q + 1.0)).norm() + gain
                }
            }
            EqType::LowShelf => {
                let a = 10.0_f64.powf(self.gain() / 40.0);

                for (i, freq) in freqs.iter().enumerate() {
                    // normalized frequency
                    let s = Complex::new(0.0, freq / (cut_off as f64));

                    let ss = s * s;
                    let sqra = a.sqrt() / q * s;
                    gains[i] += (a * (ss + sqra + a) / (a * ss + sqra + 1.0)).norm()
                }
            },
            EqType::Bell => {
                let a = 10.0_f64.powf(self.gain() / 40.0);

                for (i, freq) in freqs.iter().enumerate() {
                    // normalized frequency
                    let s = Complex::new(0.0, freq / (cut_off as f64));

                    let ss = s * s;
                    gains[i] += ( (ss + s * a / q + 1.0) /
                                  (ss + s / (a * q) + 1.0)).norm()
                }
            },
            EqType::BandPass => {
                for (i, freq) in freqs.iter().enumerate() {
                    // normalized frequency
                    let s = Complex::new(0.0, freq / (cut_off as f64));
                    let ss = s * s;
                    gains[i] += ( (s) / (ss + s / q + 1.0)).norm()
                }
            },
            EqType::HiShelf => {
                let a = 10.0_f64.powf(self.gain() / 40.0);

                for (i, freq) in freqs.iter().enumerate() {
                    // normalized frequency
                    let s = Complex::new(0.0, freq / (cut_off as f64));

                    let ss = s * s;
                    let sqra = a.sqrt() / q * s;
                    gains[i] += (a * (a * ss + sqra + 1.0) / (ss + sqra + a)).norm()
                }
            },
            EqType::HiCut => {
                let gain = self.gain();

                for (i, freq) in freqs.iter().enumerate() {
                    // normalized frequency
                    let s = Complex::new(0.0, freq / (cut_off as f64));
                    gains[i] += ((s * s) / (s * s + s / q + 1.0)).norm() + gain
                }
            }
        }
    }

    pub fn gain(&self) -> f64 {
        let int_gain = ((self.level as i16) << 8) | (self.level_fin as i16);
        (int_gain as f64) / 100.0
    }

    pub fn frequency(&self) -> usize {
        ((self.freq as usize) << 8) | self.freq_fin as usize
    }

    pub fn describe<PG : ParameterGatherer>(&self, pg: &mut PG, _ver: Version) {
        pg.float("GAIN", self.gain());
        pg.float("FREQ", self.frequency() as f64);
        pg.hex("Q", self.q);
        pg.enumeration("TYPE", self.mode.eq_type(), self.mode.type_str());
        pg.enumeration("MODE", self.mode.eq_mode_hex(), self.mode.mode_str());
    }

    pub fn write(&self, w: &mut Writer) {
        w.write(self.mode.0);
        w.write(self.freq_fin);
        w.write(self.freq);
        w.write(self.level_fin);
        w.write(self.level);
        w.write(self.q);
    }

    pub fn from_reader(reader: &mut Reader) -> EqBand {
        let mode = EqModeType(reader.read());
        let freq_fin = reader.read();
        let freq = reader.read();
        let level_fin = reader.read();
        let level = reader.read();
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
    pub fn accumulate(&self, freqs: &[f64], gains: &mut[f64]) {
        self.low.accumulate(freqs, gains);
        self.mid.accumulate(freqs, gains);
        self.high.accumulate(freqs, gains);
    }

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
