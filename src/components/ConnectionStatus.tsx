import { useMatchData } from '@/hooks/MatchDataContext'
import { cn } from '@/lib/utils'

export function ConnectionStatus() {
  const { connected, error } = useMatchData()

  return (
    <div className="flex items-center gap-3 text-base">
      <span
        className={cn(
          'size-2 rounded-full',
          connected ? 'bg-emerald-500' : 'bg-muted-foreground/40',
        )}
      />
      <span className="hidden text-muted-foreground md:inline">
        {connected ? 'Connected' : error ? 'Disconnected' : 'Connecting…'}
      </span>
    </div>
  )
}
