import { useLayoutEffect, useState } from 'react'
import type { Court } from '@/types/court'
import type { PlayerNameSize } from '@/components/court/PlayerRow'
import type { ConfettiSize } from '@/lib/teamConfetti'
import { cn } from '@/lib/utils'
import { CourtCard } from './CourtCard'

type CourtCardEnterProps = {
  court: Court
  confirmed?: boolean
  nameSize?: PlayerNameSize
  confettiSize?: ConfettiSize
  staggerIndex: number
  onSelectWinner?: (winnerKey: string) => void
  canSelectWinner?: boolean
}

export function CourtCardEnter({
  court,
  confirmed,
  nameSize,
  confettiSize,
  staggerIndex,
  onSelectWinner,
  canSelectWinner,
}: CourtCardEnterProps) {
  const [animate, setAnimate] = useState(false)

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={cn(
        'min-h-0 md:h-full',
        animate &&
          'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both motion-reduce:animate-none',
      )}
      style={
        animate ? { animationDelay: `${Math.min(staggerIndex, 5) * 80}ms` } : undefined
      }
    >
      <CourtCard
        court={court}
        confirmed={confirmed}
        nameSize={nameSize}
        confettiSize={confettiSize}
        onSelectWinner={onSelectWinner}
        canSelectWinner={canSelectWinner}
      />
    </div>
  )
}
