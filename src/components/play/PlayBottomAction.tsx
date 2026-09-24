import { useState, type MouseEvent } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Bottom-edge arrow that slides in a Confirm button.
 * Panel chrome toggles open/closed; Confirm does not.
 */
export function PlayBottomAction() {
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen((value) => !value)

  const stopToggle = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <div
      className="fixed bottom-0 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center"
      aria-label="Play actions"
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={open ? 'Close play actions' : 'Open play actions'}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggle()
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col-reverse items-center overflow-hidden rounded-t-2xl border border-border bg-card px-3 shadow-sm outline-none transition-[height] duration-300 ease-out select-none',
          'hover:bg-card focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          open ? 'h-[7.75rem]' : 'h-12',
        )}
      >
        <span className="flex size-12 shrink-0 items-center justify-center" aria-hidden>
          <ChevronUp
            className={cn('size-7 transition-transform duration-300', open && 'rotate-180')}
          />
        </span>

        <div
          className={cn(
            'flex shrink-0 items-center justify-center px-2 pt-3 transition-opacity duration-300',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <Button
            type="button"
            className="h-16 min-w-[12rem] rounded-xl px-10 text-base font-semibold"
            onClick={stopToggle}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
