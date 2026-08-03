import { Outlet } from 'react-router-dom'
import { AppNav } from '@/components/AppNav'
import { ThemeToggle } from '@/components/ThemeToggle'

export function AppLayout() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-5 md:h-svh md:overflow-hidden">
      <header className="mb-5 shrink-0">
        <div className="flex w-full items-center justify-between gap-4">
          <AppNav />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
