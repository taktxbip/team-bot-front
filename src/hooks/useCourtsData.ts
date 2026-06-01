import { useEffect, useState } from 'react'
import { dummyCourtsMessage } from '@/data/dummyCourts'
import {
  createMatchSocket,
  getMatchServerUrl,
  mapMatchResult,
  type MatchResultBroadcast,
} from '@/lib/match-ws-client'
import type { Court, SessionStatus } from '@/types/court'

type UseCourtsDataResult = {
  courts: Court[]
  status: SessionStatus
  confirmed: boolean
  connected: boolean
  error: string | null
}

export function useCourtsData(serverUrl = getMatchServerUrl()): UseCourtsDataResult {
  const [courts, setCourts] = useState<Court[]>(dummyCourtsMessage.courts)
  const [status, setStatus] = useState<SessionStatus>(dummyCourtsMessage.status)
  const [confirmed, setConfirmed] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const socket = createMatchSocket(serverUrl)

    const onConnect = () => {
      setConnected(true)
      setError(null)
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    const onConnectError = (err: Error) => {
      setConnected(false)
      setError(err.message)
    }

    const onMatchResult = (payload: MatchResultBroadcast) => {
      try {
        const message = mapMatchResult(payload)
        setCourts(message.courts)
        setStatus(message.status)
        setConfirmed(Boolean(message.confirmed))
        setError(null)
      } catch {
        setError('Failed to parse match result')
      }
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('match_result', onMatchResult)

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('match_result', onMatchResult)
      socket.disconnect()
    }
  }, [serverUrl])

  return { courts, status, confirmed, connected, error }
}
