use hdk::prelude::*;
use zome_1_integrity::GameStats;
use zome_1_integrity::EntryTypes;



#[hdk_extern]
pub fn get_stat_test(s: String) -> ExternResult<String> {
  let a: String =  "testconnects".to_string();
  let b: String =  "noconnects".to_string();
  if s=="connects" {
  Result::Ok(a)}
  else { Result::Ok(b)}
}

#[hdk_extern]
pub fn load_stats_from_local_storage(action_hash: ActionHash) -> ExternResult<Option<Record>> {
  get(action_hash, GetOptions::default())
}

#[hdk_extern]
pub fn save_stats_to_local_storage(game_stats: GameStats) -> ExternResult<ActionHash> {
  create_entry(&EntryTypes::GameStats(game_stats.clone()))
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateGameStats {
  original_action_hash: ActionHash,
  updated_game_stats: GameStats
}

#[hdk_extern]
pub fn update_stats_to_local_storage(input: UpdateGameStats) -> ExternResult<ActionHash> {
  update_entry(input.original_action_hash, &input.updated_game_stats)
}
