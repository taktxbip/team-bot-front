import { ArrowDown, ArrowUp } from 'lucide-react'
import type { RankingEntry } from '@/types/ranking'
import { cn } from '@/lib/utils'

type RankingsTableProps = {
  rankings: RankingEntry[]
}

function formatElo(elo: number): string {
  return Number.isInteger(elo) ? String(elo) : elo.toFixed(1)
}

function formatChangeElo(changeElo: number): string {
  const value = formatElo(Math.abs(changeElo))
  return changeElo > 0 ? `+${value}` : changeElo < 0 ? `-${value}` : value
}

function PositionChange({ change }: { change: number }) {
  if (change === 0) return null

  const up = change > 0

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-0.5 text-sm font-semibold leading-none tabular-nums',
        up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
      )}
    >
      {up ? (
        <ArrowUp className="size-3.5 translate-y-px" aria-hidden />
      ) : (
        <ArrowDown className="size-3.5 translate-y-px" aria-hidden />
      )}
      {Math.abs(change)}
    </span>
  )
}

export function RankingsTable({ rankings }: RankingsTableProps) {
  return (
    <div className="rounded-xl bg-card">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-sm text-muted-foreground">
            <th className="w-full px-5 py-3 font-medium">Player</th>
            <th className="whitespace-nowrap py-3 pl-2 pr-1 text-right font-medium" aria-label="Position change" />
            <th className="whitespace-nowrap py-3 pl-1 pr-1 text-right font-medium" aria-label="Points change" />
            <th className="whitespace-nowrap py-3 pl-1 pr-5 text-right font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry, index) => (
            <tr
              key={`${entry.name}-${index}`}
              className="border-b border-border/60 last:border-b-0"
            >
              <td className="px-5 py-3 align-baseline">
                <span className="inline-flex items-baseline gap-2 leading-none">
                  <span className="text-sm text-muted-foreground">{index + 1}.</span>
                  <span className="text-base font-semibold text-foreground">{entry.name}</span>
                  <span className="text-base leading-none" aria-hidden>
                    {entry.flag}
                  </span>
                </span>
              </td>
              <td className="whitespace-nowrap py-3 pl-2 pr-1 text-right align-baseline leading-none">
                <PositionChange change={entry.change} />
              </td>
              <td className="whitespace-nowrap py-3 pl-1 pr-4 text-right align-baseline leading-none">
                {entry.changeElo !== 0 && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatChangeElo(entry.changeElo)}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap py-3 pl-1 pr-5 text-right align-baseline text-base leading-none tabular-nums font-semibold text-foreground">
                {formatElo(entry.elo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
