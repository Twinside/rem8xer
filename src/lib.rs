//! This library lets you parse Dirtywave M8 data
//!
//! See, in particular, the `read` method available on:
//! - [`Song::read`]
//! - [`Instrument::read`]
//! - [`Scale::read`]
//! - [`Theme::read`]
//!
//! E.g.:
//! ```
//! use m8_files::*;
//!
//! let mut f = std::fs::File::open("./examples/songs/TEST-FILE.m8s").unwrap();
//! let song = Song::read(&mut f).unwrap();
//! dbg!(song);
//! ```
//!

use std::cell::RefCell;
use std::fmt;
use std::rc::Rc;

use arr_macro::arr;
use byteorder::{ByteOrder, LittleEndian};

#[derive(PartialEq, Debug)]
pub struct ParseError(String);

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ParseError: {}", &self.0)
    }
}

impl std::error::Error for ParseError {}

type Result<T> = std::result::Result<T, ParseError>;

struct Reader {
    buffer: Vec<u8>,
    position: Rc<RefCell<usize>>,
}

#[allow(dead_code)]
impl Reader {
    fn new(buffer: Vec<u8>) -> Self {
        Self {
            buffer,
            position: Rc::new(RefCell::new(0)),
        }
    }

    fn read(&self) -> u8 {
        let p: usize = *self.position.borrow();
        let b = self.buffer[p];
        *self.position.borrow_mut() += 1;
        b
    }

    fn read_bytes(&self, n: usize) -> &[u8] {
        let p: usize = *self.position.borrow();
        let bs = &self.buffer[p..p + n];
        *self.position.borrow_mut() += n;
        bs
    }

    fn read_bool(&self) -> bool {
        self.read() == 1
    }

    fn read_string(&self, n: usize) -> String {
        let b = self.read_bytes(n);
        let end = b.iter().position(|&x| x == 0 || x == 255).unwrap_or(0);
        std::str::from_utf8(&b[0..end])
            .expect("invalid utf-8 sequence in string")
            .to_string()
    }

    fn pos(&self) -> usize {
        *self.position.borrow()
    }

    fn set_pos(&self, n: usize) {
        *self.position.borrow_mut() = n;
    }
}

#[derive(PartialEq, Clone)]
pub struct Song {
    pub version: Version,
    pub directory: String,
    pub transpose: u8,
    pub tempo: f32,
    pub quantize: u8,
    pub name: String,
    pub key: u8,

    pub song: SongSteps,
    pub phrases: Vec<Phrase>,
    pub chains: Vec<Chain>,
    pub instruments: Vec<Instrument>,
    pub tables: Vec<Table>,
    pub grooves: Vec<Groove>,
    pub scales: Vec<Scale>,

    pub mixer_settings: MixerSettings,
    pub effects_settings: EffectsSettings,
    pub midi_settings: MidiSettings,
    pub midi_mappings: Vec<MidiMapping>,
}

impl fmt::Debug for Song {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Song")
            .field("version", &self.version)
            .field("directory", &self.directory)
            .field("name", &self.name)
            .field("tempo", &self.tempo)
            .field("transpose", &self.transpose)
            .field("quantize", &self.quantize)
            .field("key", &self.key)
            .field("song", &self.song)
            .field("chains", self.chains.get(0).unwrap_or(&Chain::default()))
            .field("phrases", self.phrases.get(0).unwrap_or(&Phrase::default()))
            .field(
                "instruments",
                self.instruments.get(0).unwrap_or(&Instrument::default()),
            )
            .field("tables", &self.tables[0])
            .field("grooves", &self.grooves[0])
            .field("scales", &self.scales[0])
            .field("mixer_settings", &self.mixer_settings)
            .field("effects_settings", &self.effects_settings)
            .field("midi_settings", &self.midi_settings)
            .finish()
    }
}

impl Song {
    const SIZE_PRIOR_TO_2_5: usize = 0x1A970;
    const SIZE: usize = 0x1AD09;
    const N_PHRASES: usize = 255;
    const N_CHAINS: usize = 255;
    const N_INSTRUMENTS: usize = 128;
    const N_TABLES: usize = 256;
    const N_GROOVES: usize = 32;
    const N_SCALES: usize = 16;
    const N_MIDI_MAPPINGS: usize = 128;

    pub fn read(reader: &mut impl std::io::Read) -> Result<Self> {
        let mut buf: Vec<u8> = vec![];
        reader.read_to_end(&mut buf).unwrap();
        let len = buf.len();
        let reader = Reader::new(buf);

        if len < Self::SIZE_PRIOR_TO_2_5 + Version::SIZE {
            return Err(ParseError(
                "File is not long enough to be a M8 song".to_string(),
            ));
        }
        let version = Version::from_reader(&reader)?;
        if version.at_least(2, 5) && len < Self::SIZE + Version::SIZE {
            return Err(ParseError(
                "File is not long enough to be a M8 song".to_string(),
            ));
        }

        if version.at_least(3, 0) {
            Self::from_reader3(&reader, version)
        } else {
            Self::from_reader2(&reader, version)
        }
    }

    fn from_reader2(reader: &Reader, version: Version) -> Result<Self> {
        let directory = reader.read_string(128);
        let transpose = reader.read();
        let tempo = LittleEndian::read_f32(reader.read_bytes(4));
        let quantize = reader.read();
        let name = reader.read_string(12);
        let midi_settings = MidiSettings::from_reader(reader)?;
        let key = reader.read();
        reader.read_bytes(18); // Skip
        let mixer_settings = MixerSettings::from_reader(reader)?;
        // println!("{:x}", reader.pos());

        let grooves = (0..Self::N_GROOVES)
            .map(|i| Groove::from_reader(reader, i as u8))
            .collect::<Result<Vec<Groove>>>()?;
        let song = SongSteps::from_reader(reader)?;
        let phrases = (0..Self::N_PHRASES)
            .map(|i| Phrase::from_reader(reader, i as u8, version))
            .collect::<Result<Vec<Phrase>>>()?;
        let chains = (0..Self::N_CHAINS)
            .map(|i| Chain::from_reader(reader, i as u8))
            .collect::<Result<Vec<Chain>>>()?;
        let tables = (0..Self::N_TABLES)
            .map(|i| Table::from_reader(reader, i as u8, version))
            .collect::<Result<Vec<Table>>>()?;
        let instruments = (0..Self::N_INSTRUMENTS)
            .map(|i| Instrument::from_reader2(reader, i as u8, version))
            .collect::<Result<Vec<Instrument>>>()?;

        reader.read_bytes(3); // Skip
        let effects_settings = EffectsSettings::from_reader(reader)?;
        reader.set_pos(0x1A5FE);
        let midi_mappings = (0..Self::N_MIDI_MAPPINGS)
            .map(|_| MidiMapping::from_reader(reader))
            .collect::<Result<Vec<MidiMapping>>>()?;

        let scales: Vec<Scale> = if version.at_least(2, 5) {
            reader.set_pos(0x1AA7E);
            (0..Self::N_SCALES)
                .map(|i| Scale::from_reader(reader, i as u8))
                .collect::<Result<Vec<Scale>>>()?
        } else {
            (0..Self::N_SCALES)
                .map(|i| -> Scale {
                    let mut s = Scale::default();
                    s.number = i as u8;
                    s
                })
                .collect()
        };

        Ok(Self {
            version,
            directory,
            transpose,
            tempo,
            quantize,
            name,
            midi_settings,
            key,
            mixer_settings,
            grooves,
            song,
            phrases,
            chains,
            tables,
            instruments,
            scales,
            effects_settings,
            midi_mappings,
        })
    }

    fn from_reader3(reader: &Reader, version: Version) -> Result<Self> {
        let directory = reader.read_string(128);
        let transpose = reader.read();
        let tempo = LittleEndian::read_f32(reader.read_bytes(4));
        let quantize = reader.read();
        let name = reader.read_string(12);
        let midi_settings = MidiSettings::from_reader(reader)?;
        let key = reader.read();
        reader.read_bytes(18); // Skip
        let mixer_settings = MixerSettings::from_reader(reader)?;
        // println!("{:x}", reader.pos());

        let grooves = (0..Self::N_GROOVES)
            .map(|i| Groove::from_reader(reader, i as u8))
            .collect::<Result<Vec<Groove>>>()?;
        let song = SongSteps::from_reader(reader)?;
        let phrases = (0..Self::N_PHRASES)
            .map(|i| Phrase::from_reader(reader, i as u8, version))
            .collect::<Result<Vec<Phrase>>>()?;
        let chains = (0..Self::N_CHAINS)
            .map(|i| Chain::from_reader(reader, i as u8))
            .collect::<Result<Vec<Chain>>>()?;
        let tables = (0..Self::N_TABLES)
            .map(|i| Table::from_reader(reader, i as u8, version))
            .collect::<Result<Vec<Table>>>()?;
        let instruments = (0..Self::N_INSTRUMENTS)
            .map(|i| Instrument::from_reader3(reader, i as u8, version))
            .collect::<Result<Vec<Instrument>>>()?;

        reader.read_bytes(3); // Skip
        let effects_settings = EffectsSettings::from_reader(reader)?;
        reader.set_pos(0x1A5FE);
        let midi_mappings = (0..Self::N_MIDI_MAPPINGS)
            .map(|_| MidiMapping::from_reader(reader))
            .collect::<Result<Vec<MidiMapping>>>()?;

        let scales: Vec<Scale> = if version.at_least(2, 5) {
            reader.set_pos(0x1AA7E);
            (0..Self::N_SCALES)
                .map(|i| Scale::from_reader(reader, i as u8))
                .collect::<Result<Vec<Scale>>>()?
        } else {
            (0..Self::N_SCALES)
                .map(|i| -> Scale {
                    let mut s = Scale::default();
                    s.number = i as u8;
                    s
                })
                .collect()
        };

        Ok(Self {
            version,
            directory,
            transpose,
            tempo,
            quantize,
            name,
            midi_settings,
            key,
            mixer_settings,
            grooves,
            song,
            phrases,
            chains,
            tables,
            instruments,
            scales,
            effects_settings,
            midi_mappings,
        })
    }
}

#[derive(PartialEq, Clone, Copy)]
pub struct Version {
    pub major: u8,
    pub minor: u8,
    pub patch: u8,
}

impl Default for Version {
    fn default() -> Self {
        Self {
            major: 3,
            minor: 0,
            patch: 0,
        }
    }
}

impl fmt::Display for Version {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}.{}.{}", self.major, self.minor, self.patch)
    }
}

impl fmt::Debug for Version {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

impl Version {
    const SIZE: usize = 14;

    fn from_reader(reader: &Reader) -> Result<Self> {
        let _version_string = reader.read_bytes(10);
        let lsb = reader.read();
        let msb = reader.read();
        let major = msb & 0x0F;
        let minor = (lsb >> 4) & 0x0F;
        let patch = lsb & 0x0F;

        reader.read_bytes(2); // Skip
        Ok(Self {
            major,
            minor,
            patch,
        })
    }

    fn at_least(&self, major: u8, minor: u8) -> bool {
        self.major > major || (self.major == major && self.minor >= minor)
    }
}

#[derive(PartialEq, Clone)]
pub struct SongSteps {
    pub steps: [u8; 2048],
}
impl SongSteps {
    pub fn print_screen(&self) -> String {
        self.print_screen_from(0)
    }

    pub fn print_screen_from(&self, start: u8) -> String {
        (start..start + 16).fold("   1  2  3  4  5  6  7  8  \n".to_string(), |s, row| {
            s + &self.print_row(row) + "\n"
        })
    }

    pub fn print_row(&self, row: u8) -> String {
        let start = row as usize * 8;
        (start..start + 8).fold(format!("{row:02x} "), |s, b| -> String {
            let v = self.steps[b];
            let repr = if v == 255 {
                format!("-- ")
            } else {
                format!("{:02x} ", v)
            };
            s + &repr
        })
    }

    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            steps: reader.read_bytes(2048).try_into().unwrap(),
        })
    }
}

impl fmt::Display for SongSteps {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "SONG\n\n{}", self.print_screen())
    }
}
impl fmt::Debug for SongSteps {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

#[derive(PartialEq, Clone, Default)]
pub struct Chain {
    pub number: u8,
    pub steps: [ChainStep; 16],
}
impl Chain {
    pub fn print_screen(&self) -> String {
        (0..16).fold("  PH TSP\n".to_string(), |s, row| {
            s + &self.steps[row].print(row as u8) + "\n"
        })
    }

    fn from_reader(reader: &Reader, number: u8) -> Result<Self> {
        Ok(Self {
            number,
            steps: arr![ChainStep::from_reader(reader)?; 16],
        })
    }
}

impl fmt::Display for Chain {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "CHAIN {:02x}\n\n{}", self.number, self.print_screen())
    }
}
impl fmt::Debug for Chain {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct ChainStep {
    pub phrase: u8,
    pub transpose: u8,
}
impl Default for ChainStep {
    fn default() -> Self {
        Self {
            phrase: 255,
            transpose: 0,
        }
    }
}
impl ChainStep {
    pub fn print(&self, row: u8) -> String {
        if self.phrase == 255 {
            format!("{:x} -- 00", row)
        } else {
            format!("{:x} {:02x} {:02x}", row, self.phrase, self.transpose)
        }
    }

    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            phrase: reader.read(),
            transpose: reader.read(),
        })
    }
}

#[derive(PartialEq, Clone, Default)]
pub struct Phrase {
    pub number: u8,
    pub steps: [Step; 16],
    version: Version,
}
impl Phrase {
    pub fn print_screen(&self) -> String {
        (0..16).fold("  N   V  I  FX1   FX2   FX3  \n".to_string(), |s, row| {
            s + &self.steps[row].print(row as u8, self.version) + "\n"
        })
    }

    fn from_reader(reader: &Reader, number: u8, version: Version) -> Result<Self> {
        Ok(Self {
            number,
            steps: arr![Step::from_reader(reader)?; 16],
            version,
        })
    }
}

impl fmt::Display for Phrase {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "PHRASE {:02x}\n\n{}", self.number, self.print_screen())
    }
}
impl fmt::Debug for Phrase {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

#[derive(PartialEq, Debug, Clone, Default)]
pub struct Step {
    pub note: Note,
    pub velocity: u8,
    pub instrument: u8,
    pub fx1: FX,
    pub fx2: FX,
    pub fx3: FX,
}
impl Step {
    pub fn print(&self, row: u8, version: Version) -> String {
        let velocity = if self.velocity == 255 {
            format!("--")
        } else {
            format!("{:02x}", self.velocity)
        };
        let instrument = if self.instrument == 255 {
            format!("--")
        } else {
            format!("{:02x}", self.instrument)
        };
        format!(
            "{:x} {} {} {} {} {} {}",
            row,
            self.note,
            velocity,
            instrument,
            self.fx1.print(version),
            self.fx2.print(version),
            self.fx3.print(version)
        )
    }

    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            note: Note(reader.read()),
            velocity: reader.read(),
            instrument: reader.read(),
            fx1: FX::from_reader(reader)?,
            fx2: FX::from_reader(reader)?,
            fx3: FX::from_reader(reader)?,
        })
    }
}

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct Note(pub u8);
impl Default for Note {
    fn default() -> Self {
        Note(255)
    }
}

impl fmt::Display for Note {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if self.0 == 255 {
            write!(f, "---")
        } else if self.0 >= 0x80 {
            write!(f, "OFF") // This isn't really true for < V3
        } else {
            let oct = (self.0 / 12) + 1;
            let n = match self.0 % 12 {
                0 => "C-",
                1 => "C#",
                2 => "D-",
                3 => "D#",
                4 => "E-",
                5 => "F-",
                6 => "F#",
                7 => "G-",
                8 => "G#",
                9 => "A-",
                10 => "A#",
                11 => "B-",
                _ => panic!(),
            };
            write!(f, "{}{:X}", n, oct)
        }
    }
}

#[derive(PartialEq, Clone)]
pub struct Table {
    pub number: u8,
    pub steps: [TableStep; 16],
    version: Version,
}
impl Table {
    pub fn print_screen(&self) -> String {
        (0..16).fold("  N  V  FX1   FX2   FX3  \n".to_string(), |s, row| {
            s + &self.steps[row].print(row as u8, self.version) + "\n"
        })
    }

    fn from_reader(reader: &Reader, number: u8, version: Version) -> Result<Self> {
        Ok(Self {
            number,
            steps: arr![TableStep::from_reader(reader)?; 16],
            version,
        })
    }
}

impl fmt::Display for Table {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "TABLE {:02x}\n\n{}", self.number, self.print_screen())
    }
}
impl fmt::Debug for Table {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct TableStep {
    pub transpose: u8,
    pub velocity: u8,
    pub fx1: FX,
    pub fx2: FX,
    pub fx3: FX,
}
impl TableStep {
    pub fn print(&self, row: u8, version: Version) -> String {
        let transpose = if self.transpose == 255 {
            format!("--")
        } else {
            format!("{:02x}", self.transpose)
        };
        let velocity = if self.velocity == 255 {
            format!("--")
        } else {
            format!("{:02x}", self.velocity)
        };
        format!(
            "{:x} {} {} {} {} {}",
            row,
            transpose,
            velocity,
            self.fx1.print(version),
            self.fx2.print(version),
            self.fx3.print(version)
        )
    }

    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            transpose: reader.read(),
            velocity: reader.read(),
            fx1: FX::from_reader(reader)?,
            fx2: FX::from_reader(reader)?,
            fx3: FX::from_reader(reader)?,
        })
    }
}

#[derive(PartialEq, Debug, Clone, Copy, Default)]
pub struct FX {
    pub command: u8,
    pub value: u8,
}
impl FX {
    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            command: reader.read(),
            value: reader.read(),
        })
    }

    fn print(&self, version: Version) -> String {
        if self.command == 255 {
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

    pub fn command_eq(&self, s: &str, version: Version) -> bool {
        let c = if version.at_least(3, 0) {
            Self::str_to_command3(s)
        } else {
            Self::str_to_command2(s)
        };
        c == self.command
    }

    fn format_command2(&self) -> String {
        match self.command {
            0x00 => format!("ARP"),
            0x01 => format!("CHA"),
            0x02 => format!("DEL"),
            0x03 => format!("GRV"),
            0x04 => format!("HOP"),
            0x05 => format!("KIL"),
            0x06 => format!("RAN"),
            0x07 => format!("RET"),
            0x08 => format!("REP"),
            0x09 => format!("NTH"),
            0x0A => format!("PSL"),
            0x0B => format!("PSN"),
            0x0C => format!("PVB"),
            0x0D => format!("PVX"),
            0x0E => format!("SCA"),
            0x0F => format!("SCG"),
            0x10 => format!("SED"),
            0x11 => format!("SNG"),
            0x12 => format!("TBL"),
            0x13 => format!("THO"),
            0x14 => format!("TIC"),
            0x15 => format!("TPO"),
            0x16 => format!("TSP"),
            // FX + mixer commands
            0x17 => format!("VMV"),
            0x18 => format!("XCM"),
            0x19 => format!("XCF"),
            0x1A => format!("XCW"),
            0x1B => format!("XCR"),
            0x1C => format!("XDT"),
            0x1D => format!("XDF"),
            0x1E => format!("XDW"),
            0x1F => format!("XDR"),
            0x20 => format!("XRS"),
            0x21 => format!("XRD"),
            0x22 => format!("XRM"),
            0x23 => format!("XRF"),
            0x24 => format!("XRW"),
            0x25 => format!("XRZ"),
            0x26 => format!("VCH"),
            0x27 => format!("VCD"),
            0x28 => format!("VRE"),
            0x29 => format!("VT1"),
            0x2A => format!("VT2"),
            0x2B => format!("VT3"),
            0x2C => format!("VT4"),
            0x2D => format!("VT5"),
            0x2E => format!("VT6"),
            0x2F => format!("VT7"),
            0x30 => format!("VT8"),
            0x31 => format!("DJF"),
            0x32 => format!("IVO"),
            0x33 => format!("ICH"),
            0x34 => format!("IDE"),
            0x35 => format!("IRE"),
            0x36 => format!("IV2"),
            0x37 => format!("IC2"),
            0x38 => format!("ID2"),
            0x39 => format!("IR2"),
            0x3A => format!("USB"),
            // Instrument commands
            0x80 => format!("I00"),
            0x81 => format!("I01"),
            0x82 => format!("I02"),
            0x83 => format!("I03"),
            0x84 => format!("I04"),
            0x85 => format!("I05"),
            0x86 => format!("I06"),
            0x87 => format!("I07"),
            0x88 => format!("I08"),
            0x89 => format!("I09"),
            0x8A => format!("I0A"),
            0x8B => format!("I0B"),
            0x8C => format!("I0C"),
            0x8D => format!("I0D"),
            0x8E => format!("I0E"),
            0x8F => format!("I8F"),
            0x90 => format!("I90"),
            0x91 => format!("I91"),
            0x92 => format!("I92"),
            0x93 => format!("I93"),
            0x94 => format!("I94"),
            0x95 => format!("I95"),
            0x96 => format!("I96"),
            0x97 => format!("I97"),
            0x98 => format!("I98"),
            0x99 => format!("I99"),
            0x9A => format!("I9A"),
            0x9B => format!("I9B"),
            0x9C => format!("I9C"),
            0x9D => format!("I9D"),
            0x9E => format!("I9E"),
            0x9F => format!("I9F"),
            0xA0 => format!("IA0"),
            0xA1 => format!("IA1"),
            0xA2 => format!("IA2"),
            // Unknown
            x => format!("{:02x} ", x),
        }
    }

    fn str_to_command2(s: &str) -> u8 {
        match s {
            "ARP" => 0x00,
            "CHA" => 0x01,
            "DEL" => 0x02,
            "GRV" => 0x03,
            "HOP" => 0x04,
            "KIL" => 0x05,
            "RAN" => 0x06,
            "RET" => 0x07,
            "REP" => 0x08,
            "NTH" => 0x09,
            "PSL" => 0x0A,
            "PSN" => 0x0B,
            "PVB" => 0x0C,
            "PVX" => 0x0D,
            "SCA" => 0x0E,
            "SCG" => 0x0F,
            "SED" => 0x10,
            "SNG" => 0x11,
            "TBL" => 0x12,
            "THO" => 0x13,
            "TIC" => 0x14,
            "TPO" => 0x15,
            "TSP" => 0x16,
            // FX + mixer commands
            "VMV" => 0x17,
            "XCM" => 0x18,
            "XCF" => 0x19,
            "XCW" => 0x1A,
            "XCR" => 0x1B,
            "XDT" => 0x1C,
            "XDF" => 0x1D,
            "XDW" => 0x1E,
            "XDR" => 0x1F,
            "XRS" => 0x20,
            "XRD" => 0x21,
            "XRM" => 0x22,
            "XRF" => 0x23,
            "XRW" => 0x24,
            "XRZ" => 0x25,
            "VCH" => 0x26,
            "VCD" => 0x27,
            "VRE" => 0x28,
            "VT1" => 0x29,
            "VT2" => 0x2A,
            "VT3" => 0x2B,
            "VT4" => 0x2C,
            "VT5" => 0x2D,
            "VT6" => 0x2E,
            "VT7" => 0x2F,
            "VT8" => 0x30,
            "DJF" => 0x31,
            "IVO" => 0x32,
            "ICH" => 0x33,
            "IDE" => 0x34,
            "IRE" => 0x35,
            "IV2" => 0x36,
            "IC2" => 0x37,
            "ID2" => 0x38,
            "IR2" => 0x39,
            "USB" => 0x3A,
            // Instrument commands
            "I00" => 0x80,
            "I01" => 0x81,
            "I02" => 0x82,
            "I03" => 0x83,
            "I04" => 0x84,
            "I05" => 0x85,
            "I06" => 0x86,
            "I07" => 0x87,
            "I08" => 0x88,
            "I09" => 0x89,
            "I0A" => 0x8A,
            "I0B" => 0x8B,
            "I0C" => 0x8C,
            "I0D" => 0x8D,
            "I0E" => 0x8E,
            "I8F" => 0x8F,
            "I90" => 0x90,
            "I91" => 0x91,
            "I92" => 0x92,
            "I93" => 0x93,
            "I94" => 0x94,
            "I95" => 0x95,
            "I96" => 0x96,
            "I97" => 0x97,
            "I98" => 0x98,
            "I99" => 0x99,
            "I9A" => 0x9A,
            "I9B" => 0x9B,
            "I9C" => 0x9C,
            "I9D" => 0x9D,
            "I9E" => 0x9E,
            "I9F" => 0x9F,
            "IA0" => 0xA0,
            "IA1" => 0xA1,
            "IA2" => 0xA2,
            _ => 0xFF,
        }
    }

    fn format_command3(&self) -> String {
        match self.command {
            0x00 => format!("ARP"),
            0x01 => format!("CHA"),
            0x02 => format!("DEL"),
            0x03 => format!("GRV"),
            0x04 => format!("HOP"),
            0x05 => format!("KIL"),
            0x06 => format!("RND"),
            0x07 => format!("RNL"),
            0x08 => format!("RET"),
            0x09 => format!("REP"),
            0x0A => format!("RMX"),
            0x0B => format!("NTH"),
            0x0C => format!("PSL"),
            0x0D => format!("PBN"),
            0x0E => format!("PVB"),
            0x0F => format!("PVX"),
            0x10 => format!("SCA"),
            0x11 => format!("SCG"),
            0x12 => format!("SED"),
            0x13 => format!("SNG"),
            0x14 => format!("TBL"),
            0x15 => format!("THO"),
            0x16 => format!("TIC"),
            0x17 => format!("TBX"),
            0x18 => format!("TPO"),
            0x19 => format!("TSP"),
            0x1A => format!("OFF"),
            // FX + mixer commands
            0x1B => format!("VMV"),
            0x1C => format!("XCM"),
            0x1D => format!("XCF"),
            0x1E => format!("XCW"),
            0x1F => format!("XCR"),
            0x20 => format!("XDT"),
            0x21 => format!("XDF"),
            0x22 => format!("XDW"),
            0x23 => format!("XDR"),
            0x24 => format!("XRS"),
            0x25 => format!("XRD"),
            0x26 => format!("XRM"),
            0x27 => format!("XRF"),
            0x28 => format!("XRW"),
            0x29 => format!("XRZ"),
            0x2A => format!("VCH"),
            0x2B => format!("VCD"),
            0x2C => format!("VRE"),
            0x2D => format!("VT1"),
            0x2E => format!("VT2"),
            0x2F => format!("VT3"),
            0x30 => format!("VT4"),
            0x31 => format!("VT5"),
            0x32 => format!("VT6"),
            0x33 => format!("VT7"),
            0x34 => format!("VT8"),
            0x35 => format!("DJF"),
            0x36 => format!("IVO"),
            0x37 => format!("ICH"),
            0x38 => format!("IDE"),
            0x39 => format!("IRE"),
            0x3A => format!("IV2"),
            0x3B => format!("IC2"),
            0x3C => format!("ID2"),
            0x3D => format!("IR2"),
            0x3E => format!("USB"),
            // Instrument commands
            0x80 => format!("I00"),
            0x81 => format!("I01"),
            0x82 => format!("I02"),
            0x83 => format!("I03"),
            0x84 => format!("I04"),
            0x85 => format!("I05"),
            0x86 => format!("I06"),
            0x87 => format!("I07"),
            0x88 => format!("I08"),
            0x89 => format!("I09"),
            0x8A => format!("I0A"),
            0x8B => format!("I0B"),
            0x8C => format!("I0C"),
            0x8D => format!("I0D"),
            0x8E => format!("I0E"),
            0x8F => format!("I8F"),
            0x90 => format!("I90"),
            0x91 => format!("I91"),
            0x92 => format!("I92"),
            0x93 => format!("I93"),
            0x94 => format!("I94"),
            0x95 => format!("I95"),
            0x96 => format!("I96"),
            0x97 => format!("I97"),
            0x98 => format!("I98"),
            0x99 => format!("I99"),
            0x9A => format!("I9A"),
            0x9B => format!("I9B"),
            0x9C => format!("I9C"),
            0x9D => format!("I9D"),
            0x9E => format!("I9E"),
            0x9F => format!("I9F"),
            0xA0 => format!("IA0"),
            0xA1 => format!("IA1"),
            0xA2 => format!("IA2"),
            0xA3 => format!("IA3"),
            0xA4 => format!("IA4"),
            0xA5 => format!("IA5"),
            0xA6 => format!("IA6"),
            0xA7 => format!("IA7"),
            // Unknown
            x => format!("{:02x} ", x),
        }
    }

    fn str_to_command3(s: &str) -> u8 {
        match s {
            "ARP" => 0x00,
            "CHA" => 0x01,
            "DEL" => 0x02,
            "GRV" => 0x03,
            "HOP" => 0x04,
            "KIL" => 0x05,
            "RND" => 0x06,
            "RNL" => 0x07,
            "RET" => 0x08,
            "REP" => 0x09,
            "RMX" => 0x0A,
            "NTH" => 0x0B,
            "PSL" => 0x0C,
            "PBN" => 0x0D,
            "PVB" => 0x0E,
            "PVX" => 0x0F,
            "SCA" => 0x10,
            "SCG" => 0x11,
            "SED" => 0x12,
            "SNG" => 0x13,
            "TBL" => 0x14,
            "THO" => 0x15,
            "TIC" => 0x16,
            "TBX" => 0x17,
            "TPO" => 0x18,
            "TSP" => 0x19,
            "OFF" => 0x1A,
            // FX + mixer commands
            "VMV" => 0x1B,
            "XCM" => 0x1C,
            "XCF" => 0x1D,
            "XCW" => 0x1E,
            "XCR" => 0x1F,
            "XDT" => 0x20,
            "XDF" => 0x21,
            "XDW" => 0x22,
            "XDR" => 0x23,
            "XRS" => 0x24,
            "XRD" => 0x25,
            "XRM" => 0x26,
            "XRF" => 0x27,
            "XRW" => 0x28,
            "XRZ" => 0x29,
            "VCH" => 0x2A,
            "VCD" => 0x2B,
            "VRE" => 0x2C,
            "VT1" => 0x2D,
            "VT2" => 0x2E,
            "VT3" => 0x2F,
            "VT4" => 0x30,
            "VT5" => 0x31,
            "VT6" => 0x32,
            "VT7" => 0x33,
            "VT8" => 0x34,
            "DJF" => 0x35,
            "IVO" => 0x36,
            "ICH" => 0x37,
            "IDE" => 0x38,
            "IRE" => 0x39,
            "IV2" => 0x3A,
            "IC2" => 0x3B,
            "ID2" => 0x3C,
            "IR2" => 0x3D,
            "USB" => 0x3E,
            // Instrument commands
            "I00" => 0x80,
            "I01" => 0x81,
            "I02" => 0x82,
            "I03" => 0x83,
            "I04" => 0x84,
            "I05" => 0x85,
            "I06" => 0x86,
            "I07" => 0x87,
            "I08" => 0x88,
            "I09" => 0x89,
            "I0A" => 0x8A,
            "I0B" => 0x8B,
            "I0C" => 0x8C,
            "I0D" => 0x8D,
            "I0E" => 0x8E,
            "I8F" => 0x8F,
            "I90" => 0x90,
            "I91" => 0x91,
            "I92" => 0x92,
            "I93" => 0x93,
            "I94" => 0x94,
            "I95" => 0x95,
            "I96" => 0x96,
            "I97" => 0x97,
            "I98" => 0x98,
            "I99" => 0x99,
            "I9A" => 0x9A,
            "I9B" => 0x9B,
            "I9C" => 0x9C,
            "I9D" => 0x9D,
            "I9E" => 0x9E,
            "I9F" => 0x9F,
            "IA0" => 0xA0,
            "IA1" => 0xA1,
            "IA2" => 0xA2,
            "IA3" => 0xA3,
            "IA4" => 0xA4,
            "IA5" => 0xA5,
            "IA6" => 0xA6,
            "IA7" => 0xA7,
            _ => 255,
        }
    }
}

#[derive(PartialEq, Debug, Clone)]
pub enum Instrument {
    WavSynth(WavSynth),
    MacroSynth(MacroSynth),
    Sampler(Sampler),
    MIDIOut(MIDIOut),
    FMSynth(FMSynth),
    HyperSynth(HyperSynth),
    External(ExternalInst),
    None,
}
impl Default for Instrument {
    fn default() -> Self {
        Self::None
    }
}
impl Instrument {
    const SIZE: usize = 215;

    pub fn read(reader: &mut impl std::io::Read) -> Result<Self> {
        let mut buf: Vec<u8> = vec![];
        reader.read_to_end(&mut buf).unwrap();
        let len = buf.len();
        let reader = Reader::new(buf);

        if len < Self::SIZE + Version::SIZE {
            return Err(ParseError(
                "File is not long enough to be a M8 Instrument".to_string(),
            ));
        }
        let version = Version::from_reader(&reader)?;
        if version.at_least(3, 0) {
            Self::from_reader3(&reader, 0, version)
        } else {
            Self::from_reader2(&reader, 0, version)
        }
    }

    fn from_reader2(reader: &Reader, number: u8, version: Version) -> Result<Self> {
        let start_pos = reader.pos();
        let kind = reader.read();
        let name = reader.read_string(12);
        let transpose = reader.read_bool();
        let table_tick = reader.read();
        let (volume, pitch, fine_tune) = if kind != 3 {
            (reader.read(), reader.read(), reader.read())
        } else {
            (0, 0, 0)
        };

        let finalize = || -> () {
            reader.set_pos(start_pos + Self::SIZE);
        };

        Ok(match kind {
            0x00 => {
                // WavSyn
                let shape = reader.read();
                let size = reader.read();
                let mult = reader.read();
                let warp = reader.read();
                let mirror = reader.read();
                let synth_params = SynthParams::from_reader2(reader, volume, pitch, fine_tune)?;
                finalize();
                Self::WavSynth(WavSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    shape,
                    size,
                    mult,
                    warp,
                    mirror,
                })
            }
            0x01 => {
                // MacroSyn
                let shape = reader.read();
                let timbre = reader.read();
                let color = reader.read();
                let degrade = reader.read();
                let redux = reader.read();
                let synth_params = SynthParams::from_reader2(reader, volume, pitch, fine_tune)?;
                finalize();
                Self::MacroSynth(MacroSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    shape,
                    timbre,
                    color,
                    degrade,
                    redux,
                })
            }
            0x02 => {
                // Sampler
                let play_mode = reader.read();
                let slice = reader.read();
                let start = reader.read();
                let loop_start = reader.read();
                let length = reader.read();
                let degrade = reader.read();
                let synth_params = SynthParams::from_reader2(reader, volume, pitch, fine_tune)?;
                reader.set_pos(start_pos + 0x57);
                let sample_path = reader.read_string(128);
                finalize();
                Self::Sampler(Sampler {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    sample_path,
                    play_mode,
                    slice,
                    start,
                    loop_start,
                    length,
                    degrade,
                })
            }
            0x03 => {
                // MIDI
                let port = reader.read();
                let channel = reader.read();
                let bank_select = reader.read();
                let program_change = reader.read();
                reader.read_bytes(3); // discard
                let custom_cc: [ControlChange; 8] = arr![ControlChange::from_reader(reader)?; 8];
                let mods = arr![AHDEnv::default().to_mod(); 4];
                finalize();
                Self::MIDIOut(MIDIOut {
                    number,
                    name,
                    transpose,
                    table_tick,

                    port,
                    channel,
                    bank_select,
                    program_change,
                    custom_cc,
                    mods,
                })
            }
            0x04 => {
                // FM
                let algo = reader.read();
                let mut operators: [Operator; 4] = arr![Operator::default(); 4];
                if version.at_least(1, 4) {
                    for i in 0..4 {
                        operators[i].shape = reader.read();
                    }
                }
                for i in 0..4 {
                    operators[i].ratio = reader.read();
                    operators[i].ratio_fine = reader.read();
                }
                for i in 0..4 {
                    operators[i].level = reader.read();
                    operators[i].feedback = reader.read();
                }
                for i in 0..4 {
                    operators[i].mod_a = reader.read();
                }
                for i in 0..4 {
                    operators[i].mod_b = reader.read();
                }
                let mod1 = reader.read();
                let mod2 = reader.read();
                let mod3 = reader.read();
                let mod4 = reader.read();
                let synth_params = SynthParams::from_reader2(reader, volume, pitch, fine_tune)?;
                finalize();

                Self::FMSynth(FMSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    algo,
                    operators,
                    mod1,
                    mod2,
                    mod3,
                    mod4,
                })
            }
            0xFF => {
                finalize();
                Self::None
            }
            _ => panic!("Instrument type {} not supported", kind),
        })
    }

    fn from_reader3(reader: &Reader, number: u8, version: Version) -> Result<Self> {
        let start_pos = reader.pos();
        // println!("inst start pos: {:02x} ({})", start_pos, start_pos);
        let kind = reader.read();
        let name = reader.read_string(12);
        let transpose = reader.read_bool();
        let table_tick = reader.read();
        let (volume, pitch, fine_tune) = if kind != 3 {
            (reader.read(), reader.read(), reader.read())
        } else {
            (0, 0, 0)
        };

        let finalize = || -> () {
            reader.set_pos(start_pos + Self::SIZE);
        };

        Ok(match kind {
            0x00 => {
                let shape = reader.read();
                let size = reader.read();
                let mult = reader.read();
                let warp = reader.read();
                let mirror = reader.read();
                let synth_params = SynthParams::from_reader3(reader, volume, pitch, fine_tune, 30)?;
                finalize();
                Self::WavSynth(WavSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    shape,
                    size,
                    mult,
                    warp,
                    mirror,
                })
            }
            0x01 => {
                let shape = reader.read();
                let timbre = reader.read();
                let color = reader.read();
                let degrade = reader.read();
                let redux = reader.read();
                let synth_params = SynthParams::from_reader3(reader, volume, pitch, fine_tune, 30)?;
                finalize();
                Self::MacroSynth(MacroSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    shape,
                    timbre,
                    color,
                    degrade,
                    redux,
                })
            }
            0x02 => {
                let play_mode = reader.read();
                let slice = reader.read();
                let start = reader.read();
                let loop_start = reader.read();
                let length = reader.read();
                let degrade = reader.read();
                let synth_params = SynthParams::from_reader3(reader, volume, pitch, fine_tune, 29)?;
                reader.set_pos(start_pos + 0x57);
                let sample_path = reader.read_string(128);
                finalize();
                Self::Sampler(Sampler {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    sample_path,
                    play_mode,
                    slice,
                    start,
                    loop_start,
                    length,
                    degrade,
                })
            }
            0x03 => {
                let port = reader.read();
                let channel = reader.read();
                let bank_select = reader.read();
                let program_change = reader.read();
                reader.read_bytes(3); // discard
                let custom_cc: [ControlChange; 8] = arr![ControlChange::from_reader(reader)?; 8];
                let _discard = reader.read_bytes(25);
                let mods = arr![Mod::from_reader(reader)?; 4];
                finalize();
                Self::MIDIOut(MIDIOut {
                    number,
                    name,
                    transpose,
                    table_tick,

                    port,
                    channel,
                    bank_select,
                    program_change,
                    custom_cc,
                    mods,
                })
            }
            0x04 => {
                let algo = reader.read();
                let mut operators: [Operator; 4] = arr![Operator::default(); 4];
                if version.at_least(1, 4) {
                    for i in 0..4 {
                        operators[i].shape = reader.read();
                    }
                }
                for i in 0..4 {
                    operators[i].ratio = reader.read();
                    operators[i].ratio_fine = reader.read();
                }
                for i in 0..4 {
                    operators[i].level = reader.read();
                    operators[i].feedback = reader.read();
                }
                for i in 0..4 {
                    operators[i].mod_a = reader.read();
                }
                for i in 0..4 {
                    operators[i].mod_b = reader.read();
                }
                let mod1 = reader.read();
                let mod2 = reader.read();
                let mod3 = reader.read();
                let mod4 = reader.read();
                let synth_params = SynthParams::from_reader3(reader, volume, pitch, fine_tune, 2)?;
                finalize();

                Self::FMSynth(FMSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    algo,
                    operators,
                    mod1,
                    mod2,
                    mod3,
                    mod4,
                })
            }
            0x05 => {
                // HyperSynth

                let chord = arr![reader.read(); 7];
                let scale = reader.read();
                let shift = reader.read();
                let swarm = reader.read();
                let width = reader.read();
                let subosc = reader.read();
                let synth_params = SynthParams::from_reader3(reader, volume, pitch, fine_tune, 23)?;

                finalize();
                Self::HyperSynth(HyperSynth {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    scale,
                    chord,
                    shift,
                    swarm,
                    width,
                    subosc,
                })
            }
            0x06 => {
                // External
                let input = reader.read();
                let port = reader.read();
                let channel = reader.read();
                let bank = reader.read();
                let program = reader.read();
                let cca = CC::new(reader.read(), reader.read());
                let ccb = CC::new(reader.read(), reader.read());
                let ccc = CC::new(reader.read(), reader.read());
                let ccd = CC::new(reader.read(), reader.read());
                let synth_params = SynthParams::from_reader3(reader, volume, pitch, fine_tune, 22)?;
                finalize();
                Self::External(ExternalInst {
                    number,
                    name,
                    transpose,
                    table_tick,
                    synth_params,

                    input,
                    port,
                    channel,
                    bank,
                    program,
                    cca,
                    ccb,
                    ccc,
                    ccd,
                })
            }
            0xFF => {
                finalize();
                Self::None
            }
            _ => panic!("Instrument type {} not supported", kind),
        })
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct WavSynth {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub shape: u8,
    pub size: u8,
    pub mult: u8,
    pub warp: u8,
    pub mirror: u8,
}

#[derive(PartialEq, Debug, Clone)]
pub struct MacroSynth {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub shape: u8,
    pub timbre: u8,
    pub color: u8,
    pub degrade: u8,
    pub redux: u8,
}

#[derive(PartialEq, Debug, Clone)]
pub struct Sampler {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub sample_path: String,
    pub play_mode: u8,
    pub slice: u8,
    pub start: u8,
    pub loop_start: u8,
    pub length: u8,
    pub degrade: u8,
}

#[derive(PartialEq, Debug, Clone)]
pub struct FMSynth {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub algo: u8,
    pub operators: [Operator; 4],
    pub mod1: u8,
    pub mod2: u8,
    pub mod3: u8,
    pub mod4: u8,
}

#[derive(PartialEq, Debug, Clone)]
pub struct MIDIOut {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,

    pub port: u8,
    pub channel: u8,
    pub bank_select: u8,
    pub program_change: u8,
    pub custom_cc: [ControlChange; 8],

    pub mods: [Mod; 4],
}

#[derive(PartialEq, Debug, Clone)]
pub struct HyperSynth {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub scale: u8,
    pub chord: [u8; 7],
    pub shift: u8,
    pub swarm: u8,
    pub width: u8,
    pub subosc: u8,
}

#[derive(PartialEq, Debug, Clone)]
pub struct ExternalInst {
    pub number: u8,
    pub name: String,
    pub transpose: bool,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub input: u8,
    pub port: u8,
    pub channel: u8,
    pub bank: u8,
    pub program: u8,
    pub cca: CC,
    pub ccb: CC,
    pub ccc: CC,
    pub ccd: CC,
}

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct CC {
    cc: u8,
    amount: u8,
}

impl CC {
    pub fn new(cc: u8, amount: u8) -> Self {
        Self { cc, amount }
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
    pub limit: u8,

    pub mixer_pan: u8,
    pub mixer_dry: u8,
    pub mixer_chorus: u8,
    pub mixer_delay: u8,
    pub mixer_reverb: u8,

    pub mods: [Mod; 4],
}
impl SynthParams {
    fn from_reader2(reader: &Reader, volume: u8, pitch: u8, fine_tune: u8) -> Result<Self> {
        Ok(Self {
            volume,
            pitch,
            fine_tune,

            filter_type: reader.read(),
            filter_cutoff: reader.read(),
            filter_res: reader.read(),

            amp: reader.read(),
            limit: reader.read(),

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

    fn from_reader3(
        reader: &Reader,
        volume: u8,
        pitch: u8,
        fine_tune: u8,
        mod_offset: usize,
    ) -> Result<Self> {
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
        let _discard = reader.read_bytes(mod_offset);
        let mods = arr![Mod::from_reader(reader)?; 4];

        Ok(Self {
            volume,
            pitch,
            fine_tune,

            filter_type,
            filter_cutoff,
            filter_res,

            amp,
            limit,

            mixer_pan,
            mixer_dry,
            mixer_chorus,
            mixer_delay,
            mixer_reverb,

            mods,
        })
    }
}

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
    fn from_reader(reader: &Reader) -> Result<Self> {
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
            x => panic!("Unknown mod type {}", x),
        };

        reader.set_pos(start_pos + Self::SIZE);
        Ok(r)
    }
}

#[derive(PartialEq, Debug, Clone, Default)]
pub struct AHDEnv {
    pub dest: u8,
    pub amount: u8,
    pub attack: u8,
    pub hold: u8,
    pub decay: u8,
}
impl AHDEnv {
    fn from_reader2(reader: &Reader) -> Result<Self> {
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

    fn from_reader3(reader: &Reader, dest: u8) -> Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            attack: reader.read(),
            hold: reader.read(),
            decay: reader.read(),
        })
    }

    fn to_mod(self) -> Mod {
        Mod::AHDEnv(self)
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct LFO {
    pub shape: u8,
    pub dest: u8,
    pub trigger_mode: u8,
    pub freq: u8,
    pub amount: u8,
}
impl LFO {
    fn from_reader2(reader: &Reader) -> Result<Self> {
        let r = Self {
            shape: reader.read(),
            dest: reader.read(),
            trigger_mode: reader.read(),
            freq: reader.read(),
            amount: reader.read(),
        };
        reader.read();
        Ok(r)
    }

    fn from_reader3(reader: &Reader, dest: u8) -> Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            shape: reader.read(),
            trigger_mode: reader.read(),
            freq: reader.read(),
        })
    }

    fn to_mod(self) -> Mod {
        Mod::LFO(self)
    }
}

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
    fn from_reader(reader: &Reader, dest: u8) -> Result<Self> {
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

#[derive(PartialEq, Debug, Clone)]
pub struct DrumEnv {
    pub dest: u8,
    pub amount: u8,
    pub peak: u8,
    pub body: u8,
    pub decay: u8,
}
impl DrumEnv {
    fn from_reader(reader: &Reader, dest: u8) -> Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            peak: reader.read(),
            body: reader.read(),
            decay: reader.read(),
        })
    }
}

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
    fn from_reader(reader: &Reader, dest: u8) -> Result<Self> {
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

#[derive(PartialEq, Debug, Clone)]
pub struct TrackingEnv {
    pub dest: u8,
    pub amount: u8,
    pub src: u8,
    pub lval: u8,
    pub hval: u8,
}
impl TrackingEnv {
    fn from_reader(reader: &Reader, dest: u8) -> Result<Self> {
        Ok(Self {
            dest,
            amount: reader.read(),
            src: reader.read(),
            lval: reader.read(),
            hval: reader.read(),
        })
    }
}

#[derive(PartialEq, Debug, Default, Clone)]
pub struct Operator {
    pub shape: u8,
    pub ratio: u8,
    pub ratio_fine: u8,
    pub level: u8,
    pub feedback: u8,
    pub retrigger: u8,
    pub mod_a: u8,
    pub mod_b: u8,
}

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct ControlChange {
    pub number: u8,
    pub default_value: u8,
}
impl ControlChange {
    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            number: reader.read(),
            default_value: reader.read(),
        })
    }
}

#[derive(PartialEq, Clone)]
pub struct Groove {
    pub number: u8,
    pub steps: [u8; 16],
}
impl Groove {
    fn from_reader(reader: &Reader, number: u8) -> Result<Self> {
        Ok(Self {
            number,
            steps: reader.read_bytes(16).try_into().unwrap(),
        })
    }

    pub fn active_steps(&self) -> &[u8] {
        let end = (&self.steps).iter().position(|&x| x == 255).unwrap_or(15);
        &self.steps[0..end]
    }
}

impl fmt::Display for Groove {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Groove {}:{:?}", self.number, self.active_steps())
    }
}
impl fmt::Debug for Groove {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

#[derive(PartialEq, Clone)]
pub struct Scale {
    pub number: u8,
    pub name: String,
    pub notes: [NoteOffset; 12], // Offsets for notes C-B
}
impl Scale {
    const SIZE: usize = 32;

    pub fn read(reader: &mut impl std::io::Read) -> Result<Self> {
        let mut buf: Vec<u8> = vec![];
        reader.read_to_end(&mut buf).unwrap();
        let len = buf.len();
        let reader = Reader::new(buf);

        if len < Self::SIZE + Version::SIZE {
            return Err(ParseError(
                "File is not long enough to be a M8 Scale".to_string(),
            ));
        }
        Version::from_reader(&reader)?;
        Self::from_reader(&reader, 0)
    }

    fn from_reader(reader: &Reader, number: u8) -> Result<Self> {
        let map = LittleEndian::read_u16(reader.read_bytes(2));
        let mut notes = arr![NoteOffset::default(); 12];

        for (i, note) in notes.iter_mut().enumerate() {
            note.enabled = ((map >> i) & 0x1) == 1;
            let offset = f32::from(reader.read()) + (f32::from(reader.read()) / 100.0);
            note.semitones = offset;
        }

        let name = reader.read_string(16);
        Ok(Self {
            number,
            name,
            notes,
        })
    }

    fn default() -> Self {
        Self {
            number: 0,
            name: "CHROMATIC".to_string(),
            notes: arr![NoteOffset::default(); 12],
        }
    }
}

impl fmt::Display for Scale {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let notes = vec![
            "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        ];
        let offsets = self
            .notes
            .iter()
            .zip(notes.iter())
            .map(|(offset, note)| -> String {
                let s = if offset.enabled {
                    let sign = if offset.semitones < 0.0 { "-" } else { " " };
                    format!(" ON{}{:02.2}", sign, offset.semitones.abs())
                } else {
                    " -- -- --".to_string()
                };
                format!("{:<2}{}", note, &s)
            })
            .collect::<Vec<String>>()
            .join("\n");

        write!(
            f,
            "Scale {}\nKEY   C\n\n   EN OFFSET\n{}\n\nNAME  {}",
            self.number, offsets, &self.name
        )
    }
}
impl fmt::Debug for Scale {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", &self)
    }
}

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct NoteOffset {
    pub enabled: bool,
    pub semitones: f32, // Semitones.cents: -24.0-24.0
}
impl NoteOffset {
    fn default() -> Self {
        Self {
            enabled: true,
            semitones: 0.0,
        }
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct MidiSettings {
    pub receive_sync: bool,
    pub receive_transport: u8,
    pub send_sync: bool,
    pub send_transport: u8,
    pub record_note_channel: u8,
    pub record_note_velocity: bool,
    pub record_note_delay_kill_commands: u8,
    pub control_map_channel: u8,
    pub song_row_cue_channel: u8,
    pub track_input_channel: [u8; 8],
    pub track_input_intrument: [u8; 8],
    pub track_input_program_change: bool,
    pub track_input_mode: u8,
}
impl MidiSettings {
    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            receive_sync: reader.read_bool(),
            receive_transport: reader.read(),
            send_sync: reader.read_bool(),
            send_transport: reader.read(),
            record_note_channel: reader.read(),
            record_note_velocity: reader.read_bool(),
            record_note_delay_kill_commands: reader.read(),
            control_map_channel: reader.read(),
            song_row_cue_channel: reader.read(),
            track_input_channel: reader.read_bytes(8).try_into().unwrap(),
            track_input_intrument: reader.read_bytes(8).try_into().unwrap(),
            track_input_program_change: reader.read_bool(),
            track_input_mode: reader.read(),
        })
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct MixerSettings {
    pub master_volume: u8,
    pub master_limit: u8,
    pub track_volume: [u8; 8],
    pub chorus_volume: u8,
    pub delay_volume: u8,
    pub reverb_volume: u8,
    pub analog_input: AnalogInputSettings,
    pub usb_input: InputMixerSettings,
    pub dj_filter: u8,
    pub dj_peak: u8,
}
impl MixerSettings {
    fn from_reader(reader: &Reader) -> Result<Self> {
        let master_volume = reader.read();
        let master_limit = reader.read();
        let track_volume: [u8; 8] = reader.read_bytes(8).try_into().unwrap();
        let chorus_volume = reader.read();
        let delay_volume = reader.read();
        let reverb_volume = reader.read();
        let analog_input_volume = (reader.read(), reader.read());
        let usb_input_volume = reader.read();
        let analog_input_chorus = (reader.read(), reader.read());
        let analog_input_delay = (reader.read(), reader.read());
        let analog_input_reverb = (reader.read(), reader.read());
        let usb_input_chorus = reader.read();
        let usb_input_delay = reader.read();
        let usb_input_reverb = reader.read();

        let analog_input_l = InputMixerSettings {
            volume: analog_input_volume.0,
            chorus: analog_input_chorus.0,
            delay: analog_input_delay.0,
            reverb: analog_input_reverb.0,
        };

        let analog_input = if analog_input_volume.1 == 255 {
            AnalogInputSettings::Stereo(analog_input_l)
        } else {
            let analog_input_r = InputMixerSettings {
                volume: analog_input_volume.0,
                chorus: analog_input_chorus.0,
                delay: analog_input_delay.0,
                reverb: analog_input_reverb.0,
            };
            AnalogInputSettings::DualMono((analog_input_l, analog_input_r))
        };
        let usb_input = InputMixerSettings {
            volume: usb_input_volume,
            chorus: usb_input_chorus,
            delay: usb_input_delay,
            reverb: usb_input_reverb,
        };

        let dj_filter = reader.read();
        let dj_peak = reader.read();

        reader.read_bytes(5); // discard
        Ok(Self {
            master_volume,
            master_limit,
            track_volume,
            chorus_volume,
            delay_volume,
            reverb_volume,
            analog_input,
            usb_input,
            dj_filter,
            dj_peak,
        })
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct InputMixerSettings {
    pub volume: u8,
    pub chorus: u8,
    pub delay: u8,
    pub reverb: u8,
}

#[derive(PartialEq, Debug, Clone)]
pub enum AnalogInputSettings {
    Stereo(InputMixerSettings),
    DualMono((InputMixerSettings, InputMixerSettings)),
}

#[derive(PartialEq, Debug, Clone)]
pub struct EffectsSettings {
    pub chorus_mod_depth: u8,
    pub chorus_mod_freq: u8,
    pub chorus_reverb_send: u8,

    pub delay_hp: u8,
    pub delay_lp: u8,
    pub delay_time_l: u8,
    pub delay_time_r: u8,
    pub delay_feedback: u8,
    pub delay_width: u8,
    pub delay_reverb_send: u8,

    pub reverb_hp: u8,
    pub reverb_lp: u8,
    pub reverb_size: u8,
    pub reverb_damping: u8,
    pub reverb_mod_depth: u8,
    pub reverb_mod_freq: u8,
    pub reverb_width: u8,
}
impl EffectsSettings {
    fn from_reader(reader: &Reader) -> Result<Self> {
        let chorus_mod_depth = reader.read();
        let chorus_mod_freq = reader.read();
        let chorus_reverb_send = reader.read();
        reader.read_bytes(3); //unused

        let delay_hp = reader.read();
        let delay_lp = reader.read();
        let delay_time_l = reader.read();
        let delay_time_r = reader.read();
        let delay_feedback = reader.read();
        let delay_width = reader.read();
        let delay_reverb_send = reader.read();
        reader.read_bytes(1); //unused

        let reverb_hp = reader.read();
        let reverb_lp = reader.read();
        let reverb_size = reader.read();
        let reverb_damping = reader.read();
        let reverb_mod_depth = reader.read();
        let reverb_mod_freq = reader.read();
        let reverb_width = reader.read();

        Ok(Self {
            chorus_mod_depth,
            chorus_mod_freq,
            chorus_reverb_send,

            delay_hp,
            delay_lp,
            delay_time_l,
            delay_time_r,
            delay_feedback,
            delay_width,
            delay_reverb_send,

            reverb_hp,
            reverb_lp,
            reverb_size,
            reverb_damping,
            reverb_mod_depth,
            reverb_mod_freq,
            reverb_width,
        })
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct MidiMapping {
    pub channel: u8,
    pub control_number: u8,
    pub value: u8,
    pub typ: u8,
    pub param_index: u8,
    pub min_value: u8,
    pub max_value: u8,
}
impl MidiMapping {
    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            channel: reader.read(),
            control_number: reader.read(),
            value: reader.read(),
            typ: reader.read(),
            param_index: reader.read(),
            min_value: reader.read(),
            max_value: reader.read(),
        })
    }

    pub fn empty(&self) -> bool {
        self.channel == 0
    }
}

#[derive(PartialEq, Debug, Clone)]
pub struct Theme {
    pub background: RGB,
    pub text_empty: RGB,
    pub text_info: RGB,
    pub text_default: RGB,
    pub text_value: RGB,
    pub text_title: RGB,
    pub play_marker: RGB,
    pub cursor: RGB,
    pub selection: RGB,
    pub scope_slider: RGB,
    pub meter_low: RGB,
    pub meter_mid: RGB,
    pub meter_peak: RGB,
}
impl Theme {
    const SIZE: usize = 39;

    pub fn read(reader: &mut impl std::io::Read) -> Result<Self> {
        let mut buf: Vec<u8> = vec![];
        reader.read_to_end(&mut buf).unwrap();
        let len = buf.len();
        let reader = Reader::new(buf);

        if len < Self::SIZE + Version::SIZE {
            return Err(ParseError(
                "File is not long enough to be a M8 Theme".to_string(),
            ));
        }
        Version::from_reader(&reader)?;
        Self::from_reader(&reader)
    }

    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            background: RGB::from_reader(reader)?,
            text_empty: RGB::from_reader(reader)?,
            text_info: RGB::from_reader(reader)?,
            text_default: RGB::from_reader(reader)?,
            text_value: RGB::from_reader(reader)?,
            text_title: RGB::from_reader(reader)?,
            play_marker: RGB::from_reader(reader)?,
            cursor: RGB::from_reader(reader)?,
            selection: RGB::from_reader(reader)?,
            scope_slider: RGB::from_reader(reader)?,
            meter_low: RGB::from_reader(reader)?,
            meter_mid: RGB::from_reader(reader)?,
            meter_peak: RGB::from_reader(reader)?,
        })
    }
}

#[derive(PartialEq, Debug, Copy, Clone)]
pub struct RGB {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}
impl RGB {
    fn from_reader(reader: &Reader) -> Result<Self> {
        Ok(Self {
            r: reader.read(),
            g: reader.read(),
            b: reader.read(),
        })
    }
}

#[cfg(test)]
mod tests {
    use crate::*;
    use std::fs::File;

    fn test_file() -> Song {
        let mut f = File::open("./examples/songs/TEST-FILE.m8s").expect("Could not open TEST-FILE");
        Song::read(&mut f).expect("Could not parse TEST-FILE")
    }

    #[test]
    fn test_instrument_reading() {
        let test_file = test_file();
        // dbg!(&test_file.instruments[0..8]);
        assert!(match &test_file.instruments[0] {
            Instrument::None => true,
            _ => false,
        });
        assert!(
            match &test_file.instruments[1] {
                Instrument::WavSynth(s) => {
                    assert_eq!(s.transpose, true);
                    assert_eq!(s.size, 0x20);
                    assert_eq!(s.synth_params.mixer_reverb, 0xD0);
                    assert!(match s.synth_params.mods[0] {
                        Mod::AHDEnv(_) => true,
                        _ => false,
                    });
                    assert!(match s.synth_params.mods[1] {
                        Mod::ADSREnv(_) => true,
                        _ => false,
                    });
                    assert!(match s.synth_params.mods[2] {
                        Mod::DrumEnv(_) => true,
                        _ => false,
                    });
                    assert!(match s.synth_params.mods[3] {
                        Mod::LFO(_) => true,
                        _ => false,
                    });

                    true
                }
                _ => false,
            },
            "Should be a WavSynth"
        );
        assert!(match &test_file.instruments[2] {
            Instrument::MacroSynth(s) => {
                assert_eq!(s.transpose, false);
                assert!(match s.synth_params.mods[0] {
                    Mod::TrigEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[1] {
                    Mod::TrackingEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[2] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[3] {
                    Mod::LFO(_) => true,
                    _ => false,
                });

                true
            }
            _ => false,
        });
        assert!(match &test_file.instruments[3] {
            Instrument::Sampler(s) => {
                assert!(match s.synth_params.mods[0] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[1] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[2] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[3] {
                    Mod::LFO(_) => true,
                    _ => false,
                });

                assert_eq!(&s.name, "SAMP");
                assert_eq!(
                    &s.sample_path,
                    "/Samples/Drums/Hits/TR505/bass drum 505.wav"
                );

                true
            }
            _ => false,
        });
        assert!(match &test_file.instruments[4] {
            Instrument::FMSynth(s) => {
                assert!(match s.synth_params.mods[0] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[1] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[2] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[3] {
                    Mod::LFO(_) => true,
                    _ => false,
                });

                true
            }
            _ => false,
        });
        assert!(match &test_file.instruments[5] {
            Instrument::HyperSynth(s) => {
                assert!(match s.synth_params.mods[0] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[1] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[2] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[3] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert_eq!(s.scale, 0xFF);
                assert_eq!(s.chord[0], 0x01);
                assert_eq!(s.chord[6], 0x3C);

                true
            }
            _ => false,
        });
        assert!(match &test_file.instruments[6] {
            Instrument::MIDIOut(s) => {
                assert!(match s.mods[0] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.mods[1] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.mods[2] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert!(match s.mods[3] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                true
            }
            _ => false,
        });
        assert!(match &test_file.instruments[7] {
            Instrument::External(s) => {
                assert!(match s.synth_params.mods[0] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[1] {
                    Mod::AHDEnv(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[2] {
                    Mod::LFO(_) => true,
                    _ => false,
                });
                assert!(match s.synth_params.mods[3] {
                    Mod::LFO(_) => true,
                    _ => false,
                });

                assert_eq!(s.cca.cc, 1);
                assert_eq!(s.ccb.cc, 2);
                assert_eq!(s.ccd.cc, 4);
                true
            }
            _ => false,
        });
    }
}
