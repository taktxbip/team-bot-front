import type { Court } from '@/types/court'
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
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col">
      <CardHeader className="shrink-0 border-b px-5">
        <CardTitle className="text-2xl font-semibold">{court.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-5 px-5 pt-5">
        <div className="flex min-h-0 flex-1 items-center gap-4">
          <TeamBlock team={court.team1} side="team1" label="Team 1" />
          <div className="flex shrink-0 items-center text-xl font-semibold text-muted-foreground">
            vs
          </div>
          <TeamBlock team={court.team2} side="team2" label="Team 2" />
        </div>
        <WinProbabilityBar
          team1Probability={court.team1.winProbability}
          team2Probability={court.team2.winProbability}
        />
      </CardContent>
    </Card>
  )
}
