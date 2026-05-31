import { useEffect, useState } from 'react'
import { dummyCourtsMessage } from '@/data/dummyCourts'
import type { Court, CourtsMessage, SessionStatus } from '@/types/court'

type UseCourtsDataResult = {
  courts: Court[]
  status: SessionStatus
  connected: boolean
  error: string | null
}

function parseCourtsMessage(data: unknown): CourtsMessage {
  const message = data as CourtsMessage
  if (!Array.isArray(message?.courts)) {
    throw new Error('Invalid courts payload')
  }
  if (message.status !== 'live' && message.status !== 'finished') {
    throw new Error('Invalid session status')
  }
  return message
}

export function useCourtsData(wsUrl = import.meta.env.VITE_WS_URL): UseCourtsDataResult {
  const [courts, setCourts] = useState<Court[]>(dummyCourtsMessage.courts)
  const [status, setStatus] = useState<SessionStatus>(dummyCourtsMessage.status)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!wsUrl) return

    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      setConnected(true)
      setError(null)
    }

    socket.onmessage = (event) => {
      try {
        const payload = parseCourtsMessage(JSON.parse(event.data as string) as unknown)
        setCourts(payload.courts)
        setStatus(payload.status)
      } catch {
        setError('Failed to parse courts data')
      }
    }

    socket.onerror = () => {
      setError('WebSocket connection error')
    }

    socket.onclose = () => {
      setConnected(false)
    }

    return () => {
      socket.close()
    }
  }, [wsUrl])

  return { courts, status, connected, error }
}
