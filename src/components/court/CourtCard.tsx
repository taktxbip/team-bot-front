import type { Court } from '@/types/court'
import type { ConfettiSize } from '@/lib/teamConfetti'
import { getTeamPointsChange, getTeamWinnerKey } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TeamBlock } from './TeamBlock'
import { WinProbabilityBar } from './WinProbabilityBar'

type CourtCardProps = {
  court: Court
  confettiSize?: ConfettiSize
  onSelectWinner?: (winnerKey: string) => void
  canSelectWinner?: boolean
  pendingWinnerKey?: string | null
  /** Slam order index for team1 (null = no stamp). */
  team1StampIndex?: number | null
  /** Slam order index for team2 (null = no stamp). */
  team2StampIndex?: number | null
  stampIntroDelayMs?: number
  stampStaggerMs?: number
  onStampImpact?: () => void
  /** Confirm/save this court's result (fired from the winner team button). */
  onConfirmCourt?: (courtId: string) => void
}

export function CourtCard({
  court,
  confettiSize,
  onSelectWinner,
  canSelectWinner = false,
  pendingWinnerKey = null,
  team1StampIndex = null,
  team2StampIndex = null,
  stampIntroDelayMs = 1000,
  stampStaggerMs = 213,
  onStampImpact,
  onConfirmCourt,
}: CourtCardProps) {
  const team1Won = court.winner === 'team1'
  const team2Won = court.winner === 'team2'
  const highlightWinner = court.confirmed
  const selectable = canSelectWinner && Boolean(onSelectWinner) && !pendingWinnerKey
  const canConfirm = Boolean(onConfirmCourt) && !court.confirmed
  const team1Key = getTeamWinnerKey(court.team1)
  const team2Key = getTeamWinnerKey(court.team2)
  const team1Stamp = court.team1.stamp
  const team2Stamp = court.team2.stamp
  const courtNumber = court.name.match(/\d+/)?.[0] ?? court.name

  return (
    <Card className="@container relative flex flex-col gap-0 md:h-full md:min-h-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none text-[min(40rem,60cqmin)] font-black leading-none text-foreground/5"
      >
        {courtNumber}
      </div>
      <CardHeader className="relative shrink-0 px-5 pb-4 pt-4">
        <CardTitle className="text-2xl font-semibold">{court.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-5 pt-1 md:min-h-0 md:flex-1">
        <div className="flex items-stretch gap-4 md:min-h-0 md:flex-1">
          <TeamBlock
            team={court.team1}
            side="team1"
            label="Team 1"
            isWinner={team1Won}
            highlighted={highlightWinner && team1Won}
            pointsChange={getTeamPointsChange(court.winner, 'team1', court.pointsChange)}
            confettiSize={confettiSize}
            selectable={selectable}
            loading={pendingWinnerKey === team1Key}
            onSelect={() => onSelectWinner?.(team1Key)}
            stamp={team1Stamp}
            stampSlamDelayMs={
              team1StampIndex != null
                ? stampIntroDelayMs + team1StampIndex * stampStaggerMs
                : 0
            }
            onStampImpact={team1Stamp ? onStampImpact : undefined}
            onConfirm={
              team1Won && canConfirm ? () => onConfirmCourt?.(court.id) : undefined
            }
          />
          <div className="flex shrink-0 flex-col gap-2">
            <div className="relative text-sm opacity-0" aria-hidden>
              vs
            </div>
            <div className="flex flex-1 items-center text-xl font-semibold text-muted-foreground">
              vs
            </div>
          </div>
          <TeamBlock
            team={court.team2}
            side="team2"
            label="Team 2"
            isWinner={team2Won}
            highlighted={highlightWinner && team2Won}
            pointsChange={getTeamPointsChange(court.winner, 'team2', court.pointsChange)}
            confettiSize={confettiSize}
            selectable={selectable}
            loading={pendingWinnerKey === team2Key}
            onSelect={() => onSelectWinner?.(team2Key)}
            stamp={team2Stamp}
            stampSlamDelayMs={
              team2StampIndex != null
                ? stampIntroDelayMs + team2StampIndex * stampStaggerMs
                : 0
            }
            onStampImpact={team2Stamp ? onStampImpact : undefined}
            onConfirm={
              team2Won && canConfirm ? () => onConfirmCourt?.(court.id) : undefined
            }
          />
        </div>
        <WinProbabilityBar
          team1Probability={court.team1.winProbability}
          team2Probability={court.team2.winProbability}
        />
      </CardContent>
    </Card>
  )
}
