use std::env;
use std::error::Error;
use std::fs::File;

use m8_file_parser::*;

fn main() {
    match run() {
        Ok(_) => (),
        Err(err) => println!("Error: {}", err),
    }
}

fn run() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();

    let mut f = File::open(&args[1])?;
    let instr = Instrument::read(&mut f)?;

    dbg!(&instr.instrument);

    match &instr.eq {
        None => {}
        Some(eq) => {
            dbg!(eq);
        }
    };

    Ok(())
}
