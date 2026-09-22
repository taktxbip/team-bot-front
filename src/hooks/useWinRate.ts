import { useEffect, useState } from 'react'
import { WIN_RATE_API_URL } from '@/config'
import type { WinRateEntry } from '@/types/playerProfile'

type UseWinRateResult = {
  winRates: WinRateEntry[]
  loading: boolean
  error: string | null
}

type WinRateApiEntry = {
  teammate_id?: number
  teammate_name?: string
  rate?: number
}

export function useWinRate(playerName: string | undefined): UseWinRateResult {
  const [winRates, setWinRates] = useState<WinRateEntry[]>([])
  const [loading, setLoading] = useState(Boolean(playerName))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerName) {
      setWinRates([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const url = `${WIN_RATE_API_URL}?name=${encodeURIComponent(playerName)}`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load win rates (${response.status})`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Unexpected win rate response')
        }

        setWinRates(
          data
            .map((entry) => {
              const item = entry as WinRateApiEntry
              const teammateName =
                typeof item.teammate_name === 'string' ? item.teammate_name : ''
              const rate = typeof item.rate === 'number' ? item.rate : Number.NaN
              const teammateId =
                typeof item.teammate_id === 'number' ? item.teammate_id : Number.NaN
              if (!teammateName || !Number.isFinite(rate)) return null
              return {
                teammateId: Number.isFinite(teammateId) ? teammateId : 0,
                teammateName,
                rate,
              } satisfies WinRateEntry
            })
            .filter((entry): entry is WinRateEntry => entry != null),
        )
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load win rates')
        setWinRates([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [playerName])

  return { winRates, loading, error }
}
