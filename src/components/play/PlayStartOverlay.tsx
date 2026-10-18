import { useLayoutEffect, useRef, useState } from 'react'
import { START_API_URL } from '@/config'
import { readStoredPassword } from '@/hooks/PlayDisplaySettingsContext'
import { cn } from '@/lib/utils'

type PlayStartOverlayProps = {
  show: boolean
}

/**
 * Fixed overlay over the courts area only (header stays clear).
 * Large orange Play button with an iridescent shimmer.
 */
export function PlayStartOverlay({ show }: PlayStartOverlayProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const [starting, setStarting] = useState(false)

  useLayoutEffect(() => {
    if (!show) {
      setStarting(false)
      return
    }
    const parent = anchorRef.current?.parentElement
    if (!parent) return

    const update = () => {
      const rect = parent.getBoundingClientRect()
      setBounds({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(parent)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [show])

  const postStart = () => {
    if (starting) return
    setStarting(true)

    void (async () => {
      try {
        const response = await fetch(START_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: readStoredPassword(),
            force: true
          }),
        })
        if (response.status !== 200) {
          throw new Error(`Failed to start (${response.status})`)
        }
      } catch {
        setStarting(false)
      }
    })()
  }

  return (
    <>
      <div ref={anchorRef} className="pointer-events-none absolute inset-0" aria-hidden />
      {show && bounds.height > 0 && (
        <div
          className="fixed z-50 flex items-center justify-center bg-background/55 backdrop-blur-[2px]"
          style={{
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height,
          }}
        >
          <button
            type="button"
            disabled={starting}
            className={cn(
              'animate-play-iridescent pointer-events-auto h-[min(35%,11rem)] w-[min(46%,21rem)]',
              'rounded-2xl border border-white/25 text-3xl font-bold tracking-tight text-white sm:text-4xl',
              'shadow-[0_12px_40px_-8px_rgba(249,115,22,0.65)] outline-none',
              'focus-visible:ring-4 focus-visible:ring-orange-300/60',
              'disabled:pointer-events-none',
            )}
            onClick={postStart}
          >
            {starting ? 'Starting…' : 'Play'}
          </button>
        </div>
      )}
    </>
  )
}
