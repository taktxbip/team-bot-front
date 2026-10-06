import { useEffect, useState } from 'react'
import { WIN_RATE_API_URL } from '@/config'
import type { TeamWinRateEntry } from '@/types/playerProfile'

type UseTeamWinRatesResult = {
  teamWinRates: TeamWinRateEntry[]
  loading: boolean
  error: string | null
}

type TeamWinRateApiEntry = {
  rate?: number
  players?: unknown
}

export function useTeamWinRates(url = WIN_RATE_API_URL): UseTeamWinRatesResult {
  const [teamWinRates, setTeamWinRates] = useState<TeamWinRateEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load team win rates (${response.status})`)
        }

        const data: unknown = await response.json()
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Unexpected team win rate response')
        }

        const entries = Object.entries(data as Record<string, TeamWinRateApiEntry>)
          .map(([key, item]) => {
            const rate = typeof item.rate === 'number' ? item.rate : Number.NaN
            const players = Array.isArray(item.players)
              ? item.players.filter((name): name is string => typeof name === 'string')
              : []
            if (!Number.isFinite(rate) || players.length < 2) return null
            return {
              key,
              players: [players[0]!, players[1]!] as [string, string],
              rate,
            } satisfies TeamWinRateEntry
          })
          .filter((entry): entry is TeamWinRateEntry => entry != null)
          .sort((a, b) => b.rate - a.rate)

        setTeamWinRates(entries)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load team win rates')
        setTeamWinRates([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [url])

  return { teamWinRates, loading, error }
}
