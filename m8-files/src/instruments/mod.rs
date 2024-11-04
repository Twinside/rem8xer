use crate::reader::*;
use crate::version::*;
use external_inst::ExternalInst;
use fmsynth::FMSynth;
use hypersynth::HyperSynth;
use macrosynth::MacroSynth;
use midi::MIDIOut;
use sampler::Sampler;
use wavsynth::WavSynth;

pub mod common;
pub mod modulator;
pub mod external_inst;
pub mod midi;
pub mod macrosynth;
pub mod fmsynth;
pub mod hypersynth;
pub mod sampler;
pub mod wavsynth;

#[derive(PartialEq, Debug, Clone, Default)]
pub enum Instrument {
    WavSynth(WavSynth),
    MacroSynth(MacroSynth),
    Sampler(Sampler),
    MIDIOut(MIDIOut),
    FMSynth(FMSynth),
    HyperSynth(HyperSynth),
    External(ExternalInst),
    #[default]
    None
}

pub const INSTRUMENT_MEMORY_SIZE : usize = 215;
// const MOD_OFFSET : usize = 0x3B;

impl Instrument {
    pub fn is_empty(&self) -> bool {
        match self {
            Instrument::None => true,
            _ => false
        }
    }

    pub fn write(&self, w: &mut Writer) {
        match self {
            Instrument::WavSynth(ws)     => { w.write(0); ws.write(w); }
            Instrument::MacroSynth(ms) => { w.write(1); ms.write(w); }
            Instrument::Sampler(s)        => { w.write(2); s.write(w); }
            Instrument::MIDIOut(mo)       => { w.write(3); mo.write(w); }
            Instrument::FMSynth(fs)       => { w.write(4); fs.write(w); }
            Instrument::HyperSynth(hs) => { w.write(5); hs.write(w); }
            Instrument::External(ex) => { w.write(6); ex.write(w); }
            Instrument::None => w.write(0xFF),
        }
    }

    pub fn name(&self) -> Option<&str> {
        match self {
            Instrument::WavSynth(ws)     => Some(&ws.name),
            Instrument::MacroSynth(ms) => Some(&ms.name),
            Instrument::Sampler(s)        => Some(&s.name),
            Instrument::MIDIOut(_)                  => None,
            Instrument::FMSynth(fs)       => Some(&fs.name),
            Instrument::HyperSynth(hs) => Some(&hs.name),
            Instrument::External(ex) => Some(&ex.name),
            Instrument::None => None,
        }
    }

    pub fn eq(&self) -> Option<u8> {
        match self {
            Instrument::WavSynth(ws)     => Some(ws.transp_eq.eq),
            Instrument::MacroSynth(ms) => Some(ms.transp_eq.eq),
            Instrument::Sampler(s)        => Some(s.transp_eq.eq),
            Instrument::MIDIOut(_)                  => None,
            Instrument::FMSynth(fs)       => Some(fs.transp_eq.eq),
            Instrument::HyperSynth(hs) => Some(hs.transp_eq.eq),
            Instrument::External(ex) => Some(ex.transp_eq.eq),
            Instrument::None => None,
        }
    }

    pub fn set_eq(&mut self, eq_ix: u8) {
        match self {
            Instrument::WavSynth(ws)     => ws.transp_eq.set_eq(eq_ix),
            Instrument::MacroSynth(ms) => ms.transp_eq.set_eq(eq_ix),
            Instrument::Sampler(s)        => s.transp_eq.set_eq(eq_ix),
            Instrument::MIDIOut(_)                      => {},
            Instrument::FMSynth(fs)       => fs.transp_eq.set_eq(eq_ix),
            Instrument::HyperSynth(hs) => hs.transp_eq.set_eq(eq_ix),
            Instrument::External(ex) => ex.transp_eq.set_eq(eq_ix),
            Instrument::None => {},
        }
    }

    pub fn read(reader: &mut impl std::io::Read) -> M8Result<Self> {
        let mut buf: Vec<u8> = vec![];
        reader.read_to_end(&mut buf).unwrap();
        let len = buf.len();
        let mut reader = Reader::new(buf);

        if len < INSTRUMENT_MEMORY_SIZE + Version::SIZE {
            return Err(ParseError(
                "File is not long enough to be a M8 Instrument".to_string(),
            ));
        }

        let version = Version::from_reader(&mut reader)?;
        Self::from_reader(&mut reader, 0, version)
    }

    pub fn from_reader(reader: &mut Reader, number: u8, version: Version) -> M8Result<Self> {
        let start_pos = reader.pos();
        let kind = reader.read();

        let instr = match kind {
            0x00 => Self::WavSynth(WavSynth::from_reader(reader, number, version)?),
            0x01 => Self::MacroSynth(MacroSynth::from_reader(reader, number, version)?),
            0x02 => Self::Sampler(Sampler::from_reader(reader, start_pos, number, version)?),
            0x03 => Self::MIDIOut(MIDIOut::from_reader(reader, number, version)?),
            0x04 => Self::FMSynth(FMSynth::from_reader(reader, number, version)?),
            0x05 if version.at_least(3, 0) => Self::HyperSynth(HyperSynth::from_reader(reader, number)?),
            0x06 if version.at_least(3, 0) => Self::External(ExternalInst::from_reader(reader, number)?),
            0xFF => Self::None,
            _ => return Err(ParseError(format!("Instrument type {} not supported", kind))),
        };

        reader.set_pos(start_pos + INSTRUMENT_MEMORY_SIZE);

        Ok(instr)
    }
}
