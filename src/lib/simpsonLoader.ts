import { useEffect, useState } from 'react'
import simpsonLoader from '@/assets/simpson.gif'

export const SIMPSON_LOADER_SRC = simpsonLoader

let ready = false
let preloadPromise: Promise<void> | null = null

export function preloadSimpsonLoader(): Promise<void> {
  if (ready) return Promise.resolve()
  if (preloadPromise) return preloadPromise

  preloadPromise = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      ready = true
      resolve()
    }
    img.onerror = () => {
      ready = true
      resolve()
    }
    img.src = SIMPSON_LOADER_SRC
  })

  return preloadPromise
}

export function isSimpsonLoaderReady(): boolean {
  return ready
}

export function useSimpsonLoaderReady(): boolean {
  const [isReady, setIsReady] = useState(isSimpsonLoaderReady)

  useEffect(() => {
    if (isReady) return
    void preloadSimpsonLoader().then(() => setIsReady(true))
  }, [isReady])

  return isReady
}

// Start loading as soon as this module is imported
void preloadSimpsonLoader()
