import { useEffect, useRef } from 'react'
import type { Team } from '@/types/court'
import { cn } from '@/lib/utils'
import { teamStyles, type TeamSide } from '@/lib/teamColors'
import { fireTeamConfetti, type ConfettiSize } from '@/lib/teamConfetti'
import { SIMPSON_LOADER_SRC, useSimpsonLoaderReady } from '@/lib/simpsonLoader'
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
  loading?: boolean
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
  loading = false,
}: TeamBlockProps) {
  const colors = teamStyles[side]
  const alignRight = side === 'team1'
  const showResult = isWinner || pointsChange !== undefined
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wasWinnerRef = useRef(isWinner)
  const loaderReady = useSimpsonLoaderReady()
  const showLoader = loading && loaderReady

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
        aria-busy={loading || undefined}
        onClick={selectable && !loading ? onSelect : undefined}
        onKeyDown={
          selectable && !loading
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
          selectable && !loading && 'cursor-pointer transition-opacity hover:opacity-90',
          loading && 'pointer-events-none',
        )}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden
        />

        {showLoader && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60">
            <img
              src={SIMPSON_LOADER_SRC}
              alt=""
              className="max-h-[70%] max-w-[70%] object-contain"
            />
          </div>
        )}
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
