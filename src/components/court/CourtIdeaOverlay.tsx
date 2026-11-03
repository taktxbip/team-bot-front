import type { Court } from '@/types/court'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TeamBlock } from './TeamBlock'
import { WinProbabilityBar } from './WinProbabilityBar'

type CourtIdeaOverlayProps = {
  idea: Court
  /** Host court label, e.g. "Court 1" → "Suggested: court 1". */
  courtName: string
  pending?: boolean
  onPlay: () => void
  onCancel: () => void
}

export function CourtIdeaOverlay({
  idea,
  courtName,
  pending = false,
  onPlay,
  onCancel,
}: CourtIdeaOverlayProps) {
  const courtNumber = courtName.match(/\d+/)?.[0] ?? courtName

  return (
    <div
      className={cn(
        'court-idea-accent absolute inset-0 z-40 flex flex-col rounded-xl bg-card',
        'animate-in fade-in duration-300',
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 pb-3 pt-4">
        <p className="shrink-0 text-center text-sm font-medium text-muted-foreground">
          Suggested: court {courtNumber}
        </p>
        <div className="flex min-h-0 flex-1 items-stretch gap-4">
          <TeamBlock team={idea.team1} side="team1" label="Team 1" />
          <div className="flex shrink-0 flex-col gap-2">
            <div className="relative text-sm opacity-0" aria-hidden>
              vs
            </div>
            <div className="flex flex-1 items-center text-xl font-semibold text-muted-foreground">
              vs
            </div>
          </div>
          <TeamBlock team={idea.team2} side="team2" label="Team 2" />
        </div>
        <WinProbabilityBar
          team1Probability={idea.team1.winProbability}
          team2Probability={idea.team2.winProbability}
        />
      </div>
      <div className="flex shrink-0 gap-3 border-t px-5 py-4">
        <Button
          type="button"
          className="h-11 flex-1 text-base"
          disabled={pending}
          onClick={onPlay}
        >
          {pending ? 'Starting…' : 'Play'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 text-base"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
