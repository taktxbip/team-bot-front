import { cn } from '@/lib/utils'
import { teamStyles } from '@/lib/teamColors'

type WinProbabilityBarProps = {
  team1Probability: number
  team2Probability: number
}

export function WinProbabilityBar({
  team1Probability,
  team2Probability,
}: WinProbabilityBarProps) {
  return (
    <div className="shrink-0 space-y-2">
      <div className="flex items-center justify-between text-base tabular-nums">
        <span className={cn('font-semibold', teamStyles.team1.label)}>
          {team1Probability}%
        </span>
        <span className="text-sm text-muted-foreground">Win probability</span>
        <span className={cn('font-semibold', teamStyles.team2.label)}>
          {team2Probability}%
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('transition-all', teamStyles.team1.bar)}
          style={{ width: `${team1Probability}%` }}
        />
        <div
          className={cn('transition-all', teamStyles.team2.bar)}
          style={{ width: `${team2Probability}%` }}
        />
      </div>
    </div>
  )
}
