import confetti from 'canvas-confetti'
import type { TeamSide } from '@/lib/teamColors'

const confettiColors: Record<TeamSide, string[]> = {
  team1: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  team2: ['#f97316', '#fb923c', '#fdba74', '#fed7aa'],
}

export function fireTeamConfetti(canvas: HTMLCanvasElement, side: TeamSide) {
  const fire = confetti.create(canvas, { resize: true })
  const colors = confettiColors[side]

  void fire({
    particleCount: 70,
    spread: 65,
    startVelocity: 24,
    gravity: 0.9,
    origin: { x: 0.5, y: 0.45 },
    colors,
    disableForReducedMotion: true,
    ticks: 180,
  })

  void fire({
    particleCount: 35,
    spread: 90,
    startVelocity: 18,
    gravity: 0.85,
    scalar: 0.75,
    origin: { x: 0.5, y: 0.5 },
    colors,
    disableForReducedMotion: true,
    ticks: 140,
  })
}
