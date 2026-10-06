import { RankingsTable } from '@/components/rankings/RankingsTable'
import { TeamWinRateTable } from '@/components/rankings/TeamWinRateTable'
import { useRankings } from '@/hooks/useRankings'
import { useTeamWinRates } from '@/hooks/useTeamWinRates'

export function RankingsPage() {
  const { rankings, loading, error } = useRankings()
  const {
    teamWinRates,
    loading: teamWinRatesLoading,
    error: teamWinRatesError,
  } = useTeamWinRates()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <main className="mx-auto flex w-full max-w-[500px] flex-col gap-10 pb-10">
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
          <div>
            <header className="mb-3 px-1">
              <h1 className="font-semibold tracking-tight text-foreground md:text-lg">
                Solo Rankings
              </h1>
            </header>
            <RankingsTable rankings={rankings} />
          </div>
        )}

        <TeamWinRateTable
          teamWinRates={teamWinRates}
          loading={teamWinRatesLoading}
          error={teamWinRatesError}
        />
      </main>
    </div>
  )
}
