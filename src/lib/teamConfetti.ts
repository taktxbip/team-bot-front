import confetti from 'canvas-confetti'
import type { TeamSide } from '@/lib/teamColors'

const confettiColors: Record<TeamSide, string[]> = {
  team1: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  team2: ['#f97316', '#fb923c', '#fdba74', '#fed7aa'],
}

export type ConfettiSize = 'default' | 'large' | 'xlarge'

const confettiPresets: Record<
  ConfettiSize,
  {
    burst: confetti.Options
    burst2: confetti.Options
  }
> = {
  default: {
    burst: {
      particleCount: 70,
      spread: 65,
      startVelocity: 24,
      gravity: 0.9,
      origin: { x: 0.5, y: 1 },
      ticks: 180,
    },
    burst2: {
      particleCount: 35,
      spread: 90,
      startVelocity: 18,
      gravity: 0.85,
      scalar: 0.75,
      origin: { x: 0.5, y: 1 },
      ticks: 140,
    },
  },
  large: {
    burst: {
      particleCount: 130,
      spread: 85,
      startVelocity: 34,
      gravity: 0.85,
      scalar: 1.15,
      origin: { x: 0.5, y: 1 },
      ticks: 240,
    },
    burst2: {
      particleCount: 70,
      spread: 110,
      startVelocity: 28,
      gravity: 0.8,
      scalar: 1.25,
      origin: { x: 0.5, y: 1 },
      ticks: 200,
    },
  },
  xlarge: {
    burst: {
      particleCount: 220,
      spread: 100,
      startVelocity: 42,
      gravity: 0.75,
      scalar: 1.75,
      origin: { x: 0.5, y: 1 },
      ticks: 320,
    },
    burst2: {
      particleCount: 120,
      spread: 125,
      startVelocity: 36,
      gravity: 0.7,
      scalar: 1.9,
      origin: { x: 0.5, y: 1 },
      ticks: 280,
    },
  },
}

export function getConfettiSizeForCourtCount(courtCount: number): ConfettiSize {
  if (courtCount === 1) return 'xlarge'
  if (courtCount === 2) return 'large'
  return 'default'
}

export function fireTeamConfetti(
  canvas: HTMLCanvasElement,
  side: TeamSide,
  size: ConfettiSize = 'default',
) {
  const fire = confetti.create(canvas, { resize: true })
  const colors = confettiColors[side]
  const preset = confettiPresets[size]
  const shared = { colors, disableForReducedMotion: true } as const

  void fire({ ...preset.burst, ...shared })
  void fire({ ...preset.burst2, ...shared })
}
