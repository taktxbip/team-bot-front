import { Outlet } from 'react-router-dom'
import { AppNav } from '@/components/AppNav'
import { ConnectionStatus } from '@/components/ConnectionStatus'
import { SessionStatusLabel } from '@/components/SessionStatusLabel'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MatchDataProvider, useMatchData } from '@/hooks/MatchDataContext'
import { preloadSimpsonLoader } from '@/lib/simpsonLoader'

void preloadSimpsonLoader()

function AppHeader() {
  const { status } = useMatchData()

  return (
    <header className="mb-5 shrink-0">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="justify-self-start">
          <SessionStatusLabel status={status} />
        </div>
        <div className="justify-self-center">
          <AppNav />
        </div>
        <div className="flex items-center justify-self-end gap-3">
          <ConnectionStatus />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export function AppLayout() {
  return (
    <MatchDataProvider>
      <div className="flex min-h-svh w-full flex-col bg-background p-5 md:h-svh md:overflow-hidden">
        <AppHeader />
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </MatchDataProvider>
  )
}
