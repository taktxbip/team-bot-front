import level1Src from '@/assets/1.webp'
import level2Src from '@/assets/2.webp'
import level3Src from '@/assets/3.webp'

export type AchievementLevel = 1 | 2 | 3

export type AchievementConfig = {
  level: AchievementLevel
  /** Main line, e.g. "Panida game #2000". */
  text: string
  played?: number
  playerId?: number
}

export function toAchievementLevel(level: number): AchievementLevel {
  if (level <= 1) return 1
  if (level === 2) return 2
  return 3
}

type LevelStyle = {
  gif: string
  label: string
  accent: string
}

/** Different GIF per achievement tier. */
export const achievementLevels: Record<AchievementLevel, LevelStyle> = {
  1: {
    gif: level1Src,
    label: 'Level 1',
    accent: '#cd7f32',
  },
  2: {
    gif: level2Src,
    label: 'Level 2',
    accent: '#c0c0c0',
  },
  3: {
    gif: level3Src,
    label: 'Level 3',
    accent: '#f5c518',
  },
}
