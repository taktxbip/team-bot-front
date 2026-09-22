import { Link } from 'react-router-dom'
import type { WinRateEntry } from '@/types/playerProfile'

type WinRateTableProps = {
  playerName: string
  winRates: WinRateEntry[]
  loading?: boolean
  error?: string | null
}

function formatRate(rate: number): string {
  return Number.isInteger(rate) ? String(rate) : rate.toFixed(1)
}

export function WinRateTable({ playerName, winRates, loading, error }: WinRateTableProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="px-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Win Rate</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on the past 2 months. <span className="font-semibold">{playerName}</span> must have played at least 10 games with a teammate to appear in the table.
        </p>
      </header>

      <div className="rounded-xl bg-card">
        {loading && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            Loading win rates…
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-4 text-sm text-destructive">{error}</div>
        )}

        {!loading && !error && winRates.length === 0 && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No win rates yet
          </div>
        )}

        {!loading && !error && winRates.length > 0 && (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="w-full px-5 py-3 font-medium">Played with</th>
                <th className="whitespace-nowrap py-3 pl-1 pr-5 text-right font-medium">
                  Win rate
                </th>
              </tr>
            </thead>
            <tbody>
              {winRates.map((entry) => (
                <tr
                  key={`${entry.teammateId}-${entry.teammateName}`}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-5 py-3 align-baseline">
                    <Link
                      to={`/rankings/${encodeURIComponent(entry.teammateName)}`}
                      className="text-base font-semibold text-foreground hover:underline"
                    >
                      {entry.teammateName}
                    </Link>
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
    </section>
  )
}
