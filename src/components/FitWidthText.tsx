import { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type FitWidthTextProps = {
  text: string
  /** Fraction of container width to fill (0–1). Default 0.94 */
  fill?: number
  className?: string
}

/**
 * Scales font-size so `text` fills most of the container width.
 */
export function FitWidthText({ text, fill = 0.94, className }: FitWidthTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const el = textRef.current
    if (!container || !el) return

    const fit = () => {
      const available = container.clientWidth * fill
      if (available <= 0) return

      el.style.fontSize = '100px'
      const measured = el.scrollWidth
      if (measured <= 0) return

      el.style.fontSize = `${(available / measured) * 100}px`
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    return () => observer.disconnect()
  }, [text, fill])

  return (
    <div ref={containerRef} className="w-full overflow-hidden text-center">
      <span
        ref={textRef}
        className={cn('inline-block max-w-none whitespace-nowrap leading-none', className)}
      >
        {text}
      </span>
    </div>
  )
}
