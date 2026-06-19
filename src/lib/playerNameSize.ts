import type { PlayerNameSize } from '@/components/court/PlayerRow'

export function getNameSizeForCourtCount(courtCount: number): PlayerNameSize {
  if (courtCount === 1) return 'large'
  if (courtCount === 2) return 'medium'
  return 'default'
}
