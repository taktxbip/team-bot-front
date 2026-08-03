import { useEffect, useRef } from 'react'
import type { Team } from '@/types/court'
import { cn } from '@/lib/utils'
import { teamStyles, type TeamSide } from '@/lib/teamColors'
import { fireTeamConfetti, type ConfettiSize } from '@/lib/teamConfetti'
import { PlayerRow, type PlayerNameSize } from './PlayerRow'

type TeamBlockProps = {
  team: Team
  side: TeamSide
  label: string
  isWinner?: boolean
  highlighted?: boolean
  pointsChange?: number
  nameSize?: PlayerNameSize
  confettiSize?: ConfettiSize
  onSelect?: () => void
  selectable?: boolean
}

export function TeamBlock({
  team,
  side,
  label,
  isWinner,
  highlighted,
  pointsChange,
  nameSize = 'default',
  confettiSize = 'default',
  onSelect,
  selectable = false,
}: TeamBlockProps) {
  const colors = teamStyles[side]
  const alignRight = side === 'team1'
  const showResult = isWinner || pointsChange !== undefined
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wasWinnerRef = useRef(isWinner)

  useEffect(() => {
    if (isWinner && !wasWinnerRef.current && canvasRef.current) {
      fireTeamConfetti(canvasRef.current, side, confettiSize)
    }
    wasWinnerRef.current = isWinner
  }, [isWinner, side, confettiSize])

  return (
    <div className="relative flex flex-1 flex-col gap-2">
      <div
        className={cn(
          'relative flex text-sm',
          alignRight ? 'flex-row-reverse justify-start text-right' : 'text-left',
        )}
      >
        <span className={cn('font-semibold uppercase tracking-wide', colors.label)}>
          {label}
        </span>
        <span
          className={cn(
            'tabular-nums text-muted-foreground',
            alignRight ? 'mr-2' : 'ml-2',
          )}
        >
          {team.rank}
        </span>
      </div>

      <div
        role={selectable ? 'button' : undefined}
        tabIndex={selectable ? 0 : undefined}
        aria-label={selectable ? `Select ${label} as winner` : undefined}
        onClick={selectable ? onSelect : undefined}
        onKeyDown={
          selectable
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect?.()
                }
              }
            : undefined
        }
        className={cn(
          'relative flex flex-1 flex-col overflow-hidden rounded-xl border-2 px-5 py-8',
          highlighted ? colors.blockFilled : colors.block,
          selectable && 'cursor-pointer transition-opacity hover:opacity-90',
        )}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden
        />

        {showResult && (
          <div
            className={cn(
              'absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2',
              alignRight ? 'left-3 md:left-8' : 'right-3 md:right-8',
            )}
          >
            {isWinner && (
              <span className="text-3xl leading-none select-none md:text-5xl" aria-hidden>
                🏆
              </span>
            )}
            {pointsChange !== undefined && (
              <span
                className={cn(
                  'text-base font-semibold tabular-nums leading-none md:text-xl',
                  isWinner ? colors.label : 'text-muted-foreground',
                )}
              >
                {pointsChange > 0 ? `+${pointsChange}` : pointsChange}
              </span>
            )}
          </div>
        )}

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-1">
          <PlayerRow player={team.player1} align={alignRight ? 'right' : 'left'} size={nameSize} />
          <PlayerRow player={team.player2} align={alignRight ? 'right' : 'left'} size={nameSize} />
        </div>
      </div>
    </div>
  )
}
