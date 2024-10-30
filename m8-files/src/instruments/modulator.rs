use crate::reader::*;
use num_enum::IntoPrimitive;
use num_enum::TryFromPrimitive;


////////////////////////////////////////////////////////////////////////////////////
/// MARK: Modulators
////////////////////////////////////////////////////////////////////////////////////
#[derive(PartialEq, Debug, Clone)]
pub enum Mod {
    AHDEnv(AHDEnv),
    ADSREnv(ADSREnv),
    DrumEnv(DrumEnv),
    LFO(LFO),
    TrigEnv(TrigEnv),
    TrackingEnv(TrackingEnv),
}

impl Mod {
    const SIZE: usize = 6;

    pub fn from_reader(reader: &mut Reader) -> M8Result<Self> {
        let start_pos = reader.pos();
        let first_byte = reader.read();
        let ty = first_byte >> 4;
        let dest = first_byte & 0x0F;

        // dbg!(ty, dest, start_pos);
        let r = match ty {
            0 => Mod::AHDEnv(AHDEnv::from_reader3(reader, dest)?),
            1 => Mod::ADSREnv(ADSREnv::from_reader(reader, dest)?),
            2 => Mod::DrumEnv(DrumEnv::from_reader(reader, dest)?),
            3 => Mod::LFO(LFO::from_reader3(reader, dest)?),
            4 => Mod::TrigEnv(TrigEnv::from_reader(reader, dest)?),
            5 => Mod::TrackingEnv(TrackingEnv::from_reader(reader, dest)?),
            x =>
                return Err(ParseError(format!("Unknown mod type {}", x))),
        };

        reader.set_pos(start_pos + Self::SIZE);
        Ok(r)
    }

    pub fn write(&self, w: &mut Writer) {
        let start = w.pos();

        match self {
            Mod::AHDEnv(env) =>{
                w.write(env.dest);
                env.write(w);
            }
            Mod::ADSREnv(env) => {
                w.write(1 << 4 | env.dest);
                env.write(w);
            }
            Mod::DrumEnv(env) => {
                w.write(2 << 4 | env.dest);
                env.write(w);
            }
            Mod::LFO(lfo) => {
                w.write(3 << 4 | lfo.dest);
                lfo.write(w);
            }
            Mod::TrigEnv(env) => {
                w.write(4 << 4 | env.dest);
                env.write(w);
            }
            Mod::TrackingEnv(env) => {
                w.write(5 << 4 | env.dest);
                env.write(w);
            }
        }

        w.seek(start + Self::SIZE);
    }
}

/// MARK: AHDEnv
#[derive(PartialEq, Debug, Clone, Default)]
pub struct AHDEnv {
    pub dest: u8,
    pub amount: u8,
    pub attack: u8,
    pub hold: u8,
    pub decay: u8,
}

impl AHDEnv {
    pub fn from_reader2(reader: &mut Reader) -> M8Result<Self> {
        let r = Self {
            dest: reader.read(),
            amount: reader.read(),
            attack: reader.read(),
            hold: reader.read(),
            decay: reader.read(),
        };
        reader.read();
        Ok(r)
    }

    pub fn from_reader3(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            attack: reader.read(),
            hold: reader.read(),
            decay: reader.read(),
        })
    }

    pub fn write(&self, w: &mut Writer) {
        w.write(self.amount);
        w.write(self.attack);
        w.write(self.hold);
        w.write(self.decay);
    }

    pub fn to_mod(self) -> Mod {
        Mod::AHDEnv(self)
    }
}

/// MARK: LFO
#[repr(u8)]
#[allow(non_camel_case_types)]
#[derive(IntoPrimitive, TryFromPrimitive)]
#[derive(PartialEq, Copy, Clone, Default, Debug)]
pub enum LfoShape {
  #[default]
  TRI,
  SIN,
  RAMP_DOWN,
  RAMP_UP,
  EXP_DN,
  EXP_UP,
  SQR_DN,
  SQR_UP,
  RANDOM,
  DRUNK,
  TRI_T,
  SIN_T,
  RAMPD_T,
  RAMPU_T,
  EXPD_T,
  EXPU_T,
  SQ_D_T,
  SQ_U_T,
  RAND_T,
  DRNK_T
}

#[repr(u8)]
#[allow(non_camel_case_types)]
#[derive(IntoPrimitive, TryFromPrimitive)]
#[derive(PartialEq, Copy, Clone, Default, Debug)]
pub enum LfoTriggerMode {
  #[default]
  FREE,
  RETRIG,
  HOLD,
  ONCE
}

#[derive(PartialEq, Debug, Clone)]
pub struct LFO {
    pub shape: LfoShape,
    pub dest: u8,
    pub trigger_mode: LfoTriggerMode,
    pub freq: u8,
    pub amount: u8,
    pub retrigger: u8
}

impl LFO {
    pub fn from_reader2(reader: &mut Reader) -> M8Result<Self> {
        let shape = reader.read();
        let dest = reader.read();
        let trigger = reader.read();
        let r = Self {
            shape: shape
                .try_into()
                .map_err(|_| ParseError(format!("Invalid LFO shape {}", shape)))?,
            dest,
            trigger_mode: trigger
                .try_into()
                .map_err(|_| ParseError(format!("Invalid lfo trigger mode {}", trigger)))?,
            freq: reader.read(),
            amount: reader.read(),
            retrigger: reader.read()
        };

        Ok(r)
    }

    pub fn write(&self, w: &mut Writer) {
        w.write(self.amount);
        w.write(self.shape.into());
        w.write(self.trigger_mode.into());
        w.write(self.freq);
        w.write(self.retrigger);
    }

    pub fn from_reader3(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        let amount = reader.read();
        let shape = reader.read();
        let trigger_mode = reader.read();
        let freq = reader.read();
        let retrigger = reader.read();

        Ok(Self {
            dest,
            amount,
            shape: shape
                .try_into()
                .map_err(|_| ParseError(format!("Invalid LFO shape {}", shape)))?,
            trigger_mode: trigger_mode
                .try_into()
                .map_err(|_| ParseError(format!("Invalid lfo trigger mode {}", trigger_mode)))?,
            freq,
            retrigger
        })
    }

    pub fn to_mod(self) -> Mod { Mod::LFO(self) }
}

/// MARK: ADSREnv
#[derive(PartialEq, Debug, Clone)]
pub struct ADSREnv {
    pub dest: u8,
    pub amount: u8,
    pub attack: u8,
    pub decay: u8,
    pub sustain: u8,
    pub release: u8,
}

impl ADSREnv {
    pub fn write(&self, w: &mut Writer) {
        w.write(self.amount);
        w.write(self.attack);
        w.write(self.decay);
        w.write(self.sustain);
        w.write(self.release);
    }

    pub fn from_reader(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            attack: reader.read(),
            decay: reader.read(),
            sustain: reader.read(),
            release: reader.read(),
        })
    }
}

/// MARK: DrumEnv
#[derive(PartialEq, Debug, Clone)]
pub struct DrumEnv {
    pub dest: u8,
    pub amount: u8,
    pub peak: u8,
    pub body: u8,
    pub decay: u8,
}

impl DrumEnv {
    pub fn write(&self, w: &mut Writer) {
        w.write(self.amount);
        w.write(self.peak);
        w.write(self.body);
        w.write(self.decay);
    }

    pub fn from_reader(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            peak: reader.read(),
            body: reader.read(),
            decay: reader.read(),
        })
    }
}

/// MARK: TrigEnv
#[derive(PartialEq, Debug, Clone)]
pub struct TrigEnv {
    pub dest: u8,
    pub amount: u8,
    pub attack: u8,
    pub hold: u8,
    pub decay: u8,
    pub src: u8,
}

impl TrigEnv {
    pub fn write(&self, w: &mut Writer) {
        w.write(self.amount);
        w.write(self.attack);
        w.write(self.hold);
        w.write(self.decay);
        w.write(self.src);
    }

    pub fn from_reader(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            attack: reader.read(),
            hold: reader.read(),
            decay: reader.read(),
            src: reader.read(),
        })
    }
}

/// MARK: TrackingEnv
#[derive(PartialEq, Debug, Clone)]
pub struct TrackingEnv {
    pub dest: u8,
    pub amount: u8,
    pub src: u8,
    pub lval: u8,
    pub hval: u8,
}

impl TrackingEnv {
    pub fn write(&self, writer: &mut Writer) {
        writer.write(self.amount);
        writer.write(self.src);
        writer.write(self.lval);
        writer.write(self.hval);
    }

    fn from_reader(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            src: reader.read(),
            lval: reader.read(),
            hval: reader.read(),
        })
    }
}
