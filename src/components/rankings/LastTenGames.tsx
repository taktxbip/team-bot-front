import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLastGames, type LastGame } from '@/hooks/useLastGames'
import type { GameResult } from '@/hooks/useLastTenGames'
import type { RankingEntry } from '@/types/ranking'
import { cn } from '@/lib/utils'

export type { GameResult }

type LastTenGamesProps = {
  playerName: string
  rankings?: RankingEntry[]
  results?: GameResult[]
  loading?: boolean
  error?: string | null
}

function formatGameDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function PlayerName({
  playerId,
  namesById,
}: {
  playerId: number
  namesById: Map<number, string>
}) {
  const name = namesById.get(playerId)
  if (!name) {
    return <span className="font-semibold text-foreground">#{playerId}</span>
  }

  return (
    <Link
      to={`/rankings/${encodeURIComponent(name)}`}
      className="font-semibold text-foreground hover:underline"
    >
      {name}
    </Link>
  )
}

function GameRow({
  game,
  playerId,
  namesById,
}: {
  game: LastGame
  playerId: number | undefined
  namesById: Map<number, string>
}) {
  const team1 = game.players.filter((player) => player.team1)
  const team2 = game.players.filter((player) => !player.team1)
  const onTeam1 = playerId != null && team1.some((player) => player.playerId === playerId)
  const onTeam2 = playerId != null && team2.some((player) => player.playerId === playerId)
  const playerTeam = onTeam1 ? team1 : onTeam2 ? team2 : team1
  const opponentTeam = onTeam1 ? team2 : onTeam2 ? team1 : team2
  const playerTeamWon =
    onTeam1 ? game.winnerTeam1 : onTeam2 ? !game.winnerTeam1 : game.winnerTeam1

  return (
    <li className="border-b border-border/60 px-5 py-3 last:border-b-0">
      <div className="text-xs text-muted-foreground">{formatGameDate(game.date)}</div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm leading-snug">
        {playerTeam.map((player, index) => (
          <span key={player.id} className="inline-flex items-baseline gap-1.5">
            {index > 0 && <span className="text-muted-foreground">+</span>}
            <PlayerName playerId={player.playerId} namesById={namesById} />
          </span>
        ))}
        {playerTeamWon && (
          <span aria-label="Winner" className="leading-none">
            🏆
          </span>
        )}
        <span className="text-muted-foreground">vs</span>
        {!playerTeamWon && (
          <span aria-label="Winner" className="leading-none">
            🏆
          </span>
        )}
        {opponentTeam.map((player, index) => (
          <span key={player.id} className="inline-flex items-baseline gap-1.5">
            {index > 0 && <span className="text-muted-foreground">+</span>}
            <PlayerName playerId={player.playerId} namesById={namesById} />
          </span>
        ))}
      </div>
    </li>
  )
}

export function LastTenGames({
  playerName,
  rankings = [],
  results = [],
  loading,
  error,
}: LastTenGamesProps) {
  const games = results.slice(0, 10)
  const wins = games.filter((result) => result === 'W').length
  const total = games.length
  const {
    games: detailedGames,
    loading: gamesLoading,
    error: gamesError,
    loaded: gamesLoaded,
    load: loadGames,
  } = useLastGames(playerName)

  const namesById = new Map<number, string>()
  for (const entry of rankings) {
    if (typeof entry.id === 'number') namesById.set(entry.id, entry.name)
  }
  const playerId = rankings.find(
    (entry) => entry.name.toLowerCase() === playerName.toLowerCase(),
  )?.id

  return (
    <section className="flex flex-col gap-3">
      <header className="px-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Last 10 games</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {loading ? 'Loading…' : error ? 'Could not load recent games' : `Won ${wins}/${total}`}
        </p>
      </header>

      {loading && (
        <div className="flex min-h-12 items-center justify-center rounded-xl bg-card text-sm text-muted-foreground">
          Loading last 10 games…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-card px-5 py-4">
          <div className="text-sm font-medium text-foreground">Failed to load last 10 games</div>
          <p className="mt-1 text-sm text-muted-foreground">Play a few matches and try again 🏸</p>
        </div>
      )}

      {!loading && !error && total === 0 && (
        <div className="rounded-xl bg-card px-5 py-4 text-sm text-muted-foreground">
          No recent games yet.
        </div>
      )}

      {!loading && !error && total > 0 && (
        <ol className="relative flex items-end justify-between gap-1 sm:gap-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-2 items-center"
          >
            <div className="h-px w-full bg-border" />
          </div>
          {games.map((result, index) => {
            const won = result === 'W'
            return (
              <li
                key={`${result}-${index}`}
                className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    'text-xs font-semibold leading-none',
                    won
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {result}
                </span>
                <span
                  className={cn(
                    'aspect-square w-full max-w-2 rounded-full',
                    won
                      ? 'bg-emerald-500 dark:bg-emerald-400'
                      : 'bg-red-500 dark:bg-red-400',
                  )}
                  aria-label={won ? 'Win' : 'Loss'}
                />
              </li>
            )
          })}
        </ol>
      )}

      {!gamesLoaded && (
        <div className="px-1 mt-2">
          <Button
            className="hover:cursor-pointer"
            type="button"
            variant="outline"
            size="sm"
            disabled={gamesLoading || !playerName}
            onClick={loadGames}
          >
            {gamesLoading ? 'Loading…' : 'Show games'}
          </Button>
        </div>
      )}

      {gamesLoaded && (
        <div className="overflow-hidden rounded-xl bg-card mt-2">
          {gamesLoading && (
            <div className="flex min-h-24 items-center justify-center text-sm text-muted-foreground">
              Loading games…
            </div>
          )}

          {!gamesLoading && gamesError && (
            <div className="px-5 py-4">
              <div className="text-sm font-medium text-foreground">Failed to load games</div>
              <p className="mt-1 text-sm text-muted-foreground">{gamesError}</p>
            </div>
          )}

          {!gamesLoading && !gamesError && detailedGames.length === 0 && (
            <div className="flex min-h-24 items-center justify-center text-sm text-muted-foreground">
              No games found
            </div>
          )}

          {!gamesLoading && !gamesError && detailedGames.length > 0 && (
            <ul>
              {detailedGames.map((game) => (
                <GameRow
                  key={game.id}
                  game={game}
                  playerId={playerId}
                  namesById={namesById}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
