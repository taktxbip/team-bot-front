import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const SHOW_DELAY_MS = 1000

type PlayStartOverlayProps = {
  show: boolean
}

/** Dim overlay with a large Play button. Appears after a short delay when `show` becomes true. */
export function PlayStartOverlay({ show }: PlayStartOverlayProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show) {
      setVisible(false)
      return
    }

    const id = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [show])

  if (!visible) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
      <Button
        type="button"
        className="h-24 min-w-[14rem] rounded-lg px-12 text-4xl font-semibold tracking-tight opacity-100 shadow-lg hover:cursor-pointer hover:bg-primary hover:opacity-100"
      >
        Play
      </Button>
    </div>
  )
}
