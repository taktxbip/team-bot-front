import { useEffect, useState } from 'react'
import pepeDancingSrc from '@/assets/pepe-the-frog-dancing.gif'
import { cn } from '@/lib/utils'

type MathMatchingTapeProps = {
  show: boolean
}

const phrases: string[] = [
  'Unlocking premium physics...',
  'Optimizing the impossible...',
  'Installing more RAM...',
  'Feeding the algorithm...',
  'Deploying quantum shuttles...',
  'Breaking the laws of physics...',
  'Recalculating the universe...',
  'Hacking the badminton matrix...',
  'Overclocking the shuttlecocks...',
  'Enabling paid features...',
  'Dividing by zero...',
  'Teaching rackets to cooperate...',
  'Convincing players to rotate...',
  'Calling Anton...',
  'Consulting the badminton gods...',
  'Sacrificing a shuttlecock...',
  'Bribing the algorithm...',
  'Fighting mathematical demons...',
  'Calculating the uncalculable...',
  'Making rackets great again...',
  'Asking Newton for help...',
  'Checking if Anton is available...',
  'Calculating the butterfly effect...',
  'Asking for more shuttles...',
  'Checking if physics still works...',
  'Recalculating because why not...',
  'Trying to impress Anton...',
  'Performing illegal calculations...',
  'Searching for the nearest 7-Eleven...',
  'Applying for a Thai visa...',
  'Checking if it is Songkran already...',
  'Summoning another Anton...',
  'Asking the algorithm to calm down...',
  'Compiling impossible scenarios...',
  'Activating god mode...',
  'Calibrating spiciness...',
  'Cooking Som Tam...',
  'Hiding the evidence...',
  'Calibrating smashes...',
  'Healing shuttlecocks...',
  'Installing professional skills...',
  'Calculating the perfect drop shot...',
  'Asking to play 30 minutes more...',
  'Searching for the missing talent...',
  'Generating excuses for losing...',
  'Checking the wind indoors...',
  'Waiting for the universe to respond...',
  'Increasing the court capacity...',
  'Hiding the evidence...',
  'Predicting 10–11 matchups...',
  'Looking for a monitor lizard...'
];

function pickPhrase(exclude?: string) {
  if (phrases.length <= 1) return phrases[0] ?? ''
  let next = phrases[Math.floor(Math.random() * phrases.length)]!
  while (next === exclude) {
    next = phrases[Math.floor(Math.random() * phrases.length)]!
  }
  return next
}

/**
 * Fixed loading tape across the play area while courts are being matched.
 */
export function MathMatchingTape({ show }: MathMatchingTapeProps) {
  const [phrase, setPhrase] = useState(() => pickPhrase())

  useEffect(() => {
    if (!show) return

    setPhrase(pickPhrase())
    const id = window.setInterval(() => {
      setPhrase((current) => pickPhrase(current))
    }, 5_000)

    return () => window.clearInterval(id)
  }, [show])

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
        <p className="max-w-[18ch] text-center text-2xl font-black uppercase leading-tight tracking-[0.18em] text-foreground sm:max-w-[20ch] sm:text-3xl md:max-w-[22ch] md:text-4xl">
          {phrase}
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
