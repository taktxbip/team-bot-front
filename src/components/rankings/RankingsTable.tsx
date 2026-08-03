import type { RankingEntry } from '@/types/ranking'

type RankingsTableProps = {
  rankings: RankingEntry[]
}

function formatElo(elo: number): string {
  return Number.isInteger(elo) ? String(elo) : elo.toFixed(1)
}

export function RankingsTable({ rankings }: RankingsTableProps) {
  return (
    <div className="rounded-xl bg-card">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-sm text-muted-foreground">
            <th className="px-5 py-3 font-medium">Player</th>
            <th className="px-5 py-3 text-right font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry, index) => (
            <tr
              key={`${entry.name}-${index}`}
              className="border-b border-border/60 last:border-b-0"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{index + 1}.</span>
                  <span className="w-6 shrink-0 text-center text-xl leading-none" aria-hidden>
                    {entry.flag}
                  </span>
                  <span className="font-semibold text-foreground">{entry.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-right tabular-nums font-semibold text-foreground">
                {formatElo(entry.elo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
