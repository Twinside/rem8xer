use crate::reader::*;
use crate::version::*;
use crate::CommandPack;

#[derive(Copy, Clone)]
pub struct FxCommands {
    pub seq_commands: &'static[&'static str],
    pub mixer_commands: &'static[&'static str]
}

impl FxCommands {
    pub fn try_render(self, cmd: u8) -> Option<&'static str> {
        let seq_count = self.seq_commands.len();
        let cmd = cmd as usize;

        if cmd < seq_count {
            Some(self.seq_commands[cmd as usize])
        } else if cmd - seq_count < self.mixer_commands.len() {
            Some(self.mixer_commands[cmd - seq_count])
        } else {
            None
        }
    }
}

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

    pub fn print(&self, fx: FxCommands, pack: CommandPack) -> String {
        if self.is_empty() {
            format!("---  ")
        } else {
            let c = self.format_command(fx, pack);
            format!("{}{:02x}", c, self.value)
        }
    }

    pub fn fx_command_names(ver: Version) -> FxCommands {
        if ver.at_least(3, 0) {
            FxCommands {
                seq_commands: &SEQ_COMMAND_V3,
                mixer_commands: &FX_MIXER_COMMAND_V3
            }
        } else {
            FxCommands {
                seq_commands: &SEQ_COMMAND_V2,
                mixer_commands: &FX_MIXER_COMMAND_V2
            }
        }
    }

    fn format_command(&self, fx: FxCommands, instr: CommandPack) -> String {
        match fx.try_render(self.command) {
            Some(s) => String::from(s),
            None => {
                match instr.try_render(self.command) {
                    Some(v) => String::from(v),
                    None if self.command <= 0xA2 => format!("I{:02X}", self.command - 0x80),
                    None => format!(" {:02x} ", self.command),
                }
            }
        }
    }
}
