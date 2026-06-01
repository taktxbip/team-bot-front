type SessionStatus = 'live' | 'finished'

type Player = {
  id: string
  name: string
}

type Team = {
  player1: Player
  player2: Player
  rank: number
  winProbability: number
}

type Court = {
  id: string
  name: string
  team1: Team
  team2: Team
  winner?: 'team1' | 'team2'
  pointsChange?: number
}

type CourtsMessage = {
  status: SessionStatus
  confirmed?: boolean
  courts: Court[]
}

export type {
  Player,
  Team,
  SessionStatus,
  Court,
  CourtsMessage
}