import { useCallback, useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import welcomeSrc from '@/assets/hello-welcome.m4a'
import { MATCH_WS_URL } from '@/config'
import { dummyCourtsMessage } from '@/data/dummyCourts'
import { useToast } from '@/hooks/ToastContext'
import {
  createMatchSocket,
  emitWinner,
  mapMatchResult,
  parseToastBroadcast,
  TOAST_EVENT,
  type MatchResultBroadcast,
} from '@/lib/match-ws-client'
import { createSound, playSound, stopSound } from '@/lib/playSound'
import type { Court, SessionStatus } from '@/types/court'

function courtLineupKey(courts: Court[]) {
  return courts
    .map(
      (court) =>
        `${court.id}:${court.team1.player1.id},${court.team1.player2.id}:${court.team2.player1.id},${court.team2.player2.id}`,
    )
    .join('|')
}

type UseCourtsDataResult = {
  courts: Court[]
  status: SessionStatus
  confirmed: boolean
  connected: boolean
  error: string | null
  pendingWinnerKey: string | null
  selectWinner: (winnerKey: string) => void
}

export function useCourtsData(serverUrl = MATCH_WS_URL): UseCourtsDataResult {
  const [courts, setCourts] = useState<Court[]>(dummyCourtsMessage.courts)
  const [status, setStatus] = useState<SessionStatus>(dummyCourtsMessage.status)
  const [confirmed, setConfirmed] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingWinnerKey, setPendingWinnerKey] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const lineupKeyRef = useRef(courtLineupKey(dummyCourtsMessage.courts))
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null)
  const { pushToast } = useToast()
  const pushToastRef = useRef(pushToast)
  pushToastRef.current = pushToast

  useEffect(() => {
    const welcomeAudio = createSound(welcomeSrc)
    welcomeAudioRef.current = welcomeAudio
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

    const onMatchResult = (payload: MatchResultBroadcast) => {
      try {
        const message = mapMatchResult(payload)
        const lineupKey = courtLineupKey(message.courts)
        const isNewLineup = lineupKey.length > 0 && lineupKey !== lineupKeyRef.current
        lineupKeyRef.current = lineupKey
        setCourts(message.courts)
        setStatus(message.status)
        setConfirmed(Boolean(message.confirmed))
        setPendingWinnerKey(null)
        setError(null)
        if (isNewLineup && welcomeAudioRef.current) playSound(welcomeAudioRef.current)
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
      stopSound(welcomeAudio)
      welcomeAudioRef.current = null
    }
  }, [serverUrl])

  const selectWinner = useCallback((winnerKey: string) => {
    const socket = socketRef.current
    if (!socket?.connected) return
    setPendingWinnerKey(winnerKey)
    emitWinner(socket, winnerKey)
  }, [])

  return { courts, status, confirmed, connected, error, pendingWinnerKey, selectWinner }
}
