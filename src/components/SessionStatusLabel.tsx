import type { SessionStatus } from '@/types/court'
import { cn } from '@/lib/utils'

const statusLabels: Record<SessionStatus, string> = {
  live: 'Live',
  finished: 'Finished',
}

type SessionStatusLabelProps = {
  status: SessionStatus
}

export function SessionStatusLabel({ status }: SessionStatusLabelProps) {
  return (
    <span
      className={cn(
        'rounded-xl px-6 py-2 text-3xl font-semibold uppercase tracking-wide',
        status === 'live'
          ? 'bg-emerald-500/15 text-emerald-700 animate-pulse dark:text-emerald-400'
          : 'bg-white text-foreground dark:bg-secondary dark:text-secondary-foreground',
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
