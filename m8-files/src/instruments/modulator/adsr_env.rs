use crate::Version;

use super::{M8Result, Reader, Writer};


#[derive(PartialEq, Debug, Clone)]
pub struct ADSREnv {
    pub dest: u8,
    pub amount: u8,
    pub attack: u8,
    pub decay: u8,
    pub sustain: u8,
    pub release: u8,
}

const ADSRENV_COMMAND_NAMES : [&'static str; 0] =
    [];

impl ADSREnv {
    pub fn command_name(_ver: Version) -> &'static[&'static str] {
        &ADSRENV_COMMAND_NAMES 
    }

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
