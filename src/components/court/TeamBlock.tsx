import { useEffect, useRef, type CSSProperties } from 'react'
import type { Team, TeamStamp } from '@/types/court'
import { cn } from '@/lib/utils'
import { teamStyles, type TeamSide } from '@/lib/teamColors'
import { fireTeamConfetti, type ConfettiSize } from '@/lib/teamConfetti'
import { SIMPSON_LOADER_SRC, useSimpsonLoaderReady } from '@/lib/simpsonLoader'
import {
  DEFAULT_NAME_FONT_SIZE,
  usePlayDisplaySettings,
} from '@/hooks/PlayDisplaySettingsContext'
import { Stamp } from '@/components/rankings/Stamp'
import { PlayerRow } from './PlayerRow'

/** Slam duration — keep in sync with `animate-stamp-slam` in index.css */
export const STAMP_SLAM_DURATION_MS = 367
/** Impact is the hard stop at the end of the ease-in slam. */
export const STAMP_SLAM_IMPACT_RATIO = 1

type TeamBlockProps = {
  team: Team
  side: TeamSide
  label: string
  isWinner?: boolean
  highlighted?: boolean
  pointsChange?: number
  confettiSize?: ConfettiSize
  onSelect?: () => void
  selectable?: boolean
  loading?: boolean
  /** Stamp kind from WS (`''` = none). */
  stamp?: TeamStamp
  /** Delay before the stamp slam starts (ms). */
  stampSlamDelayMs?: number
  /** Fired when the stamp hits the card (for court quake). */
  onStampImpact?: () => void
}

export function TeamBlock({
  team,
  side,
  label,
  isWinner,
  highlighted,
  pointsChange,
  confettiSize = 'default',
  onSelect,
  selectable = false,
  loading = false,
  stamp = '',
  stampSlamDelayMs = 0,
  onStampImpact,
}: TeamBlockProps) {
  const colors = teamStyles[side]
  const alignRight = side === 'team1'
  const showResult = isWinner || pointsChange !== undefined
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wasWinnerRef = useRef(isWinner)
  const loaderReady = useSimpsonLoaderReady()
  const showLoader = Boolean(loading)
  const stampOnLeft = side === 'team1'
  const { nameFontSize } = usePlayDisplaySettings()
  const stampScale = nameFontSize / DEFAULT_NAME_FONT_SIZE / 3

  useEffect(() => {
    if (isWinner && !wasWinnerRef.current && canvasRef.current) {
      fireTeamConfetti(canvasRef.current, side, confettiSize)
    }
    wasWinnerRef.current = isWinner
  }, [isWinner, side, confettiSize])

  useEffect(() => {
    if (!stamp || !onStampImpact) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      const id = window.setTimeout(onStampImpact, stampSlamDelayMs)
      return () => window.clearTimeout(id)
    }

    const impactAt = stampSlamDelayMs + STAMP_SLAM_DURATION_MS * STAMP_SLAM_IMPACT_RATIO
    const id = window.setTimeout(onStampImpact, impactAt)
    return () => window.clearTimeout(id)
  }, [stamp, stampSlamDelayMs, onStampImpact])

  return (
    <div className="relative flex min-w-0 flex-1 flex-col gap-2">
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
          'relative flex flex-1 flex-col rounded-xl border-2 px-5 py-8',
          stamp ? 'overflow-visible' : 'overflow-hidden',
          highlighted ? colors.blockFilled : colors.block,
          selectable && !loading && 'cursor-pointer transition-opacity hover:opacity-90',
          loading && 'pointer-events-none',
        )}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[10px]"
          aria-hidden
        />

        {stamp ? (
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1.5 z-[5]',
              stampOnLeft ? 'left-1.5' : 'right-1.5',
            )}
          >
            <Stamp
              variant="best-teammates"
              color="#3f6b54"
              className="animate-stamp-slam opacity-90"
              style={
                {
                  '--stamp-scale': stampScale,
                  transformOrigin: stampOnLeft ? 'top left' : 'top right',
                  animationDelay: `${stampSlamDelayMs}ms`,
                } as CSSProperties
              }
            />
          </div>
        ) : null}

        {showLoader && (
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-[10px] bg-background/70">
            <img
              src={SIMPSON_LOADER_SRC}
              alt="Loading"
              className={cn(
                'max-h-[70%] max-w-[70%] object-contain',
                !loaderReady && 'opacity-0',
              )}
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
              <span
                className="leading-none select-none"
                style={{ fontSize: `${Math.round(nameFontSize * 1.5)}px` }}
                aria-hidden
              >
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

        <div
          className={cn(
            'relative z-10 flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1',
            alignRight ? 'pl-10 pr-2 md:pl-14 md:pr-4' : 'pr-10 pl-2 md:pr-14 md:pl-4',
          )}
        >
          <PlayerRow player={team.player1} align={alignRight ? 'right' : 'left'} />
          <PlayerRow player={team.player2} align={alignRight ? 'right' : 'left'} />
        </div>
      </div>
    </div>
  )
}
