import { ArrowDown, ArrowUp } from 'lucide-react'
import type { RankingEntry } from '@/types/ranking'
import { cn } from '@/lib/utils'

type RankingsTableProps = {
  rankings: RankingEntry[]
}

function formatElo(elo: number): string {
  return Number.isInteger(elo) ? String(elo) : elo.toFixed(1)
}

function PositionChange({ change }: { change: number }) {
  if (change === 0) return null

  const up = change > 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums',
        up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
      )}
    >
      {up ? <ArrowUp className="size-3.5" aria-hidden /> : <ArrowDown className="size-3.5" aria-hidden />}
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
            <th className="whitespace-nowrap py-3 pl-1 pr-5 text-right font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry, index) => (
            <tr
              key={`${entry.name}-${index}`}
              className="border-b border-border/60 last:border-b-0"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{index + 1}.</span>
                  <span className="font-semibold text-foreground">{entry.name}</span>
                  <span className="w-6 shrink-0 text-center text-xl leading-none" aria-hidden>
                    {entry.flag}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap py-3 pl-2 pr-6 text-right">
                <PositionChange change={entry.change} />
              </td>
              <td className="whitespace-nowrap py-3 pl-1 pr-5 text-right tabular-nums font-semibold text-foreground">
                {formatElo(entry.elo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
