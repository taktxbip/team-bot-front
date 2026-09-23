import { useId, useState } from 'react'
import fireHorizontalUrl from '@/assets/fire-horizontal.svg?url'
import { cn } from '@/lib/utils'

type SvgFireProps = {
  className?: string
  /**
   * How much of the **base** to crop (CSS length, e.g. `"40%"` / `"1.5rem"`).
   * Keeps the flame tips; overflow clips the base. Defaults to `"0%"`.
   */
  offsetY?: string
  /** `vertical` = flames from the left edge pointing right (rotated in SVG, not CSS). */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Lightweight SVG fire strip with heat distortion.
 * Rotation is done inside the SVG so feDisplacementMap stays sharp/visible
 * (CSS transform on a filtered ancestor often renders blank).
 */
export function SvgFire({
  className,
  offsetY = '0%',
  orientation = 'horizontal',
}: SvgFireProps) {
  const rawId = useId()
  const filterId = `svg-fire-distort-${rawId.replace(/:/g, '')}`
  const [seed] = useState(() => Math.floor(Math.random() * 10_000))
  /** Shift along the fire strip so each instance shows a different section. */
  const [offsetX] = useState(() => Math.floor(Math.random() * 1000))
  const vertical = orientation === 'vertical'

  const stripTransform = vertical
    ? `translate(350 0) rotate(90) translate(${-offsetX} 0)`
    : `translate(${-offsetX} 0)`

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none relative h-full w-full overflow-hidden', className)}
    >
      <svg
        viewBox={vertical ? '0 0 350 2000' : '0 0 2000 350'}
        preserveAspectRatio={vertical ? 'xMinYMid slice' : 'xMidYMin slice'}
        style={
          vertical
            ? { width: `calc(100% + ${offsetY})`, height: '100%' }
            : { height: `calc(100% + ${offsetY})`, width: '100%' }
        }
        className={cn(
          'pointer-events-none absolute',
          vertical ? 'inset-y-0 left-0 h-full' : 'inset-x-0 top-0 w-full',
        )}
      >
        <defs>
          <filter
            id={filterId}
            x="-12%"
            y="-30%"
            width="124%"
            height="160%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.016"
              numOctaves="2"
              seed={seed}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="20s"
                values="0.008 0.016;0.011 0.02;0.007 0.014;0.008 0.016"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        {/*
          vertical: rotate(90) + translate — base on left, tips into the row.
          offsetX: random shift along the strip per instance.
        */}
        <g transform={stripTransform}>
          <image
            href={fireHorizontalUrl}
            width="2000"
            height="350"
            preserveAspectRatio="xMidYMin slice"
            filter={`url(#${filterId})`}
          />
        </g>
      </svg>
    </div>
  )
}
