import type { PlayerNameSize } from '@/components/court/PlayerRow'

/**
 * Fluid name scale by court layout.
 * Sizes use container units (cqi/cqb) on the team card — see PlayerRow.
 */
export function getNameSizeForCourtCount(courtCount: number): PlayerNameSize {
  if (courtCount === 1) return 'large'
  if (courtCount === 2) return 'medium'
  return 'default'
}
