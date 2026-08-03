import { CourtsGrid } from '@/components/court/CourtsGrid'
import { SessionStatusLabel } from '@/components/SessionStatusLabel'
import { useCourtsData } from '@/hooks/useCourtsData'
import { cn } from '@/lib/utils'

export function PlayPage() {
  const { courts, status, confirmed, connected, error } = useCourtsData()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-5 flex shrink-0 items-center justify-between gap-4">
        <SessionStatusLabel status={status} />
        <div className="flex items-center gap-3 text-base">
          <span
            className={cn(
              'size-2 rounded-full',
              connected ? 'bg-emerald-500' : 'bg-muted-foreground/40',
            )}
          />
          <span className="text-muted-foreground">
            {connected ? 'Connected' : error ? 'Disconnected' : 'Connecting…'}
          </span>
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <main className="flex min-h-0 flex-1 flex-col">
        <CourtsGrid courts={courts} confirmed={confirmed} />
      </main>
    </div>
  )
}
