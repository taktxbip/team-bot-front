import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'

const HOLD_DELAY_MS = 400
const HOLD_INTERVAL_MS = 60

type UseHoldRepeatOptions = {
  enabled?: boolean
}

/**
 * Fires `action` once on press, then repeats while held (pointer or keyboard).
 */
export function useHoldRepeat(
  action: () => void,
  { enabled = true }: UseHoldRepeatOptions = {},
) {
  const actionRef = useRef(action)
  actionRef.current = action

  const delayIdRef = useRef<number | null>(null)
  const intervalIdRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (delayIdRef.current != null) {
      window.clearTimeout(delayIdRef.current)
      delayIdRef.current = null
    }
    if (intervalIdRef.current != null) {
      window.clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (!enabled) return
    stop()
    actionRef.current()
    delayIdRef.current = window.setTimeout(() => {
      intervalIdRef.current = window.setInterval(() => {
        actionRef.current()
      }, HOLD_INTERVAL_MS)
    }, HOLD_DELAY_MS)
  }, [enabled, stop])

  useEffect(() => {
    if (!enabled) stop()
  }, [enabled, stop])

  useEffect(() => () => stop(), [stop])

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || !enabled) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      start()
    },
    [enabled, start],
  )

  const onPointerUp = useCallback(() => {
    stop()
  }, [stop])

  const onPointerCancel = useCallback(() => {
    stop()
  }, [stop])

  const onLostPointerCapture = useCallback(() => {
    stop()
  }, [stop])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      if (event.repeat || !enabled) return
      event.preventDefault()
      start()
    },
    [enabled, start],
  )

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== ' ' && event.key !== 'Enter') return
      stop()
    },
    [stop],
  )

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onKeyDown,
    onKeyUp,
  }
}
