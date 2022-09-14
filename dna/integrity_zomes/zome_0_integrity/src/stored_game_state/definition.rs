use hdi::prelude::*;
//use chrono::prelude::*;
//use chrono::offset::LocalResult;





#[hdk_entry_helper]
#[derive(Clone)]
pub struct StoredGameState {
  pub local: String,
  pub guesses: Vec<String>,
  pub solution: String,
}
