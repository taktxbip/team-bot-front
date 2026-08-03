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

/** Winner / team key: `"12-34"` with the lower player id first. */
export function formatTeamWinnerKey(idA: string, idB: string): string {
  const a = Number(idA)
  const b = Number(idB)

  if (!Number.isNaN(a) && !Number.isNaN(b)) {
    return a < b ? `${a}-${b}` : `${b}-${a}`
  }

  return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`
}

export function getTeamWinnerKey(team: {
  key?: string
  player1: { id: string }
  player2: { id: string }
}): string {
  if (team.key) return team.key
  return formatTeamWinnerKey(team.player1.id, team.player2.id)
}
