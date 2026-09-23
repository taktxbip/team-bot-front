import { useEffect, useRef } from 'react'
import { CosmicFire, type CosmicFireOptions } from '@/lib/cosmicFire'
import { cn } from '@/lib/utils'

type CanvasFireProps = {
  className?: string
  /** Internal simulation width (default 800). */
  width?: number
  /** Internal simulation height (default 600). */
  height?: number
  /**
   * Canvas clear / backdrop color.
   * Accepts any CSS color, including variables like `var(--card)` or `#fff`.
   * Defaults to black.
   */
  backgroundColor?: string
  options?: Omit<CosmicFireOptions, 'backgroundRgb'>
}

function resolveCssColorToRgb(
  color: string,
  host: HTMLElement,
): { r: number; g: number; b: number } {
  const probe = document.createElement('span')
  probe.style.color = color
  host.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()

  const match = resolved.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!match) return { r: 0, g: 0, b: 0 }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  }
}

/**
 * Canvas fire / cosmic particle effect.
 * Port of https://codepen.io/mousman/pen/RWPZmM (Moussa Dembélé).
 */
export function CanvasFire({
  className,
  width = 800,
  height = 600,
  backgroundColor = '#000000',
  options,
}: CanvasFireProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particleCount = options?.particleCount
  const flux = options?.flux
  const particlesColor = options?.particlesColor
  const colorTransform = options?.colorTransform

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const host = canvas.parentElement ?? document.body
    const backgroundRgb = resolveCssColorToRgb(backgroundColor, host)

    let fire: CosmicFire | null = null
    try {
      fire = new CosmicFire(width, height, canvas, {
        particleCount,
        flux,
        particlesColor,
        colorTransform,
        backgroundRgb,
      })
      fire.start()
    } catch {
      return
    }

    const mutationObserver = new MutationObserver(() => {
      // Theme changes can alter CSS variables — restart with new RGB
      fire?.stop()
      const nextRgb = resolveCssColorToRgb(backgroundColor, host)
      try {
        fire = new CosmicFire(width, height, canvas, {
          particleCount,
          flux,
          particlesColor,
          colorTransform,
          backgroundRgb: nextRgb,
        })
        fire.start()
      } catch {
        fire = null
      }
    })
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      mutationObserver.disconnect()
      fire?.stop()
    }
  }, [width, height, backgroundColor, particleCount, flux, particlesColor, colorTransform])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block h-full w-full object-cover', className)}
      aria-hidden
    />
  )
}
