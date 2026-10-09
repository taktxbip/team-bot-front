import { useCallback, useEffect, useRef, useState } from 'react'
import { LAST_GAMES_API_URL } from '@/config'

export type LastGameMatchPlayer = {
  id: number
  team1: boolean
  matchId: number
  playerId: number
}

export type LastGame = {
  id: number
  date: string
  winnerTeam1: boolean
  players: LastGameMatchPlayer[]
}

type UseLastGamesResult = {
  games: LastGame[]
  loading: boolean
  error: string | null
  loaded: boolean
  load: () => void
}

type LastGamesApiMatchPlayer = {
  id?: number
  team1?: boolean
  match_id?: number
  player_id?: number
}

type LastGamesApiMatch = {
  id?: number
  date?: string
  winnerTeam1?: boolean
  match_players?: LastGamesApiMatchPlayer[]
}

function parseLastGames(data: unknown): LastGame[] {
  if (!Array.isArray(data)) {
    throw new Error('Unexpected last-games response')
  }

  return data
    .map((entry) => {
      const item = entry as LastGamesApiMatch
      const id = typeof item.id === 'number' ? item.id : Number.NaN
      const date = typeof item.date === 'string' ? item.date : ''
      if (!Number.isFinite(id) || !date || typeof item.winnerTeam1 !== 'boolean') return null

      const players = (Array.isArray(item.match_players) ? item.match_players : [])
        .map((player) => {
          const playerId = typeof player.player_id === 'number' ? player.player_id : Number.NaN
          if (!Number.isFinite(playerId) || typeof player.team1 !== 'boolean') return null
          return {
            id: typeof player.id === 'number' ? player.id : playerId,
            team1: player.team1,
            matchId: typeof player.match_id === 'number' ? player.match_id : id,
            playerId,
          } satisfies LastGameMatchPlayer
        })
        .filter((player): player is LastGameMatchPlayer => player != null)

      return {
        id,
        date,
        winnerTeam1: item.winnerTeam1,
        players,
      } satisfies LastGame
    })
    .filter((game): game is LastGame => game != null)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export function useLastGames(playerName: string | undefined): UseLastGamesResult {
  const [games, setGames] = useState<LastGame[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const loadingRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = null
    loadingRef.current = false
    setGames([])
    setLoading(false)
    setError(null)
    setLoaded(false)

    return () => {
      abortRef.current?.abort()
      abortRef.current = null
    }
  }, [playerName])

  const load = useCallback(() => {
    if (!playerName || loadingRef.current) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    loadingRef.current = true
    setLoading(true)
    setError(null)

    async function fetchGames() {
      try {
        const url = `${LAST_GAMES_API_URL}?name=${encodeURIComponent(playerName!)}`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load games (${response.status})`)
        }

        const data: unknown = await response.json()
        setGames(parseLastGames(data))
        setLoaded(true)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load games')
        setGames([])
        setLoaded(true)
      } finally {
        if (!controller.signal.aborted) {
          loadingRef.current = false
          setLoading(false)
        }
      }
    }

    void fetchGames()
  }, [playerName])

  return { games, loading, error, loaded, load }
}
