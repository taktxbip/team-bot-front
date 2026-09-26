const unlockers = new Map<HTMLAudioElement, () => void>()

export function createSound(src: string) {
  const audio = new Audio(src)
  audio.preload = 'auto'
  return audio
}

export function stopSound(audio: HTMLAudioElement) {
  unlockers.get(audio)?.()
  audio.pause()
}

/** Replay a clip from the start. If the browser blocks audio, it plays on the next click or keypress. */
export function playSound(audio: HTMLAudioElement) {
  const start = () => {
    try {
      audio.currentTime = 0
    } catch {
      // Media is not seekable until metadata arrives; play() still starts at 0.
    }
    void audio.play().catch((error: unknown) => {
      if (!(error instanceof DOMException) || error.name !== 'NotAllowedError') return
      if (unlockers.has(audio)) return

      const unlock = () => {
        clearUnlock()
        start()
      }
      const clearUnlock = () => {
        window.removeEventListener('pointerdown', unlock)
        window.removeEventListener('keydown', unlock)
        unlockers.delete(audio)
      }
      unlockers.set(audio, clearUnlock)
      window.addEventListener('pointerdown', unlock)
      window.addEventListener('keydown', unlock)
    })
  }

  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
    start()
    return
  }

  audio.addEventListener('loadedmetadata', start, { once: true })
}
