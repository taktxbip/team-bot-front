import { cn } from '@/lib/utils'
import type { GameResult } from '@/hooks/useLastTenGames'

export type { GameResult }

type LastTenGamesProps = {
  results?: GameResult[]
  loading?: boolean
  error?: string | null
}

export function LastTenGames({ results = [], loading, error }: LastTenGamesProps) {
  const games = results.slice(0, 10)
  const wins = games.filter((result) => result === 'W').length
  const total = games.length

  return (
    <section className="flex flex-col gap-3">
      <header className="px-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Last 10 games</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? 'Loading…' : error ? 'Could not load recent games' : `Won ${wins}/${total}`}
        </p>
      </header>

      {loading && (
        <div className="flex min-h-12 items-center justify-center rounded-xl bg-card text-sm text-muted-foreground">
          Loading last 10 games…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-card px-5 py-4">
          <div className="text-sm font-medium text-foreground">Failed to load last 10 games</div>
          <p className="mt-1 text-sm text-muted-foreground">Play a few matches and try again 🏸</p>
        </div>
      )}

      {!loading && !error && total === 0 && (
        <div className="rounded-xl bg-card px-5 py-4 text-sm text-muted-foreground">
          No recent games yet.
        </div>
      )}

      {!loading && !error && total > 0 && (
        <ol className="relative flex items-end justify-between gap-1 sm:gap-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-2 items-center"
          >
            <div className="h-px w-full bg-border" />
          </div>
          {games.map((result, index) => {
            const won = result === 'W'
            return (
              <li
                key={`${result}-${index}`}
                className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    'text-xs font-semibold leading-none',
                    won
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {result}
                </span>
                <span
                  className={cn(
                    'aspect-square w-full max-w-2 rounded-full',
                    won
                      ? 'bg-emerald-500 dark:bg-emerald-400'
                      : 'bg-red-500 dark:bg-red-400',
                  )}
                  aria-label={won ? 'Win' : 'Loss'}
                />
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
