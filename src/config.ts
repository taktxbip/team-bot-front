/** Socket.IO host (no protocol). Server must expose HTTPS/WSS when the app is served over HTTPS. */
const MATCH_WS_HOST = 'api.bbbplay.top'
// const MATCH_WS_HOST = 'localhost:5500'

function resolveMatchWsUrl(): string {
  const useSecure =
    typeof window !== 'undefined'
      ? window.location.protocol === 'https:'
      : import.meta.env.PROD

  return `${useSecure ? 'https' : 'http'}://${MATCH_WS_HOST}`
}

/** Socket.IO server for live match results */
export const MATCH_WS_URL = resolveMatchWsUrl()

/** Rankings REST API */
export const RANKINGS_API_URL = 'https://api.bbbplay.top/rankings'
// export const RANKINGS_API_URL = 'http://localhost:5500/rankings'

/** Elo history REST API (`?name=` query) */
export const ELO_HISTORY_API_URL = 'https://api.bbbplay.top/elo-history'
// export const ELO_HISTORY_API_URL = 'http://localhost:5500/elo-history'

/** Win rate REST API (`?name=` query) */
export const WIN_RATE_API_URL = 'https://api.bbbplay.top/win-rate'
// export const WIN_RATE_API_URL = 'http://localhost:5500/win-rate'

/** Last ten games REST API (`?name=` query) — boolean[] wins */
export const LAST_TEN_GAMES_API_URL = 'https://api.bbbplay.top/last-ten-games'
// export const LAST_TEN_GAMES_API_URL = 'http://localhost:5500/last-ten-games'

/** Player stats REST API (`?name=` query) */
export const PLAYER_STATS_API_URL = 'https://api.bbbplay.top/player-stats'
// export const PLAYER_STATS_API_URL = 'http://localhost:5500/player-stats'
