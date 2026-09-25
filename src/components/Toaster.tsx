import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToastItem } from '@/hooks/ToastContext'

type ToasterProps = {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (!toasts.length) return null

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col-reverse items-end gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isError = toast.status === 'error'
        return (
          <button
            key={toast.id}
            type="button"
            onClick={() => onDismiss(toast.id)}
            className={cn(
              'pointer-events-auto flex w-full max-w-md items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm shadow-sm',
              'animate-in fade-in slide-in-from-bottom-2 duration-300',
              isError
                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                : 'border-border bg-card text-foreground',
            )}
          >
            {isError ? (
              <CircleAlert className="size-4 shrink-0" aria-hidden />
            ) : (
              <CircleCheck className="size-4 shrink-0" aria-hidden />
            )}
            <span>{toast.message}</span>
          </button>
        )
      })}
    </div>
  )
}
