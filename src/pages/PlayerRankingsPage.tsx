import { useParams } from 'react-router-dom'
import { RankHistoryChart } from '@/components/rankings/RankHistoryChart'
import { useEloHistory } from '@/hooks/useEloHistory'
import { useRankings } from '@/hooks/useRankings'

export function PlayerRankingsPage() {
  const { playerName: playerNameParam } = useParams<{ playerName: string }>()
  const playerName = playerNameParam ? decodeURIComponent(playerNameParam) : ''
  const { history, loading, error } = useEloHistory(playerName || undefined)
  const { rankings } = useRankings()
  const flag = rankings.find(
    (entry) => entry.name.toLowerCase() === playerName.toLowerCase(),
  )?.flag

  console.log({ history });

  if (!history?.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <main className="mx-auto flex w-full max-w-[500px] min-h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
          Player inactive or does not exist
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <main className="mx-auto flex w-full max-w-[500px] flex-col gap-6">
        <header className="flex items-baseline gap-3 px-1">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {playerName}
          </h1>
          {flag && (
            <span className="text-3xl leading-none md:text-4xl" aria-hidden>
              {flag}
            </span>
          )}
        </header>

        <RankHistoryChart history={history} loading={loading} error={error} />
      </main>
    </div>
  )
}
