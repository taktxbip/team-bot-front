import { useEffect, useState } from 'react'
import { RANKINGS_API_URL } from '@/config'
import type { RankingEntry } from '@/types/ranking'

type UseRankingsResult = {
  rankings: RankingEntry[]
  loading: boolean
  error: string | null
}

export function useRankings(url = RANKINGS_API_URL): UseRankingsResult {
  const [rankings, setRankings] = useState<RankingEntry[]>([])
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
          throw new Error(`Failed to load rankings (${response.status})`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Unexpected rankings response')
        }

        setRankings(
          data.map((entry) => {
            const item = entry as Partial<RankingEntry>
            return {
              name: item.name ?? 'Unknown',
              elo: typeof item.elo === 'number' ? item.elo : 0,
              flag: item.flag ?? '',
              change: typeof item.change === 'number' ? Math.trunc(item.change) : 0,
              changeElo: typeof item.changeElo === 'number' ? item.changeElo : 0,
            }
          }),
        )
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load rankings')
        setRankings([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [url])

  return { rankings, loading, error }
}
