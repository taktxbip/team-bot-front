import { useParams } from 'react-router-dom'
import { FitWidthText } from '@/components/FitWidthText'
import { LastTenGames } from '@/components/rankings/LastTenGames'
import { PlayerStatsCards } from '@/components/rankings/PlayerStatsCards'
import { RankHistoryChart } from '@/components/rankings/RankHistoryChart'
import { WinRateTable } from '@/components/rankings/WinRateTable'
import { useEloHistory } from '@/hooks/useEloHistory'
import { useLastTenGames } from '@/hooks/useLastTenGames'
import { usePlayerStats } from '@/hooks/usePlayerStats'
import { useRankings } from '@/hooks/useRankings'
import { useWinRate } from '@/hooks/useWinRate'

export function PlayerRankingsPage() {
  const { playerName: playerNameParam } = useParams<{ playerName: string }>()
  const playerName = playerNameParam ? decodeURIComponent(playerNameParam) : ''
  const { history, loading, error } = useEloHistory(playerName || undefined)
  const {
    winRates,
    loading: winRatesLoading,
    error: winRatesError,
  } = useWinRate(playerName || undefined)
  const {
    results: lastTenResults,
    loading: lastTenLoading,
    error: lastTenError,
  } = useLastTenGames(playerName || undefined)
  const {
    stats: playerStats,
    loading: playerStatsLoading,
    error: playerStatsError,
  } = usePlayerStats(playerName || undefined)
  const { rankings } = useRankings()
  const flag = rankings.find(
    (entry) => entry.name.toLowerCase() === playerName.toLowerCase(),
  )?.flag

  if (!playerName) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <main className="mx-auto flex w-full max-w-[500px] min-h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
          Player not found
        </main>
      </div>
    )
  }

  if (!loading && !history.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <main className="mx-auto flex w-full max-w-[500px] min-h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
          Player inactive or does not exist
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 select-none overflow-hidden px-5 md:px-8"
        aria-hidden
      >
        <FitWidthText
          text={playerName}
          fill={0.8}
          className="-translate-y-[12%] font-black tracking-tighter text-foreground/[0.07] dark:text-foreground/[0.09]"
        />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[500px] flex-col gap-6">
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

        <PlayerStatsCards
          stats={playerStats}
          loading={playerStatsLoading}
          error={playerStatsError}
        />

        <LastTenGames
          results={lastTenResults}
          loading={lastTenLoading}
          error={lastTenError}
        />
        <RankHistoryChart history={history} loading={loading} error={error} />
        <WinRateTable
          playerName={playerName}
          winRates={winRates}
          loading={winRatesLoading}
          error={winRatesError}
        />
      </main>
    </div>
  )
}
