import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import type { Team, TeamStamp } from '@/types/court'
import { cn } from '@/lib/utils'
import { teamStyles, type TeamSide } from '@/lib/teamColors'
import { fireTeamConfetti, type ConfettiSize } from '@/lib/teamConfetti'
import { SIMPSON_LOADER_SRC, useSimpsonLoaderReady } from '@/lib/simpsonLoader'
import {
  DEFAULT_NAME_FONT_SIZE,
  usePlayDisplaySettings,
} from '@/hooks/PlayDisplaySettingsContext'
import { Trophey } from '@/components/Trophey'
import { Button } from '@/components/ui/button'
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
  /** Confirm/save this court result (winner side). */
  onConfirm?: () => void
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
  onConfirm,
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
  
  const BTN_MULTIPLIER = 0.8
  const confirmFontSize = Math.max(12, Math.round(nameFontSize * 0.85 * BTN_MULTIPLIER))
  const confirmPadX = Math.max(8, Math.round(nameFontSize * 0.45 * BTN_MULTIPLIER))
  const confirmPadY = Math.max(4, Math.round(nameFontSize * 0.34 * BTN_MULTIPLIER))
  /** Winner card must not re-trigger set-winner; Confirm is a separate action. */
  const canSelect = Boolean(selectable && !loading && !isWinner)

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

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          role={canSelect ? 'button' : undefined}
          tabIndex={canSelect ? 0 : undefined}
          aria-label={canSelect ? `Select ${label} as winner` : undefined}
          aria-busy={loading || undefined}
          onClick={canSelect ? onSelect : undefined}
          onKeyDown={
            canSelect
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect?.()
                  }
                }
              : undefined
          }
          className={cn(
            'relative flex flex-1 flex-col rounded-xl border-2 px-5 py-0',
            stamp ? 'overflow-visible' : 'overflow-hidden',
            highlighted ? colors.blockFilled : colors.block,
            canSelect && 'cursor-pointer transition-opacity hover:opacity-90',
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

          {showResult && !isWinner && pointsChange !== undefined && (
            <div
              className={cn(
                'absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2',
                alignRight ? 'left-3 md:left-8' : 'right-3 md:right-8',
              )}
            >
              <span className="text-base font-semibold tabular-nums leading-none text-muted-foreground md:text-xl">
                {pointsChange > 0 ? `+${pointsChange}` : pointsChange}
              </span>
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

        {isWinner && onConfirm && (
          <div
            className={cn(
              'absolute top-1/2 z-30 flex -translate-y-1/2',
              alignRight ? 'left-3 md:left-8' : 'right-3 md:right-8',
            )}
          >
            <Button
              type="button"
              size="sm"
              className="animate-confirm-pulse h-auto whitespace-nowrap bg-primary font-semibold text-primary-foreground opacity-100 hover:bg-primary hover:opacity-100"
              style={{
                fontSize: `${confirmFontSize}px`,
                paddingInline: `${confirmPadX}px`,
                paddingBlock: `${confirmPadY}px`,
              }}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                event.stopPropagation()
                onConfirm()
              }}
            >
              🏆 Save{' '}
              {pointsChange !== undefined
                ? pointsChange > 0
                  ? `+${pointsChange}`
                  : String(pointsChange)
                : '+points'}
            </Button>
          </div>
        )}

        {isWinner && !onConfirm && pointsChange !== undefined && (
          <div
            className={cn(
              'absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2',
              alignRight ? 'left-3 md:left-8' : 'right-3 md:right-8',
            )}
          >
            <Trophey
              className="w-auto"
              style={{ height: Math.round(nameFontSize * 2.6) }}
            />
            <span
              className={cn(
                'text-base font-semibold tabular-nums leading-none md:text-xl',
                colors.label,
              )}
            >
              {pointsChange > 0 ? `+${pointsChange}` : pointsChange}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
