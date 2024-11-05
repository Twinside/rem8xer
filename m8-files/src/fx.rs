use crate::reader::*;
use crate::version::*;

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct FX {
    pub command: u8,
    pub value: u8,
}

impl Default for FX {
    fn default() -> Self {
        Self { command: 0xFF, value: 0 }
    }
}

const SEQ_COMMAND_V2 : [&'static str; 23] =
    [
        "ARP",
        "CHA",
        "DEL",
        "GRV",
        "HOP",
        "KIL",
        "RAN",
        "RET",
        "REP",
        "NTH",
        "PSL",
        "PSN",
        "PVB",
        "PVX",
        "SCA",
        "SCG",
        "SED",
        "SNG",
        "TBL",
        "THO",
        "TIC",
        "TPO",
        "TSP",
    ];

const FX_MIXER_COMMAND_V2 : [&'static str; 36] = 
    [
        "VMV",
        "XCM",
        "XCF",
        "XCW",
        "XCR",
        "XDT",
        "XDF",
        "XDW",
        "XDR",
        "XRS",
        "XRD",
        "XRM",
        "XRF",
        "XRW",
        "XRZ",
        "VCH",
        "VCD",
        "VRE",
        "VT1",
        "VT2",
        "VT3",
        "VT4",
        "VT5",
        "VT6",
        "VT7",
        "VT8",
        "DJF",
        "IVO",
        "ICH",
        "IDE",
        "IRE",
        "IV2",
        "IC2",
        "ID2",
        "IR2",
        "USB",
    ];

const SEQ_COMMAND_V3 : [&'static str; 27] =
    [
        "ARP",
        "CHA",
        "DEL",
        "GRV",
        "HOP",
        "KIL",
        "RND",
        "RNL",
        "RET",
        "REP",
        "RMX",
        "NTH",
        "PSL",
        "PBN",
        "PVB",
        "PVX",
        "SCA",
        "SCG",
        "SED",
        "SNG",
        "TBL",
        "THO",
        "TIC",
        "TBX",
        "TPO",
        "TSP",
        "OFF",
    ];

const FX_MIXER_COMMAND_V3 : [&'static str; 36] =
    [
        "VMV",
        "XCM",
        "XCF",
        "XCW",
        "XCR",
        "XDT",
        "XDF",
        "XDW",
        "XDR",
        "XRS",
        "XRD",
        "XRM",
        "XRF",
        "XRW",
        "XRZ",
        "VCH",
        "VCD",
        "VRE",
        "VT1",
        "VT2",
        "VT3",
        "VT4",
        "VT5",
        "VT6",
        "VT7",
        "VT8",
        "DJF",
        "IVO",
        "ICH",
        "IDE",
        "IRE",
        "IV2",
        "IC2",
        "ID2",
        "IR2",
        "USB",
    ];

impl FX {
    pub(crate) fn from_reader(reader: &mut Reader) -> M8Result<Self> {
        Ok(Self {
            command: reader.read(),
            value: reader.read(),
        })
    }

    pub fn write(self, w: &mut Writer) {
        w.write(self.command);
        w.write(self.value);
    }

    pub fn is_empty(self) -> bool {
        self.command == 0xFF
    }

    pub fn print(&self, version: Version) -> String {
        if self.is_empty() {
            format!("---00")
        } else {
            let c = if version.at_least(3, 0) {
                self.format_command3()
            } else {
                self.format_command2()
            };
            format!("{}{:02x}", c, self.value)
        }
    }

    fn format_command2(&self) -> String {
        match self.command {
            c if c <= 0x16 => String::from(SEQ_COMMAND_V2[c as usize]),
            c if c <= 0x3A => String::from(FX_MIXER_COMMAND_V2[c as usize]),
            c if 0x80 <= c && c <= 0xA2 => format!("I{:02X}", c - 0x80),
            // Unknown
            x => format!("{:02x} ", x),
        }
    }

    fn format_command3(&self) -> String {
        match self.command {
            c if c <= 0x1A => String::from(SEQ_COMMAND_V3[c as usize]),
            c if c <= 0x3E => String::from(FX_MIXER_COMMAND_V3[c as usize]),
            c if 0x80 <= c && c <= 0xA7 => format!("I{:02x}", c),
            // Unknown
            x => format!("{:02x} ", x),
        }
    }
}
