import { useEffect } from 'react'
import { fireAchievementConfetti } from '@/lib/teamConfetti'
import { cn } from '@/lib/utils'
import { achievementLevels, type AchievementConfig } from './achievementLevels'

type AchievementOverlayProps = {
  achievement: AchievementConfig | null
  onDismiss?: () => void
}

/**
 * Fullscreen achievement celebration. Text is editable via the `achievement` prop.
 */
export function AchievementOverlay({ achievement, onDismiss }: AchievementOverlayProps) {
  const level = achievement?.level
  const accent = level ? achievementLevels[level].accent : null

  useEffect(() => {
    if (!accent) return
    fireAchievementConfetti(accent)
    const id = window.setTimeout(() => fireAchievementConfetti(accent), 700)
    return () => window.clearTimeout(id)
  }, [accent, achievement?.text])

  if (!achievement || !level) return null

  const style = achievementLevels[level]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${style.label} achievement`}
      className={cn(
        'fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8',
        'bg-background/90 px-6 backdrop-blur-md',
        'animate-in fade-in duration-500',
      )}
      onClick={onDismiss}
    >

      <img
        src={style.gif}
        alt=""
        aria-hidden
        className="h-[min(42vh,20rem)] w-auto object-contain drop-shadow-lg"
      />

      <div className="max-w-3xl text-center">
        <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {achievement.text}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
          Achievement unlocked
        </p>
      </div>

      <p className="text-xs text-muted-foreground/70">Tap to dismiss</p>
    </div>
  )
}
