use crate::reader::*;
use super::common::SynthParams;
use super::common::TranspEq;
use super::midi::ControlChange;
use super::CommandPack;
use super::ParameterGatherer;
use super::Version;

#[derive(PartialEq, Debug, Clone)]
pub struct ExternalInst {
    pub number: u8,
    pub name: String,
    pub transp_eq: TranspEq,
    pub table_tick: u8,
    pub synth_params: SynthParams,

    pub input: u8,
    pub port: u8,
    pub channel: u8,
    pub bank: u8,
    pub program: u8,
    pub cca: ControlChange,
    pub ccb: ControlChange,
    pub ccc: ControlChange,
    pub ccd: ControlChange,
}

const EXTERNAL_INST_COMMANDS : [&'static str; CommandPack::BASE_INSTRUMENT_COMMAND_COUNT + 2] =
    [
      "VOL",
      "PIT",
      "MPB",
      "MPG",
      "CCA",
      "CCB",
      "CCC",
      "CCD",
      "FLT",
      "CUT",
      "RES",
      "AMP",
      "LIM",
      "PAN",
      "DRY",
      
      "SCH",
      "SDL",
      "SRV",

      // EXTRA
      "ADD",
      "CHD"
    ];

const DESTINATIONS : [&'static str; 0] = [];

impl ExternalInst {
    const MOD_OFFSET: usize = 22;

    pub fn command_name(&self, _ver: Version) -> &'static [&'static str] {
        &EXTERNAL_INST_COMMANDS
    }

    pub fn destination_names(&self, _ver: Version) -> &'static [&'static str] {
        &DESTINATIONS
    }

    pub fn describe<PG : ParameterGatherer>(&self, pg: &mut PG, ver: Version) {
        pg.str("NAME", &self.name);
        pg.bool("TRANSPOSE", self.transp_eq.transpose);
        pg.hex("EQ", self.transp_eq.eq);
        pg.hex("TICS", self.table_tick);
        pg.hex("PORT", self.port);
        pg.hex("CHANNEL", self.channel);
        pg.hex("BANK", self.bank);
        pg.hex("PROGRAM", self.program);
        self.cca.describe(&mut pg.nest("CCA"));
        self.ccb.describe(&mut pg.nest("CCB"));
        self.ccc.describe(&mut pg.nest("CCC"));
        self.ccd.describe(&mut pg.nest("CCD"));
        self.synth_params.describe(pg);
        self.synth_params.describe_modulators(pg, self.destination_names(ver));
    }

    pub fn write(&self, w: &mut Writer) {
        w.write_string(&self.name, 12);
        w.write(self.transp_eq.into());
        w.write(self.table_tick);
        w.write(self.synth_params.volume);
        w.write(self.synth_params.pitch);
        w.write(self.synth_params.fine_tune);

        w.write(self.input);
        w.write(self.port);
        w.write(self.channel);
        w.write(self.bank);
        w.write(self.program);

        self.cca.write(w);
        self.ccb.write(w);
        self.ccc.write(w);
        self.ccd.write(w);

        self.synth_params.write(w, ExternalInst::MOD_OFFSET);
    }

    pub fn from_reader(reader: &mut Reader, number: u8) -> M8Result<Self> {

        let name = reader.read_string(12);
        let transp_eq = reader.read().into();
        let table_tick = reader.read();
        let volume = reader.read();
        let pitch = reader.read();
        let fine_tune = reader.read();

        let input = reader.read();
        let port = reader.read();
        let channel = reader.read();
        let bank = reader.read();
        let program = reader.read();
        let cca = ControlChange::from_reader(reader)?;
        let ccb = ControlChange::from_reader(reader)?;
        let ccc = ControlChange::from_reader(reader)?;
        let ccd = ControlChange::from_reader(reader)?;

        let synth_params =
            SynthParams::from_reader3(reader, volume, pitch, fine_tune, ExternalInst::MOD_OFFSET)?;

        Ok(ExternalInst {
            number,
            name,
            transp_eq,
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
}
