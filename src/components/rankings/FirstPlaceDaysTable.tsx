import { Link } from 'react-router-dom'
import { Trophey } from '@/components/Trophey'
import type { FirstPlaceDaysEntry } from '@/types/playerProfile'

type FirstPlaceDaysTableProps = {
  entries: FirstPlaceDaysEntry[]
  loading?: boolean
  error?: string | null
}

/** Smallest and largest cup, in px. Everyone else is scaled between these. */
const MIN_CUP_HEIGHT = 74
const MAX_CUP_HEIGHT = 148
const MIN_TEXT_SIZE = 14
const MAX_TEXT_SIZE = 42

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t
}

/** 0 at the fewest days, 1 at the most. Ties all sit at the large end. */
function dayScale(days: number, minDays: number, maxDays: number): number {
  if (maxDays <= minDays) return 1
  return (days - minDays) / (maxDays - minDays)
}

export function FirstPlaceDaysTable({ entries, loading, error }: FirstPlaceDaysTableProps) {
  const minDays = entries.reduce((min, entry) => Math.min(min, entry.days), Infinity)
  const maxDays = entries.reduce((max, entry) => Math.max(max, entry.days), -Infinity)

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <header className="px-1">
        <h2 className="font-semibold tracking-tight text-foreground md:text-lg">
          Days on first place*
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Playing days only. Days without matches are not counted.
        </p>
      </header>
      <div className="overflow-hidden rounded-xl">
        {loading && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            Loading days on first place…
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-4">
            <div className="text-sm font-medium text-foreground">
              Failed to load days on first place
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No first-place days yet
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <ul className="flex w-full min-w-0 items-end justify-start gap-4 overflow-x-auto px-4 py-5 sm:gap-8">
            {entries.map((entry) => {
              const scale = dayScale(entry.days, minDays, maxDays)
              const cupHeight = lerp(MIN_CUP_HEIGHT, MAX_CUP_HEIGHT, scale)
              const textSize = lerp(MIN_TEXT_SIZE, MAX_TEXT_SIZE, scale)

              return (
                <li key={entry.playerId} className="flex shrink-0 items-end gap-2">
                  <Trophey className="w-auto" style={{ height: cupHeight }} />
                  <div className="flex flex-col items-start leading-[1.1]">
                    <span
                      className="font-bold tabular-nums"
                      style={{ fontSize: textSize }}
                    >
                      {entry.days}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.days === 1 ? 'day' : 'days'}
                    </span>
                    <Link
                      to={`/rankings/${encodeURIComponent(entry.name)}`}
                      className="mt-2 max-w-28 truncate text-sm font-semibold text-foreground hover:underline"
                    >
                      {entry.name}
                      {entry.flag ? ` ${entry.flag}` : ''}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <p className="px-1 text-xs text-muted-foreground">*Updates at 23:00 Thailand time. Starting from July, 2026.</p>
    </section>
  )
}
