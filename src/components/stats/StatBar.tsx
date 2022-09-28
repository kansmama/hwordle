import {
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  SUCCESS_RATE_TEXT,
  TOTAL_TRIES_TEXT,
} from '../../constants/strings'
//import { GameStats } from '../../lib/localStorage'
import { GameStats } from '../../types/dna_0/zome_1'

type Props = {
  gameStats: GameStats
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => {
  return (
    <div className="m-1 w-1/4 items-center justify-center dark:text-white">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  )
}

export const StatBar = ({ gameStats }: Props) => {
  return (
    <div className="my-2 flex justify-center">
      <StatItem label={TOTAL_TRIES_TEXT} value={gameStats.total_games} />
      <StatItem label={SUCCESS_RATE_TEXT} value={`${gameStats.success_rate}%`} />
      <StatItem label={CURRENT_STREAK_TEXT} value={gameStats.current_streak} />
      <StatItem label={BEST_STREAK_TEXT} value={gameStats.best_streak} />
    </div>
  )
}
