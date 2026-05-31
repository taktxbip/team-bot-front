import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTeamRank(rank: number): string {
  return String(rank).padStart(4, '0')
}

export function getTeamPointsChange(
  winner: 'team1' | 'team2' | undefined,
  side: 'team1' | 'team2',
  pointsChange?: number,
): number | undefined {
  if (!winner || pointsChange === undefined) return undefined
  return winner === side ? pointsChange : -pointsChange
}
