import pepeDancingSrc from '@/assets/pepe-the-frog-dancing.gif'
import { cn } from '@/lib/utils'

type MathMatchingTapeProps = {
  show: boolean
}

/**
 * Fixed loading tape across the play area while courts are being matched.
 */
export function MathMatchingTape({ show }: MathMatchingTapeProps) {
  if (!show) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          'math-matching-tape flex w-[160vw] -rotate-6 scale-[1.02] items-center justify-center gap-6',
          'border-y-4 border-foreground py-6 shadow-lg sm:gap-8',
        )}
      >
        <img
          src={pepeDancingSrc}
          alt=""
          aria-hidden
          className="h-28 w-auto shrink-0 sm:h-36 md:h-44"
        />
        <p className="whitespace-nowrap text-2xl font-black uppercase tracking-[0.18em] text-foreground sm:text-3xl md:text-4xl">
          Math is mathing...
        </p>
        <img
          src={pepeDancingSrc}
          alt=""
          aria-hidden
          className="h-28 w-auto shrink-0 sm:h-36 md:h-44"
        />
      </div>
    </div>
  )
}
