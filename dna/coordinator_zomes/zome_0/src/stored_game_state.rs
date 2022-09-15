use hdk::prelude::*;
use zome_0_integrity::StoredGameState;
use zome_0_integrity::EntryTypes;



#[hdk_extern]
pub fn get_test(s: String) -> ExternResult<String> {
  let a: String =  "testconnecth".to_string();
  let b: String =  "noconnecth".to_string();
  if s=="connecth" {
  Result::Ok(a)}
  else { Result::Ok(b)}
}

#[hdk_extern]
pub fn load_game_state_from_local_storage(action_hash: ActionHash) -> ExternResult<Option<Record>> {
  get(action_hash, GetOptions::default())
}


#[hdk_extern]
pub fn save_game_to_local_storage(game_state: StoredGameState) -> ExternResult<ActionHash> {
  create_entry(&EntryTypes::StoredGameState(game_state.clone()))
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateStoredGameState {
  original_action_hash: ActionHash,
  updated_stored_game_state: StoredGameState
}

#[hdk_extern]
pub fn update_game_to_local_storage(input: UpdateStoredGameState) -> ExternResult<ActionHash> {
  update_entry(input.original_action_hash, &input.updated_stored_game_state)
}

