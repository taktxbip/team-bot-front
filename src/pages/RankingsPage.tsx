import { RankingsTable } from '@/components/rankings/RankingsTable'
import { useRankings } from '@/hooks/useRankings'

export function RankingsPage() {
  const { rankings, loading, error } = useRankings()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <main className="mx-auto w-full max-w-[500px]">
        {loading && (
          <div className="flex min-h-48 items-center justify-center text-muted-foreground">
            Loading rankings…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && rankings.length === 0 && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
            No rankings yet
          </div>
        )}

        {!loading && !error && rankings.length > 0 && (
          <RankingsTable rankings={rankings} />
        )}
      </main>
    </div>
  )
}
