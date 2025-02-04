use crate::reader::*;
use crate::instruments::modulator::ahd_env::AHDEnv;
use crate::instruments::modulator::lfo::LFO;

use arr_macro::arr;

use super::modulator::Mod;
use super::{dests, params, ParameterGatherer};

/// Type storing transpose field and eq number
#[derive(PartialEq, Copy, Clone, Default, Debug)]
pub struct TranspEq {
    pub transpose : bool,
    pub eq : u8
}

impl TranspEq {
    pub fn set_eq(&mut self, eq_ix : u8) {
        self.eq = eq_ix;
    }
}
impl From<TranspEq> for u8 {
    fn from(value: TranspEq) -> Self {
        (if value.transpose { 1 } else { 0 }) |
        (value.eq << 1)
    }
}

impl From<u8> for TranspEq {
    fn from(value: u8) -> Self {
        Self {
            transpose: (value & 1) != 0,
            eq: value >> 1
        }
    }
}

const LIMIT_TYPE : [&str; 8] =
    [
       "CLIP",
       "SIN",
       "FOLD",
       "WRAP",
       "POST",
       "POSTAD",
       "POST:W1",
       "POST:W2"
    ];

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct LimitType(u8);

impl TryFrom<u8> for LimitType{
    type Error = ParseError;

    fn try_from(value: u8) -> std::result::Result<Self, Self::Error> {
        if (value as usize) < LIMIT_TYPE.len() {
            Ok(LimitType(value))
        } else {
            Err(ParseError(format!("Invalid fm wave {}", value)))
        }
    }
}

impl LimitType {
    pub fn id(self) -> u8 {
        let LimitType(v) = self;
        v
    }

    pub fn str(self) -> &'static str {
        LIMIT_TYPE[self.id() as usize]
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct SynthParams {
    pub volume: u8,
    pub pitch: u8,
    pub fine_tune: u8,

    pub filter_type: u8,
    pub filter_cutoff: u8,
    pub filter_res: u8,

    pub amp: u8,
    pub limit: LimitType,

    pub mixer_pan: u8,
    pub mixer_dry: u8,
    pub mixer_chorus: u8,
    pub mixer_delay: u8,
    pub mixer_reverb: u8,

    pub mods: [Mod; SynthParams::MODULATOR_COUNT],
}

pub const COMMON_FILTER_TYPES : [&'static str; 8] =
    [
        "OFF",
        "LOWPASS",
        "HIGHPAS",
        "BANDPAS",
        "BANDSTP",
        "LP > HP",
        "ZDF LP",
        "ZDF HP",
    ];

impl SynthParams {
    pub const MODULATOR_COUNT : usize = 4;

    pub fn describe_modulators<PG : ParameterGatherer>(&self, pg: &mut PG, dests: &'static[&'static str]) {
        self.mods[0].describe(&mut pg.nest("MOD1"), 0, dests);
        self.mods[1].describe(&mut pg.nest("MOD2"), 1, dests);
        self.mods[2].describe(&mut pg.nest("MOD3"), 2, dests);
        self.mods[3].describe(&mut pg.nest("MOD4"), 3, dests);
    }

    pub fn describe_succint<PG : ParameterGatherer>(&self, pg: &mut PG) {
        pg.hex(dests::AMP, self.amp);
        pg.enumeration("LIM", self.limit.0, self.limit.str());
        pg.hex(dests::PAN, self.mixer_pan);
        pg.hex("DRY", self.mixer_dry);
        pg.hex("CHORUS", self.mixer_chorus);
        pg.hex("DELAY", self.mixer_delay);
        pg.hex("REVERB", self.mixer_reverb);
    }

    pub fn describe<PG : ParameterGatherer>(&self, pg: &mut PG, filters: &[&str]) {
        pg.hex("FINE", self.fine_tune);

        match filters.get(self.filter_type as usize) {
            None =>
                pg.enumeration("FILTER", self.filter_type, &format!("{:02X}", self.filter_type)),
            Some(str) => 
                pg.enumeration("FILTER", self.filter_type, str)
        };

        pg.hex("CUT", self.filter_cutoff);
        pg.hex("RES", self.filter_res);
        self.describe_succint(pg);
    }

    pub fn mod_only2(_reader: &mut Reader) -> M8Result<Self>{
        Ok(Self {
            volume: 0,
            pitch: 0,
            fine_tune: 0,

            filter_type: 0,
            filter_cutoff: 0,
            filter_res: 0,

            amp: 0,
            limit: LimitType::try_from(0)?,

            mixer_pan: 0,
            mixer_dry: 0,
            mixer_chorus: 0,
            mixer_delay: 0,
            mixer_reverb: 0,

            mods: arr![AHDEnv::default().to_mod(); 4]
        })
    }

    pub fn mod_only3(reader: &mut Reader, mod_offset: usize) -> M8Result<Self> {
        reader.set_pos(reader.pos() + mod_offset);

        let mods = arr![Mod::from_reader(reader)?; 4];

        Ok(Self {
            volume: 0,
            pitch: 0,
            fine_tune: 0,

            filter_type: 0,
            filter_cutoff: 0,
            filter_res: 0,

            amp: 0,
            limit: LimitType::try_from(0)?,

            mixer_pan: 0,
            mixer_dry: 0,
            mixer_chorus: 0,
            mixer_delay: 0,
            mixer_reverb: 0,

            mods
        })
    }

    pub fn from_reader2(reader: &mut Reader, volume: u8, pitch: u8, fine_tune: u8) -> M8Result<Self> {
        Ok(Self {
            volume,
            pitch,
            fine_tune,

            filter_type: reader.read(),
            filter_cutoff: reader.read(),
            filter_res: reader.read(),

            amp: reader.read(),
            limit: LimitType::try_from(reader.read())?,

            mixer_pan: reader.read(),
            mixer_dry: reader.read(),
            mixer_chorus: reader.read(),
            mixer_delay: reader.read(),
            mixer_reverb: reader.read(),

            mods: [
                AHDEnv::from_reader2(reader)?.to_mod(),
                AHDEnv::from_reader2(reader)?.to_mod(),
                LFO::from_reader2(reader)?.to_mod(),
                LFO::from_reader2(reader)?.to_mod(),
            ],
        })
    }

    pub fn write(&self, w: &mut Writer, mod_offset: usize) {
        w.write(self.filter_type);
        w.write(self.filter_cutoff);
        w.write(self.filter_res);

        w.write(self.amp);
        w.write(self.limit.0);

        w.write(self.mixer_pan);
        w.write(self.mixer_dry);
        w.write(self.mixer_chorus);
        w.write(self.mixer_delay);
        w.write(self.mixer_reverb);

        self.write_modes(w, mod_offset);
    }

    pub fn write_modes(&self, w: &mut Writer, mod_offset: usize) {
        w.seek(w.pos() +  mod_offset);
        for m in &self.mods { m.write(w); }
    }

    pub fn from_reader3(
        reader: &mut Reader,
        volume: u8,
        pitch: u8,
        fine_tune: u8,
        mod_offset: usize,
    ) -> M8Result<Self> {
        let filter_type = reader.read();
        let filter_cutoff = reader.read();
        let filter_res = reader.read();

        let amp = reader.read();
        let limit = reader.read();

        let mixer_pan = reader.read();
        let mixer_dry = reader.read();
        let mixer_chorus = reader.read();
        let mixer_delay = reader.read();
        let mixer_reverb = reader.read();

        reader.set_pos(reader.pos() + mod_offset);

        let mods = arr![Mod::from_reader(reader)?; 4];

        Ok(Self {
            volume,
            pitch,
            fine_tune,

            filter_type,
            filter_cutoff,
            filter_res,

            amp,
            limit: LimitType::try_from(limit)?,

            mixer_pan,
            mixer_dry,
            mixer_chorus,
            mixer_delay,
            mixer_reverb,

            mods,
        })
    }
}
