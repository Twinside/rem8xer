pub mod song;
pub mod eq;
pub mod fx;
pub mod instrument;
mod reader;
pub mod scale;
pub mod settings;
mod theme;
pub mod version;
mod remapper;

pub use fx::*;
pub use instrument::*;
pub use scale::*;
pub use settings::*;
pub use theme::*;
pub use version::*;

mod web;