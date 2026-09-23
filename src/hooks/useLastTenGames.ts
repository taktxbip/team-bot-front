import { useEffect, useState } from 'react'
import { LAST_TEN_GAMES_API_URL } from '@/config'

export type GameResult = 'W' | 'L'

type UseLastTenGamesResult = {
  results: GameResult[]
  loading: boolean
  error: string | null
}

function toGameResults(data: unknown): GameResult[] {
  if (!Array.isArray(data)) {
    throw new Error('Unexpected last-ten-games response')
  }

  return data
    .filter((entry): entry is boolean => typeof entry === 'boolean')
    .slice(0, 10)
    .map((won) => (won ? 'W' : 'L'))
}

export function useLastTenGames(playerName: string | undefined): UseLastTenGamesResult {
  const [results, setResults] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(Boolean(playerName))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerName) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const url = `${LAST_TEN_GAMES_API_URL}?name=${encodeURIComponent(playerName)}`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load last ten games (${response.status})`)
        }

        const data: unknown = await response.json()
        setResults(toGameResults(data))
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load last ten games')
        setResults([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [playerName])

  return { results, loading, error }
}
