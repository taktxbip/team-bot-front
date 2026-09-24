import { useCallback, useMemo, useState } from 'react'
import type { Court } from '@/types/court'
import { getConfettiSizeForCourtCount } from '@/lib/teamConfetti'
import { cn } from '@/lib/utils'
import { CourtCardEnter } from './CourtCardEnter'

type CourtsGridProps = {
  courts: Court[]
  confirmed?: boolean
  onSelectWinner?: (winnerKey: string) => void
  canSelectWinner?: boolean
  pendingWinnerKey?: string | null
}

function getGridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-1 md:grid-cols-2'
  if (count <= 6) return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
}

/** Wait after teams appear before the first stamp slams. */
const STAMP_INTRO_DELAY_MS = 1000
/** Gap between each stamp slam. */
const STAMP_STAGGER_MS = 213

function buildStampIndices(courts: Court[]) {
  let next = 0
  return courts.map((court) => {
    const team1StampIndex = court.team1.stamp ? next++ : null
    const team2StampIndex = court.team2.stamp ? next++ : null
    return { team1StampIndex, team2StampIndex }
  })
}

export function CourtsGrid({
  courts,
  confirmed,
  onSelectWinner,
  canSelectWinner,
  pendingWinnerKey,
}: CourtsGridProps) {
  const [quake, setQuake] = useState(false)
  const stampIndices = useMemo(() => buildStampIndices(courts), [courts])

  const handleStampImpact = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Drop class then re-add next frame so consecutive impacts retrigger
    setQuake(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setQuake(true))
    })
  }, [])

  if (courts.length === 0) {
    return (
      <div className="flex min-h-48 w-full items-center justify-center rounded-xl border border-dashed text-muted-foreground md:h-full">
        No teams
      </div>
    )
  }

  const confettiSize = getConfettiSizeForCourtCount(courts.length)

  return (
    <div
      className={cn(
        'grid w-full gap-5 md:h-full md:flex-1 md:auto-rows-fr',
        getGridClass(courts.length),
        quake && 'animate-court-quake',
      )}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setQuake(false)
      }}
    >
      {courts.map((court, index) => (
        <CourtCardEnter
          key={court.id}
          court={court}
          confirmed={confirmed}
          confettiSize={confettiSize}
          staggerIndex={index}
          team1StampIndex={stampIndices[index]?.team1StampIndex ?? null}
          team2StampIndex={stampIndices[index]?.team2StampIndex ?? null}
          stampIntroDelayMs={STAMP_INTRO_DELAY_MS}
          stampStaggerMs={STAMP_STAGGER_MS}
          onStampImpact={handleStampImpact}
          onSelectWinner={onSelectWinner}
          canSelectWinner={canSelectWinner}
          pendingWinnerKey={pendingWinnerKey}
        />
      ))}
    </div>
  )
}
