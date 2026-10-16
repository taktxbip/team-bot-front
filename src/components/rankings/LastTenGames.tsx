import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  signedEloChange,
  useLastGames,
  type LastGame,
} from '@/hooks/useLastGames'
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

type DayPoint = {
  time: string
  points: number
  change: number
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

function formatTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatElo(value: number): string {
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1)
  return value > 0 ? `+${rounded}` : rounded
}

function playDayKey(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildPlayDaySeries(games: LastGame[], playerId: number | undefined): DayPoint[] {
  if (!games.length) return []

  const newestDay = playDayKey(games[0]!.date)
  const dayGames = games
    .filter((game) => playDayKey(game.date) === newestDay)
    .slice()
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))

  let total = 0
  const points: DayPoint[] = [{ time: 'Start', points: 0, change: 0 }]
  for (const game of dayGames) {
    const change = signedEloChange(game, playerId)
    total += change
    points.push({
      time: formatTime(game.date),
      points: Number(total.toFixed(1)),
      change,
    })
  }
  return points
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
  const elo = signedEloChange(game, playerId)

  return (
    <li className="border-b border-border/60 px-5 py-3 last:border-b-0">
      <div className="text-xs text-muted-foreground">{formatGameDate(game.date)}</div>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm leading-snug">
          {playerTeam.map((player, index) => (
            <span key={player.id} className="inline-flex items-baseline gap-1.5">
              {index > 0 && <span className="text-muted-foreground">-</span>}
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
        <span
          className={cn(
            'shrink-0 text-sm tabular-nums',
            elo > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : elo < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-muted-foreground',
          )}
        >
          {formatElo(elo)}
        </span>
      </div>
    </li>
  )
}

function PlayDayPointsChart({ data }: { data: DayPoint[] }) {
  if (!data.length) return null

  return (
    <div className="rounded-xl bg-card">
      <div className="border-b px-5 py-3">
        <h3 className="text-sm font-medium text-muted-foreground">Point change today</h3>
      </div>
      <div className="h-52 w-full px-2 py-4 sm:px-4 [&_.recharts-surface]:outline-none [&_svg]:outline-none [&_*]:outline-none [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              dataKey="points"
              domain={['auto', 'auto']}
              width={40}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatElo(Number(value))}
            />
            <Tooltip
              cursor={{ stroke: 'var(--border)' }}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--muted-foreground)' }}
              formatter={(value, _name, item) => {
                const change = Number(item?.payload?.change ?? 0)
                return [`${formatElo(Number(value))} (${formatElo(change)})`, 'Points']
              }}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--chart-2)', strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
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

  const playDaySeries = useMemo(
    () => buildPlayDaySeries(detailedGames, playerId),
    [detailedGames, playerId],
  )

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
        <div className="mt-2 px-1">
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
        <div className="mt-2 flex flex-col gap-3">
          {gamesLoading && (
            <div className="flex min-h-24 items-center justify-center rounded-xl bg-card text-sm text-muted-foreground">
              Loading games…
            </div>
          )}

          {!gamesLoading && gamesError && (
            <div className="rounded-xl bg-card px-5 py-4">
              <div className="text-sm font-medium text-foreground">Failed to load games</div>
              <p className="mt-1 text-sm text-muted-foreground">{gamesError}</p>
            </div>
          )}

          {!gamesLoading && !gamesError && detailedGames.length === 0 && (
            <div className="flex min-h-24 items-center justify-center rounded-xl bg-card text-sm text-muted-foreground">
              No games found
            </div>
          )}

          {!gamesLoading && !gamesError && detailedGames.length > 0 && (
            <>
              <PlayDayPointsChart data={playDaySeries} />
              <div className="overflow-hidden rounded-xl bg-card">
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
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
