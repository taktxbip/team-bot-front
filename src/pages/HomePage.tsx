import { CourtsGrid } from '@/components/court/CourtsGrid'
import { SessionStatusLabel } from '@/components/SessionStatusLabel'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useCourtsData } from '@/hooks/useCourtsData'
import { cn } from '@/lib/utils'

export function HomePage() {
  const { courts, status, connected, error } = useCourtsData()
  const usingDummyData = !import.meta.env.VITE_WS_URL

  return (
    <div className="flex h-svh w-full flex-col bg-background p-5">
      <header className="mb-5 shrink-0">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Team Bot v2
            </h1>
            <SessionStatusLabel status={status} />
          </div>
          <div className="flex items-center gap-3 text-base">
            <ThemeToggle />
            <span
              className={cn(
                'size-2 rounded-full',
                connected ? 'bg-emerald-500' : 'bg-muted-foreground/40',
              )}
            />
            <span className="text-muted-foreground">
              {usingDummyData
                ? 'Demo data'
                : connected
                  ? 'Connected'
                  : 'Connecting…'}
            </span>
          </div>
        </div>
        {error && (
          <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <CourtsGrid courts={courts} />
      </main>
    </div>
  )
}
