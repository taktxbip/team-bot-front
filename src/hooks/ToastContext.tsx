import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Toaster } from '@/components/Toaster'
import type { ToastStatus } from '@/lib/match-ws-client'

export type ToastItem = {
  id: number
  status: ToastStatus
  message: string
}

const TOAST_DURATION_MS = 4500

type ToastContextValue = {
  pushToast: (toast: { status: ToastStatus; message: string }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const timersRef = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((items) => items.filter((item) => item.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast: { status: ToastStatus; message: string }) => {
      const id = ++idRef.current
      setToasts((items) => [...items, { id, status: toast.status, message: toast.message }])
      const timer = window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return value
}
