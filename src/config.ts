/** Socket.IO host (no protocol). Server must expose HTTPS/WSS when the app is served over HTTPS. */
const MATCH_WS_HOST = 'bbbplay.top'
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
