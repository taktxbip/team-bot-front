import { useEffect, useRef, useState } from 'react'
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

const QUAKE_ENABLED = false
const QUAKE_DELAY_MS = 5000

export function CourtsGrid({
  courts,
  confirmed,
  onSelectWinner,
  canSelectWinner,
  pendingWinnerKey,
}: CourtsGridProps) {
  const [quake, setQuake] = useState(false)
  const hasQuakedRef = useRef(false)

  useEffect(() => {
    if (!QUAKE_ENABLED || courts.length === 0 || hasQuakedRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const timeoutId = window.setTimeout(() => {
      hasQuakedRef.current = true
      setQuake(true)
    }, QUAKE_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [courts.length])

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
          onSelectWinner={onSelectWinner}
          canSelectWinner={canSelectWinner}
          pendingWinnerKey={pendingWinnerKey}
        />
      ))}
    </div>
  )
}
