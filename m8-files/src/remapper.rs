use arr_macro::arr;

use crate::{song::Song, Instrument};


fn make_mapping<const C : usize>() -> [u8; C] {
    let mut arr = [0 as u8; C];
    for i in 0 .. arr.len() {
        arr[i] = i as u8;
    }

    arr
}

pub struct EqMapping {
    /// Mapping from the "from" song eq index to the "to" song
    /// eq index
    pub mapping: [u8; Song::N_INSTRUMENT_EQS],

    /// Eqs to be moved during the remapping
    /// index in the "from" song
    pub to_move: Vec<u8>
}

impl EqMapping {
    pub fn print(&self) -> String {
        let mut acc = String::new();

        for e in self.to_move.iter() {
            let new_ix = self.mapping[*e as usize];
            acc = format!("{acc} Eq {e} => {new_ix}\n");
        }

        acc
    }
}

impl Default for EqMapping {
    fn default() -> Self {
        Self { mapping: make_mapping(), to_move: vec![] }
    }
}

/// For every instrument, it's destination instrument
pub struct InstrumentMapping {
    /// Mapping from the "from" song instrument index to the "to" 
    /// song instrument index
    pub mapping: [u8; Song::N_INSTRUMENTS],

    /// Instruments to be moved during the remapping
    /// index in the "from" song
    pub to_move: Vec<u8>
}

impl InstrumentMapping {
    pub fn print(&self) -> String {
        let mut acc = String::new();

        for e in self.to_move.iter() {
            let new_ix = self.mapping[*e as usize];
            acc = format!("{acc} instr {e} => {new_ix}\n");
        }

        acc
    }
}

impl Default for InstrumentMapping {
    fn default() -> Self {
        Self { mapping: make_mapping(), to_move: vec![] }
    }
}

pub struct PhraseMapping {
    /// Mapping from the "from" song phrase index to
    /// the "to" phrase index
    pub mapping: [u8; Song::N_PHRASES],

    /// Phrases to be moved during the remapping
    /// index in the "from" song
    pub to_move: Vec<u8>
}

impl PhraseMapping {
    pub fn print(&self) -> String {
        let mut acc = String::new();

        for e in self.to_move.iter() {
            let new_ix = self.mapping[*e as usize];
            acc = format!("{acc} phrase {e} => {new_ix}\n");
        }

        acc
    }
}

impl Default for PhraseMapping {
    fn default() -> Self {
        Self { mapping: make_mapping(), to_move: vec![] }
    }
}

pub struct ChainMapping {
    pub mapping: [u8; Song::N_CHAINS],
    pub to_move: Vec<u8>
}

impl ChainMapping {
    pub fn print(&self) -> String {
        let mut acc = String::new();

        for e in self.to_move.iter() {
            let new_ix = self.mapping[*e as usize];
            acc = format!("{acc} chain {e} => {new_ix}\n");
        }

        acc
    }
}


impl Default for ChainMapping {
    fn default() -> Self {
        Self { mapping: make_mapping(), to_move: vec![] }
    }
}

pub struct Remapper {
    eq_mapping: EqMapping,
    instrument_mapping: InstrumentMapping,
    phrase_mapping: PhraseMapping,
    chain_mapping: ChainMapping,
}

/// Iter on all instruments to find allocated Eqs
fn find_referenced_eq(song: &Song) -> [bool; Song::N_INSTRUMENT_EQS] {
    // flags on eqs in "to"
    let mut allocated_eqs = arr![false; 32];

    for instr in &song.instruments {
        match instr.eq() {
            None => {}
            Some(eq) => {
                let equ = eq as usize;
                if equ < allocated_eqs.len() {
                    allocated_eqs[equ] = true
                }
            }
        }
    }

    // TODO: track eqi command....

    allocated_eqs
}

fn find_referenced_phrases(song: &Song) -> [bool; Song::N_PHRASES] {
    let mut allocated_phrases = arr![false; 255];
    for chain in &song.chains {
        for step in &chain.steps {
            let phrase = step.phrase as usize;
            if phrase < Song::N_PHRASES {
                allocated_phrases[phrase] = true;
            }
        }
    }

    for (phrase_id, phrase) in song.phrases.iter().enumerate() {
        if !phrase.is_empty() {
            allocated_phrases[phrase_id] = true;
        }
    }

    allocated_phrases 
}

fn find_referenced_chains(song: &Song) -> [bool; Song::N_CHAINS] {
    let mut allocated_chains = arr![false; 255];
    for chain in song.song.steps.iter() {
        let chain = *chain as usize;
        if chain < Song::N_CHAINS {
            allocated_chains[chain] = true;
        }
    }

    for (i, chain) in song.chains.iter().enumerate() {
        if !chain.is_empty() {
            allocated_chains[i] = true
        }
    }

    allocated_chains 
}

impl Remapper {
    pub fn out_chain(&self, chain_id: u8) -> u8{
        self.chain_mapping.mapping[chain_id as usize]
    }

    pub fn print(&self) -> String {
        let eq = self.eq_mapping.print();
        let instr = self.instrument_mapping.print();
        let phrase = self.phrase_mapping.print();
        let chain = self.chain_mapping.print();
        format!("{eq}\n{instr}\n{phrase}\n{chain}")
    }

    fn allocate_chains<'a, IT>(
        from_song: &Song,
        to_song: &Song,
        phrase_mapping: &PhraseMapping,
        from_chains_ids: IT) -> Result<ChainMapping, String> 

        where IT: Iterator<Item=&'a u8> {

        let mut seen_chain : [bool; Song::N_CHAINS] = arr![false; 255];
        let mut allocated_chains = find_referenced_chains(to_song);
        let mut mapping : [u8; Song::N_CHAINS] = make_mapping();
        let mut to_move = vec![];

        for chain_id in from_chains_ids {
            let chain_id = *chain_id as usize;
            if chain_id >= Song::N_CHAINS || seen_chain[chain_id] { continue; }

            seen_chain[chain_id] = true;
            let to_chain =
                from_song.chains[chain_id].map(phrase_mapping);

            match to_song.chains.iter().position(|c| c.steps == to_chain.steps) {
                Some(c) => mapping[chain_id] = c as u8,
                None => {
                    match allocated_chains.iter().position(|a| !a) {
                        None => return Err(format!("No more available chain slots for chain {chain_id}")),
                        Some(free_slot) => {
                            allocated_chains[free_slot] = true;
                            mapping[chain_id] = free_slot as u8;
                            to_move.push(chain_id as u8);
                        }
                    }
                }
            }
        }

        Ok(ChainMapping {
            mapping,
            to_move
        })
    }


    fn allocate_phrases<'a, IT>(
        from_song: &Song,
        to_song: &Song,
        instrument_mapping: &InstrumentMapping,
        from_chains_ids: IT) -> Result<PhraseMapping, String>
      where
        IT: Iterator<Item=&'a u8> {
        let mut allocated_phrases = find_referenced_phrases(to_song);

        let mut seen_phrase : [bool; Song::N_PHRASES] = arr![false; 0xFF];
        let mut phrase_mapping: [u8; Song::N_PHRASES] = arr![0 as u8; 0xFF];

        let mut to_move= vec![];

        for chain_id in from_chains_ids {
            let from_chain = &from_song.chains[*chain_id as usize];

            for chain_step in from_chain.steps.iter() {
                let phrase_ix = chain_step.phrase as usize;

                if phrase_ix >= Song::N_PHRASES || seen_phrase[phrase_ix]{
                    continue;
                }

                seen_phrase[phrase_ix] = true;
                let phrase = from_song.phrases[phrase_ix].map_instruments(&instrument_mapping);
                match to_song.phrases.iter().position(|p| p.steps == phrase.steps) {
                    Some(known) => phrase_mapping[phrase_ix] = known as u8,
                    None => {
                        match allocated_phrases.iter().position(|v| !v) {
                            None => return Err(format!("No more available phrase slots for phrase {phrase_ix}")),
                            Some(slot) => {
                                to_move.push(phrase_ix as u8);
                                allocated_phrases[slot] = true;
                                phrase_mapping[phrase_ix] = slot as u8;
                            }
                        }
                    }
                }
            }
        }

        Ok(PhraseMapping { mapping: phrase_mapping, to_move })
    }

    /// Find location in destination song for EQ and instruments
    fn allocate_eq_and_instruments<'a, IT>(from_song: &Song, to_song: &Song, from_chains_ids: IT)
        -> Result<(EqMapping, InstrumentMapping), String>
      where
        IT: Iterator<Item=&'a u8> {

        // flags on instruments in "from"
        let mut instrument_flags : [bool; Song::N_INSTRUMENTS] = arr![false; 128];
        // flags on eqsin "from"
        let mut eq_flags : [bool; Song::N_INSTRUMENT_EQS] = arr![false; 32];
        // flags on eqs in "to"
        let mut allocated_eqs = find_referenced_eq(to_song);
        let mut instrument_mapping = InstrumentMapping::default();
        // eqs from "from" to "to"
        let mut eq_mapping = EqMapping::default();

        for chain_id in from_chains_ids {
            let from_chain = &from_song.chains[*chain_id as usize];

            for chain_step in &from_chain.steps {
                let phrase_id = chain_step.phrase as usize;
                if phrase_id >= Song::N_PHRASES { continue; }

                let phrase = &from_song.phrases[phrase_id];
        
                for step in &phrase.steps {
                    let instr_ix = step.instrument as usize;
        
                    // out of bound instrument, dont bother or if already allocated
                    if instr_ix >= Song::N_INSTRUMENTS || instrument_flags[instr_ix] {
                        continue;
                    }
        
                    let mut instr = from_song.instruments[instr_ix].clone();
        
                    // first we search the new EQ
                    if let Some(equ) = instr.eq() {
                        let equ = equ as usize;
        
                        if equ < Song::N_INSTRUMENT_EQS && !eq_flags[equ] {
                            eq_flags[equ as usize] = true;
                            let from_eq = &from_song.eqs[equ];
                            // try to find an already exisint Eq with same parameters
                            match to_song.eqs.iter().position(|to_eq| to_eq == from_eq) {
                                Some(eq_idx) if (eq_idx as usize) < Song::N_INSTRUMENT_EQS =>
                                    eq_mapping.mapping[equ] = eq_idx as u8,
                                Some(_) | None => {
                                    match allocated_eqs.iter().position(|alloc| !alloc) {
                                        None => return Err(format!("No more available eqs for instrument {instr_ix}")),
                                        Some(eq_slot) => {
                                            allocated_eqs[eq_slot] = true;
                                            eq_mapping.mapping[equ] = eq_slot as u8;
                                            eq_mapping.to_move.push(equ as u8);
                                        }
                                    }
                                }
                            }
        
                            // finally update our Eq in our local copy
                            instr.set_eq(eq_mapping.mapping[equ]);
                        }
                    }
        
                    instrument_flags[instr_ix] = true;
                    match to_song.instruments.iter().position(|i| i == &instr) {
                        // horray we have a matching instrument, reuse it
                        Some(to_instr_ix) =>
                            instrument_mapping.mapping[instr_ix] = to_instr_ix as u8,
                        // no luck, allocate a fresh one
                        None => {
                            match to_song.instruments.iter().position(|i| i == &Instrument::None) {
                                None => return Err(format!("No more available instrument slots for instrument {instr_ix}")),
                                Some(to_instr_ix) => {
                                    instrument_mapping.mapping[instr_ix] = to_instr_ix as u8;
                                    instrument_mapping.to_move.push(instr_ix as u8)
                                }
                            }
                        }
                    }
                }
            }
        }
     
        Ok((eq_mapping, instrument_mapping))
    }

  pub fn create<'a, IT>(from_song: &Song, to_song: &Song, chains: IT) -> Result<Remapper, String>
    where
      IT: Iterator<Item=&'a u8> {
    
    let chain_vec : Vec<u8> = chains.map(|v| *v).collect();

    // eqs from "from" to "to"
    let (eq_mapping, instrument_mapping) =
        Remapper::allocate_eq_and_instruments(from_song, to_song, chain_vec.iter())?;
    let phrase_mapping =
        Remapper::allocate_phrases(from_song, to_song, &instrument_mapping, chain_vec.iter())?;

    let chain_mapping =
        Remapper::allocate_chains(from_song, to_song, &phrase_mapping, chain_vec.iter())?;

    Ok(Self { eq_mapping, instrument_mapping, phrase_mapping, chain_mapping })
  }

  /// apply the reampping, cannot fail once mapping has been created
  pub fn apply(&self, from: &Song, to: &mut Song) {
    for equ in self.eq_mapping.to_move.iter() {
        let equ = *equ as usize;
        let to_index = self.eq_mapping.mapping[equ];
        to.eqs[to_index as usize] = from.eqs[equ].clone();
    }

    for instr_id in self.instrument_mapping.to_move.iter() {
        let instr_id = *instr_id as usize;
        let to_index = self.instrument_mapping.mapping[instr_id] as usize;
        let mut instr = from.instruments[instr_id].clone();

        if let Some(eq) = instr.eq() {
            let eq = eq as usize;
            if eq < Song::N_INSTRUMENT_EQS {
                instr.set_eq(self.eq_mapping.mapping[eq]);
            }
        }

        to.tables[to_index] = from.tables[instr_id].clone();
        to.instruments[to_index] = instr;
    }

    for phrase_id in self.phrase_mapping.to_move.iter() {
        let phrase_id = *phrase_id as usize;
        let to_index = self.phrase_mapping.mapping[phrase_id];
        to.phrases[to_index as usize] =
            from.phrases[phrase_id].map_instruments(&self.instrument_mapping);
    }

    for chain_id in self.chain_mapping.to_move.iter() {
        let chain_id = *chain_id as usize;
        let to_index = self.chain_mapping.mapping[chain_id];
        to.chains[to_index as usize] =
            from.chains[chain_id].map(&self.phrase_mapping);
    }
  }
}