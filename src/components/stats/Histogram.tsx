//import { GameStats } from '../../lib/localStorage'
import { GameStats } from '../../types/dna_0/zome_1'
import { Progress } from './Progress'

type Props = {
  gameStats: GameStats
  isLatestGame: boolean
  isGameWon: boolean
  numberOfGuessesMade: number
}

const isCurrentDayStatRow = (
  isLatestGame: boolean,
  isGameWon: boolean,
  numberOfGuessesMade: number,
  i: number
) => {
  return isLatestGame && isGameWon && numberOfGuessesMade === i + 1
}

export const Histogram = ({
  gameStats,
  isLatestGame,
  isGameWon,
  numberOfGuessesMade,
}: Props) => {
  const win_distribution = gameStats.win_distribution
  const maxValue = Math.max(...win_distribution, 1)

  return (
    <div className="justify-left m-2 columns-1 text-sm dark:text-white">
      {win_distribution.map((value, i) => (
        <Progress
          key={i}
          index={i}
          isCurrentDayStatRow={isCurrentDayStatRow(
            isLatestGame,
            isGameWon,
            numberOfGuessesMade,
            i
          )}
          size={90 * (value / maxValue)}
          label={String(value)}
        />
      ))}
    </div>
  )
}
