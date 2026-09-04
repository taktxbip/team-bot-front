import { useState } from 'react'
import { ChevronRight, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlayDisplaySettings } from '@/hooks/PlayDisplaySettingsContext'
import { useHoldRepeat } from '@/hooks/useHoldRepeat'
import { cn } from '@/lib/utils'

export function PlaySettings() {
  const [open, setOpen] = useState(false)
  const {
    canDecreaseNameFontSize,
    canIncreaseNameFontSize,
    decreaseNameFontSize,
    increaseNameFontSize,
  } = usePlayDisplaySettings()

  const decreaseHold = useHoldRepeat(decreaseNameFontSize, {
    enabled: canDecreaseNameFontSize,
  })
  const increaseHold = useHoldRepeat(increaseNameFontSize, {
    enabled: canIncreaseNameFontSize,
  })

  return (
    <div
      className="absolute top-1/2 -left-5 z-20 flex -translate-y-1/2 items-center"
      aria-label="Display settings"
    >
      <div
        className={cn(
          'flex items-center overflow-hidden rounded-r-xl border border-border bg-card py-2 shadow-sm transition-[width] duration-300 ease-out',
          open ? 'w-[9.5rem]' : 'w-8',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-none hover:bg-card aria-expanded:bg-card dark:hover:bg-card dark:aria-expanded:bg-card"
          aria-expanded={open}
          aria-label={open ? 'Close display settings' : 'Open display settings'}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronRight
            className={cn('transition-transform duration-300', open && 'rotate-180')}
            aria-hidden
          />
        </Button>

        <div
          className={cn(
            'flex min-w-0 flex-1 items-center justify-center gap-1.5 px-1.5 transition-opacity duration-300',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Decrease name size"
            disabled={!canDecreaseNameFontSize}
            {...decreaseHold}
          >
            <Minus aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label="Increase name size"
            disabled={!canIncreaseNameFontSize}
            {...increaseHold}
          >
            <Plus aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  )
}
