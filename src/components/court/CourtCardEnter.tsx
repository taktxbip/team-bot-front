import { useLayoutEffect, useState } from 'react'
import type { Court } from '@/types/court'
import type { ConfettiSize } from '@/lib/teamConfetti'
import { cn } from '@/lib/utils'
import { CourtCard } from './CourtCard'
import { CourtIdeaOverlay } from './CourtIdeaOverlay'

type CourtCardEnterProps = {
  court: Court
  idea?: Court | null
  confettiSize?: ConfettiSize
  staggerIndex: number
  team1StampIndex?: number | null
  team2StampIndex?: number | null
  stampIntroDelayMs?: number
  stampStaggerMs?: number
  onStampImpact?: () => void
  onSelectWinner?: (winnerKey: string) => void
  onConfirmCourt?: (courtId: string) => void
  canSelectWinner?: boolean
  pendingWinnerKey?: string | null
  pendingIdeaKey?: string | null
  onPlayIdea?: (ideaCourtId: string) => void
  onCancelIdea?: (ideaCourtId: string) => void
}

export function CourtCardEnter({
  court,
  idea = null,
  confettiSize,
  staggerIndex,
  team1StampIndex = null,
  team2StampIndex = null,
  stampIntroDelayMs,
  stampStaggerMs,
  onStampImpact,
  onSelectWinner,
  onConfirmCourt,
  canSelectWinner,
  pendingWinnerKey,
  pendingIdeaKey,
  onPlayIdea,
  onCancelIdea,
}: CourtCardEnterProps) {
  const [animate, setAnimate] = useState(false)
  const showIdea = Boolean(idea && court.confirmed)

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={cn(
        'relative min-h-0 md:h-full',
        animate &&
          'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both motion-reduce:animate-none',
      )}
      style={
        animate ? { animationDelay: `${Math.min(staggerIndex, 5) * 80}ms` } : undefined
      }
    >
      <CourtCard
        court={court}
        confettiSize={confettiSize}
        onSelectWinner={onSelectWinner}
        onConfirmCourt={onConfirmCourt}
        canSelectWinner={canSelectWinner}
        pendingWinnerKey={pendingWinnerKey}
        team1StampIndex={team1StampIndex}
        team2StampIndex={team2StampIndex}
        stampIntroDelayMs={stampIntroDelayMs}
        stampStaggerMs={stampStaggerMs}
        onStampImpact={onStampImpact}
      />
      {showIdea && idea ? (
        <CourtIdeaOverlay
          idea={idea}
          courtName={court.name}
          pending={pendingIdeaKey === idea.id}
          onPlay={() => onPlayIdea?.(idea.id)}
          onCancel={() => onCancelIdea?.(idea.id)}
        />
      ) : null}
    </div>
  )
}
