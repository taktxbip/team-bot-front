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
  confirmed?: boolean
  confettiSize?: ConfettiSize
  onSelectWinner?: (winnerKey: string) => void
  canSelectWinner?: boolean
  pendingWinnerKey?: string | null
}

export function CourtCard({
  court,
  confirmed,
  confettiSize,
  onSelectWinner,
  canSelectWinner = false,
  pendingWinnerKey = null,
}: CourtCardProps) {
  const team1Won = court.winner === 'team1'
  const team2Won = court.winner === 'team2'
  const highlightWinner = Boolean(confirmed)
  const selectable = canSelectWinner && Boolean(onSelectWinner) && !pendingWinnerKey
  const team1Key = getTeamWinnerKey(court.team1)
  const team2Key = getTeamWinnerKey(court.team2)

  return (
    <Card className="flex flex-col gap-0 md:h-full md:min-h-0">
      <CardHeader className="shrink-0 px-5 pb-4 pt-4">
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
