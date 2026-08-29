import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const DEFAULT_NAME_FONT_SIZE = 18
const MIN_NAME_FONT_SIZE = 12
const MAX_NAME_FONT_SIZE = 80
const NAME_FONT_SIZE_STEP = 2

type PlayDisplaySettingsContextValue = {
  nameFontSize: number
  canDecreaseNameFontSize: boolean
  canIncreaseNameFontSize: boolean
  decreaseNameFontSize: () => void
  increaseNameFontSize: () => void
}

const PlayDisplaySettingsContext = createContext<PlayDisplaySettingsContextValue | null>(null)

export function PlayDisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [nameFontSize, setNameFontSize] = useState(DEFAULT_NAME_FONT_SIZE)

  const value = useMemo<PlayDisplaySettingsContextValue>(
    () => ({
      nameFontSize,
      canDecreaseNameFontSize: nameFontSize > MIN_NAME_FONT_SIZE,
      canIncreaseNameFontSize: nameFontSize < MAX_NAME_FONT_SIZE,
      decreaseNameFontSize: () =>
        setNameFontSize((size) => Math.max(MIN_NAME_FONT_SIZE, size - NAME_FONT_SIZE_STEP)),
      increaseNameFontSize: () =>
        setNameFontSize((size) => Math.min(MAX_NAME_FONT_SIZE, size + NAME_FONT_SIZE_STEP)),
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
