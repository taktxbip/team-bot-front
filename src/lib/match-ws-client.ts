import { io, type Socket } from 'socket.io-client'
import type { CourtsMessage, SessionStatus } from '@/types/court'

export type WirePlayer = {
  id?: string
  name: string
}

export type WireTeam = {
  key: string
  won: boolean
  rank?: number
  winProbability?: number
  playerNames?: [string, string]
  player1?: WirePlayer
  player2?: WirePlayer
}

export type WireCourt = {
  id: string
  name: string
  pointsChange?: number
  team1: WireTeam
  team2: WireTeam
  winner?: 'team1' | 'team2'
}

export type MatchResultBroadcast = {
  confirmed: boolean
  type?: 'match_result'
  status?: SessionStatus
  savedAt?: string
  addedBy?: string | null
  courts: WireCourt[]
}

const defaultOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ['websocket', 'polling'] as ('websocket' | 'polling')[],
}

export function createMatchSocket(serverUrl: string): Socket {
  return io(serverUrl, defaultOptions)
}

export const SET_WINNER_EVENT = 'winner'

export function emitWinner(socket: Socket, winnerKey: string) {
  socket.emit(SET_WINNER_EVENT, winnerKey)
}

function mapWirePlayer(
  player: WirePlayer | undefined,
  fallbackName: string,
  id: string,
) {
  return {
    id: player?.id ?? id,
    name: player?.name ?? fallbackName,
  }
}

function mapWireTeam(team: WireTeam, side: 'team1' | 'team2') {
  const idPrefix = team.key || side

  return {
    key: team.key,
    rank: team.rank ?? 0,
    winProbability: team.winProbability ?? 50,
    player1: mapWirePlayer(
      team.player1,
      team.playerNames?.[0] ?? 'Player 1',
      `${idPrefix}-1`,
    ),
    player2: mapWirePlayer(
      team.player2,
      team.playerNames?.[1] ?? 'Player 2',
      `${idPrefix}-2`,
    ),
  }
}

export function mapMatchResult(payload: MatchResultBroadcast): CourtsMessage {

  console.log(payload);
  console.log('payload');

  const status = payload.status ?? 'finished';
  const output = {
    status: payload.confirmed ? 'finished' : status,
    confirmed: payload.confirmed,
    courts: payload.courts.map((court) => ({
      id: court.id,
      name: court.name.startsWith('Court') ? court.name : `Court ${court.name}`,
      winner: court.winner,
      pointsChange: court.pointsChange,
      team1: mapWireTeam(court.team1, 'team1'),
      team2: mapWireTeam(court.team2, 'team2'),
    })),
  };

  return output;
}
