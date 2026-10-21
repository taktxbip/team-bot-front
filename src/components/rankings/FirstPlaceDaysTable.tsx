import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Trophey } from '@/components/Trophey'
import type { FirstPlaceDaysEntry } from '@/types/playerProfile'

type FirstPlaceDaysTableProps = {
  entries: FirstPlaceDaysEntry[]
  loading?: boolean
  error?: string | null
}

/** Smallest and largest cup, in px. Everyone else is scaled between these. */
const MIN_CUP_HEIGHT = 74
const MAX_CUP_HEIGHT = 148
const MIN_TEXT_SIZE = 14
const MAX_TEXT_SIZE = 42

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t
}

/** 0 at the fewest days, 1 at the most. Ties all sit at the large end. */
function dayScale(days: number, minDays: number, maxDays: number): number {
  if (maxDays <= minDays) return 1
  return (days - minDays) / (maxDays - minDays)
}

function scrollListTo(list: HTMLUListElement, left: number): () => void {
  const max = Math.max(0, list.scrollWidth - list.clientWidth)
  const target = Math.min(max, Math.max(0, left))
  if (Math.abs(list.scrollLeft - target) <= 1) return () => {}

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    list.scrollLeft = target
    return () => {}
  }

  const start = list.scrollLeft
  const duration = 900
  const started = performance.now()
  let frame = 0

  const step = (now: number) => {
    const t = Math.min(1, (now - started) / duration)
    const eased = 1 - (1 - t) ** 3
    list.scrollLeft = start + (target - start) * eased
    if (t < 1) frame = requestAnimationFrame(step)
  }

  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

function scrollOffset(target: EventTarget | null): number {
  if (target instanceof HTMLElement) return target.scrollTop
  return window.scrollY
}

export function FirstPlaceDaysTable({ entries, loading, error }: FirstPlaceDaysTableProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const minDays = entries.reduce((min, entry) => Math.min(min, entry.days), Infinity)
  const maxDays = entries.reduce((max, entry) => Math.max(max, entry.days), -Infinity)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    let visible = false
    let lastOffset = window.scrollY
    let direction = 0
    let toward: 'left' | 'right' | null = null
    let cancelScroll = () => {}

    const play = (next: 'left' | 'right') => {
      if (toward === next) return
      toward = next
      cancelScroll()
      const end = list.scrollWidth - list.clientWidth
      cancelScroll = scrollListTo(list, next === 'right' ? end : 0)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (visible && direction !== 0) play(direction > 0 ? 'right' : 'left')
    }, { threshold: 0.6 })

    const onScroll = (event: Event) => {
      if (event.target === list) return
      const offset = scrollOffset(event.target)
      const delta = offset - lastOffset
      lastOffset = offset
      if (Math.abs(delta) < 2) return
      direction = delta > 0 ? 1 : -1
      if (visible) play(direction > 0 ? 'right' : 'left')
    }

    observer.observe(list)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      cancelScroll()
      observer.disconnect()
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [entries])

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <header className="px-1">
        <h2 className="font-semibold tracking-tight text-foreground md:text-lg">
          Days on first place*
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Playing days only. Days without matches are not counted.
        </p>
      </header>
      <div className="overflow-hidden rounded-xl">
        {loading && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            Loading days on first place…
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-4">
            <div className="text-sm font-medium text-foreground">
              Failed to load days on first place
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No first-place days yet
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <ul
            ref={listRef}
            className="flex w-full min-w-0 items-end justify-start gap-4 overflow-x-auto px-4 py-5 [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
          >
            {entries.map((entry) => {
              const scale = dayScale(entry.days, minDays, maxDays)
              const cupHeight = lerp(MIN_CUP_HEIGHT, MAX_CUP_HEIGHT, scale)
              const textSize = lerp(MIN_TEXT_SIZE, MAX_TEXT_SIZE, scale)

              return (
                <li key={entry.playerId} className="flex shrink-0 items-end gap-2">
                  <Trophey className="w-auto" style={{ height: cupHeight }} />
                  <div className="flex flex-col items-start leading-[1.1]">
                    <span
                      className="font-bold tabular-nums"
                      style={{ fontSize: textSize }}
                    >
                      {entry.days}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.days === 1 ? 'day' : 'days'}
                    </span>
                    <Link
                      to={`/rankings/${encodeURIComponent(entry.name)}`}
                      className="mt-2 max-w-28 truncate text-sm font-semibold text-foreground hover:underline"
                    >
                      {entry.name}
                      {entry.flag ? ` ${entry.flag}` : ''}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <p className="px-1 text-xs text-muted-foreground">*Updates at 23:00 Thailand time. Starting from July, 2026.</p>
    </section>
  )
}
