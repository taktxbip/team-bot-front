export type Player = {
  id: string
  name: string
  rank: number
}

export type Team = {
  player1: Player
  player2: Player
  rank: number
  winProbability: number
}

export type SessionStatus = 'live' | 'finished'

export type Court = {
  id: string
  name: string
  team1: Team
  team2: Team
  winner?: 'team1' | 'team2'
}

export type CourtsMessage = {
  status: SessionStatus
  courts: Court[]
}
