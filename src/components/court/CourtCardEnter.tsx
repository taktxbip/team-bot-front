import { useLayoutEffect, useState } from 'react'
import type { Court } from '@/types/court'
import type { ConfettiSize } from '@/lib/teamConfetti'
import { cn } from '@/lib/utils'
import { CourtCard } from './CourtCard'

type CourtCardEnterProps = {
  court: Court
  confirmed?: boolean
  largeNames?: boolean
  confettiSize?: ConfettiSize
  staggerIndex: number
}

export function CourtCardEnter({
  court,
  confirmed,
  largeNames,
  confettiSize,
  staggerIndex,
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
        largeNames={largeNames}
        confettiSize={confettiSize}
      />
    </div>
  )
}
