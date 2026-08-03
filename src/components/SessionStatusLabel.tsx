import { Link } from 'react-router-dom'
import type { SessionStatus } from '@/types/court'
import { cn } from '@/lib/utils'

const statusLabels: Record<SessionStatus, string> = {
  live: '🏸',
  finished: '🏸',
}

type SessionStatusLabelProps = {
  status: SessionStatus
}

export function SessionStatusLabel({ status }: SessionStatusLabelProps) {
  return (
    <Link
      to="/play"
      aria-label="Play"
      className={cn(
        'inline-flex rounded-xl px-6 py-2 text-3xl font-semibold uppercase tracking-wide',
        status === 'live'
          ? 'bg-emerald-500 text-emerald-700 dark:text-emerald-400'
          : 'bg-white text-foreground dark:bg-secondary dark:text-secondary-foreground',
      )}
    >
      {statusLabels[status]}
    </Link>
  )
}
