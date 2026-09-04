import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'play-name-font-size'
const DEFAULT_NAME_FONT_SIZE = 18
const MIN_NAME_FONT_SIZE = 12
const MAX_NAME_FONT_SIZE = 80
const NAME_FONT_SIZE_STEP = 2

function clampNameFontSize(value: number): number {
  return Math.min(MAX_NAME_FONT_SIZE, Math.max(MIN_NAME_FONT_SIZE, value))
}

function readStoredNameFontSize(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null) return DEFAULT_NAME_FONT_SIZE
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return DEFAULT_NAME_FONT_SIZE
    return clampNameFontSize(parsed)
  } catch {
    return DEFAULT_NAME_FONT_SIZE
  }
}

type PlayDisplaySettingsContextValue = {
  nameFontSize: number
  canDecreaseNameFontSize: boolean
  canIncreaseNameFontSize: boolean
  decreaseNameFontSize: () => void
  increaseNameFontSize: () => void
}

const PlayDisplaySettingsContext = createContext<PlayDisplaySettingsContextValue | null>(null)

export function PlayDisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [nameFontSize, setNameFontSize] = useState(readStoredNameFontSize)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(nameFontSize))
    } catch {
      // Ignore quota / private-mode failures
    }
  }, [nameFontSize])

  const value = useMemo<PlayDisplaySettingsContextValue>(
    () => ({
      nameFontSize,
      canDecreaseNameFontSize: nameFontSize > MIN_NAME_FONT_SIZE,
      canIncreaseNameFontSize: nameFontSize < MAX_NAME_FONT_SIZE,
      decreaseNameFontSize: () =>
        setNameFontSize((size) => clampNameFontSize(size - NAME_FONT_SIZE_STEP)),
      increaseNameFontSize: () =>
        setNameFontSize((size) => clampNameFontSize(size + NAME_FONT_SIZE_STEP)),
    }),
    [nameFontSize],
  )

  return (
    <PlayDisplaySettingsContext.Provider value={value}>
      {children}
    </PlayDisplaySettingsContext.Provider>
  )
}

export function usePlayDisplaySettings() {
  const context = useContext(PlayDisplaySettingsContext)
  if (!context) {
    throw new Error('usePlayDisplaySettings must be used within PlayDisplaySettingsProvider')
  }
  return context
}
