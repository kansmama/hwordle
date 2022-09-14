import { ActionHash } from '@holochain/client';


export interface StoredGameState {
  local: string;
  guesses: string[];
  solution: string;
}

export interface UpdateStoredGameState {
  original_action_hash: ActionHash;
  updated_stored_game_state: StoredGameState;
}
