use crate::Version;

use super::{M8Result, Reader, Writer};


const DRUMENV_COMMAND_NAMES : [&'static str; 0] =
    [
    ];


#[derive(PartialEq, Debug, Clone)]
pub struct DrumEnv {
    pub dest: u8,
    pub amount: u8,
    pub peak: u8,
    pub body: u8,
    pub decay: u8,
}

impl DrumEnv {
    pub fn command_names(_ver: Version) -> &'static[&'static str] {
        &DRUMENV_COMMAND_NAMES
    }

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
