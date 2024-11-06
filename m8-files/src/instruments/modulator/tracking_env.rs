use crate::Version;

use super::{M8Result, Reader, Writer};


const TRACKING_ENV_COMMAND_NAMES : [&'static str; 0] =
    [
    ];

#[derive(PartialEq, Debug, Clone)]
pub struct TrackingEnv {
    pub dest: u8,
    pub amount: u8,
    pub src: u8,
    pub lval: u8,
    pub hval: u8,
}

impl TrackingEnv {
    pub fn command_name(_ver: Version) -> &'static[&'static str] {
        &TRACKING_ENV_COMMAND_NAMES
    }

    pub fn write(&self, writer: &mut Writer) {
        writer.write(self.amount);
        writer.write(self.src);
        writer.write(self.lval);
        writer.write(self.hval);
    }

    pub fn from_reader(reader: &mut Reader, dest: u8) -> M8Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            src: reader.read(),
            lval: reader.read(),
            hval: reader.read(),
        })
    }
}