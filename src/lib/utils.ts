import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTeamPointsChange(
  winner: 'team1' | 'team2' | undefined,
  side: 'team1' | 'team2',
  pointsChange?: number,
): number | undefined {
  if (!winner || pointsChange === undefined) return undefined
  const magnitude = Math.abs(pointsChange)
  return winner === side ? magnitude : -magnitude
}
