import { Link } from 'react-router-dom'
import type { FirstPlaceDaysEntry } from '@/types/playerProfile'

type FirstPlaceDaysTableProps = {
  entries: FirstPlaceDaysEntry[]
  loading?: boolean
  error?: string | null
}

export function FirstPlaceDaysTable({ entries, loading, error }: FirstPlaceDaysTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="px-1">
        <h2 className="font-semibold tracking-tight text-foreground md:text-lg">
          Days on first place*
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Playing days only. Days without matches are not counted.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl bg-card">
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
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="w-full px-5 py-3 font-medium">Player</th>
                <th className="whitespace-nowrap py-3 pl-1 pr-5 text-right font-medium">Days</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.playerId} className="border-b border-border/60 last:border-b-0">
                  <td className="px-5 py-3 align-baseline">
                    <span className="inline-flex items-baseline gap-2 leading-none">
                      <span className="text-sm text-muted-foreground">{index + 1}.</span>
                      <Link
                        to={`/rankings/${encodeURIComponent(entry.name)}`}
                        className="text-base font-semibold text-foreground hover:underline"
                      >
                        {entry.name}
                      </Link>
                      {entry.flag && (
                        <span className="text-base leading-none" aria-hidden>
                          {entry.flag}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-1 pr-5 text-right align-baseline text-base font-semibold tabular-nums text-foreground">
                    {entry.days}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="px-1 text-xs text-muted-foreground">*Updates at 23:00 Thailand time. Starting from July, 2026.</p>
    </section>
  )
}
