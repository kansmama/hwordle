import { MAX_CHALLENGES } from '../constants/settings'
import {
//  GameStats,
//  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'
import { InstalledAppInfo, AppWebsocket, Record, ActionHash } from '@holochain/client';
import { GameStats, UpdateGameStats } from '../types/dna_0/zome_1';
import { decode } from '@msgpack/msgpack';

// In stats array elements 0-5 are successes in 1-6 tries

export const addStatsForCompletedGame = async (
  count: number,
  client: AppWebsocket, 
  appInfo: InstalledAppInfo
) => {
  // Count is number of incorrect guesses before end.
  let stats:GameStats;
  stats = await loadStats (client,appInfo);
  stats.total_games += 1

  if (count >= MAX_CHALLENGES) {
    // A fail situation
    stats.current_streak = 0
    stats.games_failed += 1
  } else {
    stats.win_distribution[count] += 1
    stats.current_streak += 1

    if (stats.best_streak < stats.current_streak) {
      stats.best_streak = stats.current_streak
    }
  }

  stats.success_rate = getSuccessRate(stats)

   const cellData = await appInfo.cell_data;
   const cell_id = await cellData[0].cell_id;
   let statsHash: ActionHash;
  let statsHashString:string = String(localStorage.getItem("statsHashString"));
  if (statsHashString.length < 6) {
   let loadedStatsHash: ActionHash = await client.callZome({
   cap_secret: null,
   cell_id: cell_id,
   zome_name: "zome_1",
   fn_name: 'save_stats_to_local_storage',
   provenance: cell_id[1],
   payload: stats,
  }, 30000)
    if (loadedStatsHash) {
 localStorage.setItem("statsHashString",loadedStatsHash.toString());
    }
  return stats
  } else {
  //update stats code here
  statsHash = Uint8Array.from(statsHashString.split(',').map(x=>parseInt(x,10)));
   const updatedGameStats: UpdateGameStats = {
	  original_action_hash: statsHash,
	  updated_game_stats: stats
        };
   let loadedStatsHash: ActionHash = await client.callZome({
   cap_secret: null,
   cell_id: cell_id,
   zome_name: "zome_1",
   fn_name: 'update_stats_to_local_storage',
   provenance: cell_id[1],
   payload: updatedGameStats,
  }, 30000)
  //console.log ("in cHappLoadGame - code after callZome" + todayStart);
    if (loadedStatsHash) {
    console.log ("in if loadedStatsHash stats");
  localStorage.setItem("statsHashString",loadedStatsHash.toString());
    console.log("loadedStatsHashString is " +  loadedStatsHash.toString());
    }
  return stats
  }
}

const defaultStats: GameStats = {
  win_distribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
  games_failed: 0,
  current_streak: 0,
  best_streak: 0,
  total_games: 0,
  success_rate: 0,
}

export const loadStats = async (client: AppWebsocket, appInfo: InstalledAppInfo) => {
  let statsHash: ActionHash;
  let statsHashString:string = String(localStorage.getItem("statsHashString"));
  console.log("statsHashString is " + statsHashString + " length is " + statsHashString.length);
  if (statsHashString.length > 6) {
  /*console.log("inside loadStats in if statsHashString is "+statsHashString);
  return defaultStats
  }*/
  console.log("statsHashString length > 6");
  statsHash = Uint8Array.from(statsHashString.split(',').map(x=>parseInt(x,10)));
   const cellData = await appInfo.cell_data;
   const cell_id = await cellData[0].cell_id;
   try {
	   const record: Record | undefined = await client.callZome({
	   cap_secret: null,
	   cell_id: cell_id,
	   zome_name: "zome_1",
	   fn_name: 'load_stats_from_local_storage',
	   provenance: cell_id[1],
	   payload: statsHash,
	  }, 30000)

  //console.log ("in cHappLoadGame - code after callZome" + todayStart);
    if (record) {
    console.log ("in if record stats");
    const loadedStats = decode((record.entry as any).Present.entry) as GameStats;
    console.log("stats loaded from Holochain: total_games: "+loadedStats.total_games);
    if (loadedStats.total_games == 0) {
    localStorage.setItem("statsHashString","");
    statsHashString = String(localStorage.getItem("statsHashString"));
  console.log("while loading statsHashString is " + statsHashString + " length is " + statsHashString.length);
    }
  return loadedStats
  	} else {
  	localStorage.setItem("statsHashString","");
  	return defaultStats
  	}
    } catch (err) {
	  console.log("error in calling zome" + err);
	  return defaultStats;
	  }
  } else {
  return defaultStats
  }
}

export const loadDefaultStats = () => {
  	console.log("inside loadDefaultStats");
  	return defaultStats
}

const getSuccessRate = (gameStats: GameStats) => {
  const { total_games, games_failed } = gameStats

  return Math.round(
    (100 * (total_games - games_failed)) / Math.max(total_games, 1)
  )
}
