import type { Court } from '@/types/court'
import { getConfettiSizeForCourtCount } from '@/lib/teamConfetti'
import { getNameSizeForCourtCount } from '@/lib/playerNameSize'
import { cn } from '@/lib/utils'
import { CourtCardEnter } from './CourtCardEnter'

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

  const confettiSize = getConfettiSizeForCourtCount(courts.length)
  const nameSize = getNameSizeForCourtCount(courts.length)

  return (
    <div
      className={cn(
        'grid w-full gap-5 md:h-full md:flex-1 md:auto-rows-fr',
        getGridClass(courts.length),
      )}
    >
      {courts.map((court, index) => (
        <CourtCardEnter
          key={court.id}
          court={court}
          confirmed={confirmed}
          nameSize={nameSize}
          confettiSize={confettiSize}
          staggerIndex={index}
        />
      ))}
    </div>
  )
}
