import { Link } from 'react-router-dom'
import type { TeamWinRateEntry } from '@/types/playerProfile'

type TeamWinRateTableProps = {
  teamWinRates: TeamWinRateEntry[]
  loading?: boolean
  error?: string | null
}

function formatRate(rate: number): string {
  return Number.isInteger(rate) ? String(rate) : rate.toFixed(1)
}

export function TeamWinRateTable({ teamWinRates, loading, error }: TeamWinRateTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="px-1">
        <h2 className="font-semibold tracking-tight text-foreground md:text-lg">Team Win Rates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on the past 2 months. A pair must have played at least 10 games together to appear
          in the table.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl bg-card">
        {loading && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            Loading team win rates…
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-4">
            <div className="text-sm font-medium text-foreground">Failed to load team win rates</div>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && teamWinRates.length === 0 && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No team win rates yet
          </div>
        )}

        {!loading && !error && teamWinRates.length > 0 && (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="w-full px-5 py-3 font-medium">Team</th>
                <th className="whitespace-nowrap py-3 pl-1 pr-5 text-right font-medium">
                  Win Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {teamWinRates.map((entry, index) => (
                <tr
                  key={entry.key}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-5 py-3 align-baseline">
                    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 leading-none">
                      <span className="text-sm text-muted-foreground">{index + 1}.</span>
                      <Link
                        to={`/rankings/${encodeURIComponent(entry.players[0])}`}
                        className="text-base font-semibold text-foreground hover:underline"
                      >
                        {entry.players[0]}
                      </Link>
                      <span className="text-sm text-muted-foreground">—</span>
                      <Link
                        to={`/rankings/${encodeURIComponent(entry.players[1])}`}
                        className="text-base font-semibold text-foreground hover:underline"
                      >
                        {entry.players[1]}
                      </Link>
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-1 pr-5 text-right align-baseline text-base font-semibold tabular-nums text-foreground">
                    {formatRate(entry.rate)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="px-1 text-xs text-muted-foreground">*Updates at 23:00 Thailand time</p>
    </section>
  )
}
