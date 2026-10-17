import { useCallback, useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import {
  MATCH_WS_URL,
  SAVE_WINNER_API_URL,
  SET_WINNER_API_URL,
  START_API_URL,
} from '@/config'
import { dummyCourtsMessage } from '@/data/dummyCourts'
import { readStoredPassword } from '@/hooks/PlayDisplaySettingsContext'
import { useToast } from '@/hooks/ToastContext'
import {
  createMatchSocket,
  mapMatchResult,
  parseToastBroadcast,
  TOAST_EVENT,
  type MatchResultBroadcast,
} from '@/lib/match-ws-client'
import { getTeamWinnerKey } from '@/lib/utils'
import type { Court, SessionStatus } from '@/types/court'

type UseCourtsDataResult = {
  courts: Court[]
  status: SessionStatus
  connected: boolean
  error: string | null
  pendingWinnerKey: string | null
  selectWinner: (winnerKey: string) => void
  saveWinner: (courtId: string) => void
}

export function useCourtsData(serverUrl = MATCH_WS_URL): UseCourtsDataResult {
  const [courts, setCourts] = useState<Court[]>(dummyCourtsMessage.courts)
  const [status, setStatus] = useState<SessionStatus>(dummyCourtsMessage.status)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingWinnerKey, setPendingWinnerKey] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const startSentRef = useRef(false)
  const { pushToast } = useToast()
  const pushToastRef = useRef(pushToast)
  pushToastRef.current = pushToast

  useEffect(() => {
    const socket = createMatchSocket(serverUrl)
    socketRef.current = socket

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

    const postStart = async () => {
      try {
        const response = await fetch(START_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: readStoredPassword(),
          }),
        })
        if (response.status !== 200) {
          throw new Error(`Failed to start (${response.status})`)
        }
      } catch {
        startSentRef.current = false
      }
    }

    const onMatchResult = (payload: MatchResultBroadcast) => {
      try {
        const message = mapMatchResult(payload)
        setCourts(message.courts)
        setStatus(message.status)
        setPendingWinnerKey(null)
        setError(null)

        const allConfirmed =
          message.courts.length > 0 && message.courts.every((court) => court.confirmed)
        if (!allConfirmed) {
          startSentRef.current = false
        } else if (!startSentRef.current) {
          startSentRef.current = true
          void postStart()
        }
      } catch {
        setError('Failed to parse match result')
      }
    }

    const onToast = (payload: unknown) => {
      const toast = parseToastBroadcast(payload)
      if (!toast) return
      pushToastRef.current(toast)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('match_result', onMatchResult)
    socket.on(TOAST_EVENT, onToast)

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('match_result', onMatchResult)
      socket.off(TOAST_EVENT, onToast)
      socket.disconnect()
      socketRef.current = null
    }
  }, [serverUrl])

  const selectWinner = useCallback((winnerKey: string) => {
    if (pendingWinnerKey) return

    setPendingWinnerKey(winnerKey)

    void (async () => {
      try {
        const response = await fetch(SET_WINNER_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: readStoredPassword(),
            winnerKey,
          }),
        })

        if (response?.status !== 200) {
          throw new Error(`Failed to set winner (${response.status})`)
        }
      } catch (err) {
        pushToastRef.current({
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to set winner',
        })
      } finally {
        setPendingWinnerKey(null)
      }
    })()
  }, [pendingWinnerKey])

  const saveWinner = useCallback(
    (courtId: string) => {
      if (pendingWinnerKey) return

      const court = courts.find((entry) => entry.id === courtId)
      if (!court?.winner) return

      const winnerTeam = court.winner === 'team1' ? court.team1 : court.team2
      const winnerKey = getTeamWinnerKey(winnerTeam)
      setPendingWinnerKey(winnerKey)

      void (async () => {
        try {
          const response = await fetch(SAVE_WINNER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              password: readStoredPassword(),
              courtId,
              winnerKey,
            }),
          })

          if (response?.status !== 200) {
            throw new Error(`Failed to save winner (${response.status})`)
          }
        } catch (err) {
          pushToastRef.current({
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to save winner',
          })
        } finally {
          setPendingWinnerKey(null)
        }
      })()
    },
    [courts, pendingWinnerKey],
  )

  return {
    courts,
    status,
    connected,
    error,
    pendingWinnerKey,
    selectWinner,
    saveWinner,
  }
}
