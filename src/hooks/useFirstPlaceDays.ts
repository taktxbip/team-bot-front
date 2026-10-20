import { useEffect, useState } from 'react'
import { FIRST_PLACE_DAYS_API_URL } from '@/config'
import type { FirstPlaceDaysEntry } from '@/types/playerProfile'

type UseFirstPlaceDaysResult = {
  firstPlaceDays: FirstPlaceDaysEntry[]
  loading: boolean
  error: string | null
}

type FirstPlaceDaysApiEntry = {
  player_id?: number
  name?: string
  flag?: string
  days?: number
}

export function useFirstPlaceDays(url = FIRST_PLACE_DAYS_API_URL): UseFirstPlaceDaysResult {
  const [firstPlaceDays, setFirstPlaceDays] = useState<FirstPlaceDaysEntry[]>([])
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
          throw new Error(`Failed to load first-place days (${response.status})`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Unexpected first-place days response')
        }

        const entries = data
          .map((entry) => {
            const item = entry as FirstPlaceDaysApiEntry
            const playerId = typeof item.player_id === 'number' ? item.player_id : Number.NaN
            const name = typeof item.name === 'string' ? item.name : ''
            const days = typeof item.days === 'number' ? item.days : Number.NaN
            const flag = typeof item.flag === 'string' ? item.flag : ''
            if (!name || !Number.isFinite(playerId) || !Number.isFinite(days)) return null
            return { playerId, name, flag, days } satisfies FirstPlaceDaysEntry
          })
          .filter((entry): entry is FirstPlaceDaysEntry => entry != null)
          .sort((a, b) => b.days - a.days || a.name.localeCompare(b.name))

        setFirstPlaceDays(entries)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load first-place days')
        setFirstPlaceDays([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [url])

  return { firstPlaceDays, loading, error }
}
