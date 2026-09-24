import { SvgFire } from '@/components/SvgFire'
import { cn } from '@/lib/utils'
import type { PlayerRankStats } from '@/types/playerProfile'
import type { ReactNode } from 'react'

export type { PlayerRankStats }

type PlayerStatsCardsProps = {
  stats?: PlayerRankStats | null
  loading?: boolean
  error?: string | null
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1)
}

function formatCount(value: number): string {
  return Math.trunc(value).toLocaleString('fr-FR')
}

function medalForRank(rank: number): string | null {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

/**
 * Pick form-range copy from where current points sit vs all-time high / mid / low.
 */
function formRangeDescription(points: number, allTimeHigh: number, allTimeLow: number): string {
  const high = Math.max(allTimeHigh, allTimeLow)
  const low = Math.min(allTimeHigh, allTimeLow)
  const mid = (high + low) / 2
  const range = high - low
  const nearMid = range === 0 || Math.abs(points - mid) <= range * 0.1

  if (points >= high) {
    return 'You’re on fire, keep it going!'
  }

  if (points <= low) {
    return 'Only way from here is up.'
  }

  if (nearMid) {
    return 'Right in the middle of your range — steady and balanced.'
  }

  if (points > mid) {
    return 'Keep pushing toward your best.'
  }

  return 'You have plenty of room to grow.'
}

/**
 * Map points onto a 0–100 scale where 0% = best/high (top) and 100% = low (bottom).
 * Higher elo is better.
 */
function pointsToTopPercent(points: number, high: number, low: number): number {
  if (high === low) return 50
  return clamp(((high - points) / (high - low)) * 100, 0, 100)
}

function StatCard({
  label,
  value,
  overlay,
  className,
}: {
  label: string
  value: ReactNode
  overlay?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-1 flex-col justify-center rounded-xl bg-card px-5 py-4',
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </div>
      {overlay}
    </div>
  )
}

export function PlayerStatsCards({ stats, loading, error }: PlayerStatsCardsProps) {
  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl bg-card text-sm text-muted-foreground">
        Loading player stats…
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-card px-5 py-4">
        <div className="text-sm font-medium text-foreground">Failed to load player stats</div>
        <p className="mt-1 text-sm text-muted-foreground">Try again in a moment.</p>
      </div>
    )
  }

  const { currentRank, points, gamesPlayed, allTimeHigh, allTimeLow } = stats
  // Include current points so the marker stays on-scale if elo is outside all-time bounds
  const high = Math.max(allTimeHigh, allTimeLow, points)
  const low = Math.min(allTimeHigh, allTimeLow, points)
  const mid = Math.round((high + low) / 2)
  const currentTop = pointsToTopPercent(points, high, low)
  const midTop = pointsToTopPercent(mid, high, low)
  const medal = medalForRank(currentRank)
  const onFire = points >= allTimeHigh

  const description =
    stats.conditionDescription ?? formRangeDescription(points, allTimeHigh, allTimeLow)

  return (
    <section className="grid grid-cols-[1fr_auto] gap-3">

      <div className="flex min-w-0 flex-col gap-3">
        <StatCard
          label="Current rank"
          value={
            <>
              #{currentRank}{' '}
              <span className="text-xl font-normal text-muted-foreground">
                ({formatPoints(points)})
              </span>
            </>
          }
          overlay={
            medal ? (
              <span
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-6xl leading-none sm:text-7xl"
                aria-hidden
              >
                {medal}
              </span>
            ) : undefined
          }
        />
        <StatCard label="Games played*" value={formatCount(gamesPlayed)} />
      </div>

      <div className="relative isolate flex w-[9.5rem] flex-col overflow-hidden rounded-xl bg-card px-3 py-4 sm:w-48 sm:px-4">
        {onFire && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 overflow-hidden"
          >
            <SvgFire className="h-full w-full" offsetY="60%" />
          </div>
        )}
        <p className="relative z-10 px-1 text-sm font-medium text-foreground">Peak & Low</p>
        <p className="relative z-10 mt-1 px-1 text-xs leading-snug text-muted-foreground">
          {description}
        </p>
 
        <div className="relative z-10 mt-4 flex min-h-40 flex-1 items-stretch gap-2.5 px-1 pb-1 pt-2">
          <div className="relative w-2.5 shrink-0">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />

            <div
              className="absolute top-0 left-1/2 h-px w-2.5 -translate-x-1/2 bg-muted-foreground/50"
              aria-hidden
            />
            <div
              className="absolute left-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-muted-foreground/50"
              style={{ top: `${midTop}%` }}
              aria-hidden
            />
            <div
              className="absolute bottom-0 left-1/2 h-px w-2.5 -translate-x-1/2 bg-muted-foreground/50"
              aria-hidden
            />

            <div
              className="absolute left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ top: `${currentTop}%` }}
              title={`Current ${formatPoints(points)}`}
              aria-label={`Current points ${formatPoints(points)}`}
            >
              {onFire ? (
                <span className="text-sm leading-none" aria-hidden>
                  🔥
                </span>
              ) : (
                <span className="size-2.5 rounded-full bg-foreground ring-2 ring-card" />
              )}
            </div>
          </div>

          <div className="relative flex min-w-0 flex-1 flex-col text-xs tabular-nums">
            <div className="flex items-start justify-between gap-1 leading-none">
              <span className="font-semibold text-foreground">{formatPoints(high)}</span>
              <span className="text-[10px] text-muted-foreground">ATH</span>
            </div>

            <div
              className="absolute right-0 left-0 flex -translate-y-1/2 items-center justify-between gap-1 leading-none"
              style={{ top: `${midTop}%` }}
            >
              <span className="text-muted-foreground">{formatPoints(mid)}</span>
              <span className="text-[10px] text-muted-foreground">mid</span>
            </div>

            <div className="mt-auto flex items-end justify-between gap-1 leading-none">
              <span className="font-semibold text-foreground">{formatPoints(low)}</span>
              <span className="text-[10px] text-muted-foreground">ATL</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  )
}
