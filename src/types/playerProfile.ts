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
