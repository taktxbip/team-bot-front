type SessionStatus = 'live' | 'finished'

type Player = {
  id: string
  name: string
}

type TeamStamp = '' | 'best-teammates' | 'coin-flip'

type Team = {
  key?: string
  player1: Player
  player2: Player
  rank: number
  winProbability: number
  stamp: TeamStamp
}

type Court = {
  id: string
  name: string
  team1: Team
  team2: Team
  winner?: 'team1' | 'team2'
  pointsChange?: number
  confirmed: boolean
}

type CourtsMessage = {
  status: SessionStatus
  courts: Court[]
}

export type {
  Player,
  Team,
  TeamStamp,
  SessionStatus,
  Court,
  CourtsMessage,
}
