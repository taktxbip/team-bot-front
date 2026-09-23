import { useEffect, useState } from 'react'
import { PLAYER_STATS_API_URL } from '@/config'
import type { PlayerRankStats, PlayerStatsApi } from '@/types/playerProfile'

type UsePlayerStatsResult = {
  stats: PlayerRankStats | null
  loading: boolean
  error: string | null
}

function mapPlayerStats(data: unknown): PlayerRankStats {
  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected player-stats response')
  }

  const item = data as Partial<PlayerStatsApi>
  const currentRank = typeof item.rank === 'number' ? item.rank : Number.NaN
  const points = typeof item.elo === 'number' ? item.elo : Number.NaN
  const gamesPlayed = typeof item.gamesPlayed === 'number' ? item.gamesPlayed : Number.NaN
  const allTimeHigh =
    typeof item.eloAllTimeHighest === 'number' ? item.eloAllTimeHighest : Number.NaN
  const allTimeLow =
    typeof item.eloAllTimeLowest === 'number' ? item.eloAllTimeLowest : Number.NaN

  if (
    ![currentRank, points, gamesPlayed, allTimeHigh, allTimeLow].every(Number.isFinite)
  ) {
    throw new Error('Unexpected player-stats response')
  }

  return {
    currentRank,
    points,
    gamesPlayed,
    allTimeHigh,
    allTimeLow,
  }
}

export function usePlayerStats(playerName: string | undefined): UsePlayerStatsResult {
  const [stats, setStats] = useState<PlayerRankStats | null>(null)
  const [loading, setLoading] = useState(Boolean(playerName))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerName) {
      setStats(null)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const url = `${PLAYER_STATS_API_URL}?name=${encodeURIComponent(playerName)}`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load player stats (${response.status})`)
        }

        const data: unknown = await response.json()
        setStats(mapPlayerStats(data))
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load player stats')
        setStats(null)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [playerName])

  return { stats, loading, error }
}
