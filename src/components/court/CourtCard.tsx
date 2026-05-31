import type { Court } from '@/types/court'
import { getTeamPointsChange } from '@/lib/utils'
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
  largeNames?: boolean
}

export function CourtCard({ court, largeNames }: CourtCardProps) {
  const team1Won = court.winner === 'team1'
  const team2Won = court.winner === 'team2'

  return (
    <Card className="flex h-full min-h-0 flex-col">
      <CardHeader className="shrink-0 border-b px-5">
        <CardTitle className="text-2xl font-semibold">{court.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-5 px-5 pt-5">
        <div className="flex min-h-0 flex-1 items-stretch gap-4">
          <TeamBlock
            team={court.team1}
            side="team1"
            label="Team 1"
            isWinner={team1Won}
            pointsChange={getTeamPointsChange(court.winner, 'team1', court.pointsChange)}
            largeNames={largeNames}
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
            pointsChange={getTeamPointsChange(court.winner, 'team2', court.pointsChange)}
            largeNames={largeNames}
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
