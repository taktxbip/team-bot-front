import { useEffect, useState } from 'react'
import { ELO_HISTORY_API_URL } from '@/config'
import type { EloHistoryEntry, EloHistoryPoint } from '@/types/playerProfile'

type UseEloHistoryResult = {
  history: EloHistoryPoint[]
  loading: boolean
  error: string | null
}

function ordinal(day: number): string {
  const mod100 = day % 100
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`
  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

function formatDayLabel(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate

  const month = date.toLocaleString('en-US', { month: 'long' })
  return `${month} ${ordinal(date.getDate())}`
}

function formatElo(elo: number): number {
  return Math.round(elo * 10) / 10
}

export function useEloHistory(playerName: string | undefined): UseEloHistoryResult {
  const [history, setHistory] = useState<EloHistoryPoint[]>([])
  const [loading, setLoading] = useState(Boolean(playerName))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playerName) {
      setHistory([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const url = `${ELO_HISTORY_API_URL}?name=${encodeURIComponent(playerName)}`
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to load elo history (${response.status})`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Unexpected elo history response')
        }

        const points = data
          .map((entry) => {
            const item = entry as Partial<EloHistoryEntry>
            const date = typeof item.date === 'string' ? item.date : ''
            const elo = typeof item.elo === 'number' ? item.elo : Number.NaN
            if (!date || !Number.isFinite(elo)) return null
            return {
              date,
              day: formatDayLabel(date),
              elo: formatElo(elo),
            } satisfies EloHistoryPoint
          })
          .filter((entry): entry is EloHistoryPoint => entry != null)
          .sort((a, b) => a.date.localeCompare(b.date))

        setHistory(points)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load elo history')
        setHistory([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [playerName])

  return { history, loading, error }
}
