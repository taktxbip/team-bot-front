import { createContext, useContext, type ReactNode } from 'react'
import { useCourtsData } from '@/hooks/useCourtsData'

type MatchDataContextValue = ReturnType<typeof useCourtsData>

const MatchDataContext = createContext<MatchDataContextValue | null>(null)

export function MatchDataProvider({ children }: { children: ReactNode }) {
  const value = useCourtsData()
  return <MatchDataContext.Provider value={value}>{children}</MatchDataContext.Provider>
}

export function useMatchData(): MatchDataContextValue {
  const value = useContext(MatchDataContext)
  if (!value) {
    throw new Error('useMatchData must be used within MatchDataProvider')
  }
  return value
}
