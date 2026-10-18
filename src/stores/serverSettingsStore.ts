import { useSyncExternalStore } from 'react'

export type ServerSettings = Record<string, unknown>

let settings: ServerSettings = {}
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) listener()
}

export function getServerSettings(): ServerSettings {
  return settings
}

export function setServerSettings(next: ServerSettings) {
  settings = next
  emitChange()
}

export function subscribeServerSettings(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** React hook for the WS `settings` payload. */
export function useServerSettings(): ServerSettings {
  return useSyncExternalStore(subscribeServerSettings, getServerSettings, getServerSettings)
}
