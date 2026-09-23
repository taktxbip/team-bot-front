export type EloHistoryEntry = {
  date: string
  elo: number
}

/** Chart point after formatting the API date for the X axis */
export type EloHistoryPoint = {
  day: string
  elo: number
  date: string
}

export type WinRateEntry = {
  teammateId: number
  teammateName: string
  rate: number
}

/** Raw `/player-stats` response */
export type PlayerStatsApi = {
  rank: number
  elo: number
  eloAllTimeLowest: number
  eloAllTimeHighest: number
  gamesPlayed: number
}

export type PlayerRankStats = {
  currentRank: number
  points: number
  gamesPlayed: number
  allTimeHigh: number
  allTimeLow: number
  conditionDescription?: string
}
