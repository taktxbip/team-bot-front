import type { Court } from '@/types/court'
import { cn } from '@/lib/utils'
import { CourtCard } from './CourtCard'

type CourtsGridProps = {
  courts: Court[]
  confirmed?: boolean
}

function getGridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-1 md:grid-cols-2'
  if (count <= 6) return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
}

export function CourtsGrid({ courts, confirmed }: CourtsGridProps) {
  if (courts.length === 0) {
    return (
      <div className="flex min-h-48 w-full items-center justify-center rounded-xl border border-dashed text-muted-foreground md:h-full">
        No courts to display
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid w-full gap-5 md:h-full md:flex-1 md:auto-rows-fr',
        getGridClass(courts.length)
      )}
    >
      {courts.map((court) => (
        <CourtCard key={court.id} court={court} confirmed={confirmed} largeNames={courts.length === 1} />
      ))}
    </div>
  )
}
