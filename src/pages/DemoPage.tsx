import { useState, type ReactNode } from 'react'
import { Stamp } from '@/components/rankings/Stamp'
import { cn } from '@/lib/utils'

function DemoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

const STAMP_COLORS = [
  { label: 'Foreground', value: undefined },
  { label: 'Sky', value: '#0284c7' },
  { label: 'Forest', value: '#3f6b54' },
  { label: 'Violet', value: '#7c3aed' },
] as const

export function DemoPage() {
  const [stampColor, setStampColor] = useState<string | undefined>(undefined)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <main className="mx-auto flex w-full max-w-[500px] flex-col gap-10 pb-10">
        <header className="px-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Demo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sandbox for rankings UI with static mock data.
          </p>
        </header>

        <DemoBlock title="Stamps">
          <div className="flex flex-col gap-4 rounded-xl bg-card px-5 py-6">
            <div className="flex flex-wrap items-center gap-2">
              {STAMP_COLORS.map((swatch) => {
                const active =
                  stampColor === swatch.value ||
                  (swatch.value === undefined && stampColor === undefined)
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onClick={() => setStampColor(swatch.value)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {swatch.label}
                  </button>
                )
              })}
              <label className="ml-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                Custom
                <input
                  type="color"
                  value={stampColor ?? '#000000'}
                  onChange={(event) => setStampColor(event.target.value)}
                  className="size-6 cursor-pointer rounded border border-border bg-transparent p-0"
                  aria-label="Custom stamp color"
                />
              </label>
            </div>

            <h3 className="text-sm font-medium text-foreground">Best teammates</h3>
            <div className="flex items-center gap-6">
              <Stamp variant="best-teammates" color={stampColor} />
              <Stamp
                variant="best-teammates"
                className="-rotate-6 opacity-90"
                size={6.5}
                color={stampColor}
              />
            </div>

            <h3 className="text-sm font-medium text-foreground">Coin flip</h3>
            <div className="flex items-center gap-6">
              <Stamp variant="coin-flip" color={stampColor} />
              <Stamp
                variant="coin-flip"
                className="rotate-3 opacity-90"
                size={6.5}
                color={stampColor}
              />
            </div>
            <h3 className="text-sm font-medium text-foreground">Room to grow</h3>
            <div className="flex items-center gap-6">
              <Stamp variant="room-to-grow" color={stampColor} />
              <Stamp
                variant="room-to-grow"
                className="rotate-3 opacity-90"
                size={6.5}
                color={stampColor}
              />
            </div>
          </div>
        </DemoBlock>
      </main>
    </div>
  )
}
