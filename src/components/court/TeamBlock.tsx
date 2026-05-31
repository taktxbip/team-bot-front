import type { Team } from '@/types/court'
import { cn, formatTeamRank } from '@/lib/utils'
import { teamStyles, type TeamSide } from '@/lib/teamColors'
import { PlayerRow } from './PlayerRow'

type TeamBlockProps = {
  team: Team
  side: TeamSide
  label: string
}

export function TeamBlock({ team, side, label }: TeamBlockProps) {
  const colors = teamStyles[side]
  const alignRight = side === 'team1'

  return (
    <div className={cn('relative flex flex-1 flex-col rounded-xl border-2 pt-16 pb-8 px-5', colors.block)}>
      <div
        className={cn(
          'absolute top-5 text-sm',
          alignRight ? 'right-5 text-right' : 'left-5 text-left',
        )}
      >
        <span className={cn('font-semibold uppercase tracking-wide', colors.label)}>
          {label}
        </span>
        <span className="ml-2 tabular-nums text-muted-foreground">
          {formatTeamRank(team.rank)}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-1">
        <PlayerRow player={team.player1} align={alignRight ? 'right' : 'left'} />
        <PlayerRow player={team.player2} align={alignRight ? 'right' : 'left'} />
      </div>
    </div>
  )
}
