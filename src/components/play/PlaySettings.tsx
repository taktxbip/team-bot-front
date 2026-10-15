import { useState } from 'react'
import { Minus, Plus, Settings } from 'lucide-react'
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
    password,
    setPassword,
  } = usePlayDisplaySettings()

  const decreaseHold = useHoldRepeat(decreaseNameFontSize, {
    enabled: canDecreaseNameFontSize,
  })
  const increaseHold = useHoldRepeat(increaseNameFontSize, {
    enabled: canIncreaseNameFontSize,
  })

  return (
    <div
      className="absolute top-1/2 -left-5 z-[60] flex -translate-y-1/2 items-center"
      aria-label="Display settings"
    >
      <div
        className={cn(
          'flex items-center overflow-hidden rounded-r-xl border border-border bg-card py-2 shadow-sm transition-[width] duration-300 ease-out',
          open ? 'w-[13.5rem]' : 'w-8',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-none py-12 hover:bg-card aria-expanded:bg-card dark:hover:bg-card dark:aria-expanded:bg-card"
          aria-expanded={open}
          aria-label={open ? 'Close display settings' : 'Open display settings'}
          onClick={() => setOpen((value) => !value)}
        >
          <Settings aria-hidden />
        </Button>

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col gap-2 px-1.5 transition-opacity duration-300',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <div className="flex items-center gap-1.5">
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

          <label className="flex flex-col gap-1 px-0.5">
            <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              spellCheck={false}
              className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
