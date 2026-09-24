import { useId, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export type StampVariant = 'best-teammates' | 'coin-flip' | 'room-to-grow'

export const STAMP_VARIANTS_LIST: StampVariant[] = [
  'best-teammates',
  'coin-flip',
  'room-to-grow',
]

const STAMP_VARIANTS: Record<
  StampVariant,
  { label: string; ringText: string; icon: string }
> = {
  'best-teammates': {
    label: 'Best teammates',
    ringText: 'Best teammates · Best teammates · ',
    icon: '🤝',
  },
  'coin-flip': {
    label: 'Coin flip',
    ringText: 'Coin flip · Coin flip · Coin flip ·',
    icon: '🪙',
  },
  'room-to-grow': {
    label: 'Room to grow',
    ringText: 'Room to grow · Room to grow ·',
    icon: '🌱',
  },
}

type StampProps = {
  className?: string
  /** Stamp kind — controls ring copy and center icon. */
  variant?: StampVariant
  /** Diameter in rem. Defaults to 8. */
  size?: number
  /** Stamp color (any CSS color). Defaults to current foreground. */
  color?: string
  style?: CSSProperties
}

/**
 * Circular stamp badge: curved label around a center icon.
 */
export function Stamp({
  className,
  variant = 'best-teammates',
  size = 8,
  color,
  style,
}: StampProps) {
  const ringPathId = useId().replace(/:/g, '')
  const { label, ringText, icon } = STAMP_VARIANTS[variant]
  const px = size * 16
  const cx = 60
  const cy = 60
  const r = 44
  // Clockwise circle starting at top (for upright text at the peak)
  const ringPath = `M ${cx},${cy - r} a ${r},${r} 0 1,1 0,${r * 2} a ${r},${r} 0 1,1 0,${-r * 2}`

  return (
    <div
      role="img"
      aria-label={label}
      className={cn('relative inline-flex shrink-0 text-foreground', className)}
      style={{ width: px, height: px, color, ...style }}
    >
      <svg viewBox="0 0 120 120" className="size-full overflow-visible" aria-hidden>
        <defs>
          <path id={ringPathId} d={ringPath} fill="none" />
        </defs>

        {/* Outer stamp ring */}
        <circle
          cx={cx}
          cy={cy}
          r={54}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="3.5 2.5"
          opacity="0.85"
        />
        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={41}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.55"
        />

        <text
          className="fill-current uppercase"
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.22em',
          }}
        >
          <textPath href={`#${ringPathId}`} startOffset="50%" textAnchor="middle">
            {ringText}
          </textPath>
        </text>
      </svg>

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl">
        {icon}
      </span>
    </div>
  )
}
