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

#[hdk_entry_helper]
#[derive(Clone)]
pub struct GameStats {
  pub win_distribution: Vec<i32>,
  pub games_failed: i32,
  pub current_streak: i32,
  pub best_streak: i32,
  pub total_games: i32,
  pub success_rate: i32,
}
