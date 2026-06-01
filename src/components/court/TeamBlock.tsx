import type { Team } from '@/types/court'
import { cn, formatTeamRank } from '@/lib/utils'
import { teamStyles, type TeamSide } from '@/lib/teamColors'
import { PlayerRow } from './PlayerRow'

type TeamBlockProps = {
  team: Team
  side: TeamSide
  label: string
  isWinner?: boolean
  highlighted?: boolean
  pointsChange?: number
  largeNames?: boolean
}

export function TeamBlock({
  team,
  side,
  label,
  isWinner,
  highlighted,
  pointsChange,
  largeNames,
}: TeamBlockProps) {
  const colors = teamStyles[side]
  const alignRight = side === 'team1'
  const showResult = isWinner || pointsChange !== undefined

  return (
    <div className="relative flex flex-1 flex-col gap-2">
      <div
        className={cn(
          'relative flex text-sm',
          alignRight ? 'flex-row-reverse justify-start text-right' : 'text-left',
        )}
      >
        <span className={cn('font-semibold uppercase tracking-wide', colors.label)}>
          {label}
        </span>
        <span
          className={cn(
            'tabular-nums text-muted-foreground',
            alignRight ? 'mr-2' : 'ml-2',
          )}
        >
          {formatTeamRank(team.rank)}
        </span>
      </div>

      <div
        className={cn(
          'relative flex flex-1 flex-col rounded-xl border-2 px-5 py-8',
          highlighted ? colors.blockFilled : colors.block,
        )}
      >
        {showResult && (
          <div
            className={cn(
              'absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-2',
              alignRight ? 'left-8' : 'right-8',
            )}
          >
            {isWinner && (
              <span className="text-5xl leading-none select-none" aria-hidden>
                🏆
              </span>
            )}
            {pointsChange !== undefined && (
              <span
                className={cn(
                  'text-xl font-semibold tabular-nums leading-none',
                  isWinner ? colors.label : 'text-muted-foreground',
                )}
              >
                {pointsChange > 0 ? `+${pointsChange}` : pointsChange}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center gap-1">
          <PlayerRow player={team.player1} align={alignRight ? 'right' : 'left'} large={largeNames} />
          <PlayerRow player={team.player2} align={alignRight ? 'right' : 'left'} large={largeNames} />
        </div>
      </div>
    </div>
  )
}
