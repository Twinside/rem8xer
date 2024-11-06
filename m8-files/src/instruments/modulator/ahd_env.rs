use crate::Version;

use super::{M8Result, Mod, Reader, Writer};


#[derive(PartialEq, Debug, Clone, Default)]
pub struct AHDEnv {
    pub dest: u8,
    pub amount: u8,
    pub attack: u8,
    pub hold: u8,
    pub decay: u8,
}

const AHDENV_COMMAND_NAMES : [&'static str; 0] =
    [
    ];

impl AHDEnv {
    pub fn command_names(_ver: Version) -> &'static[&'static str] {
        &AHDENV_COMMAND_NAMES 
    }

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
