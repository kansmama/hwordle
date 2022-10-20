use hdi::prelude::*;

mod stored_game_state;
pub use stored_game_state::StoredGameState;
pub use stored_game_state::GameStats;


#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
#[entry_def()]
StoredGameState(StoredGameState),
GameStats(GameStats)
}

#[hdk_extern]
pub fn validate(_op: Op) -> ExternResult<ValidateCallbackResult> {
  Ok(ValidateCallbackResult::Valid)
}
