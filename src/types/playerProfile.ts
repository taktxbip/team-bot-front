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

/** Global team pair from unfiltered `/win-rate` */
export type TeamWinRateEntry = {
  key: string
  players: [string, string]
  rate: number
}

/** Days a player finished first, from `/first-place-days` */
export type FirstPlaceDaysEntry = {
  playerId: number
  name: string
  flag: string
  days: number
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
