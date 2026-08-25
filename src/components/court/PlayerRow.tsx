import type { Player } from '@/types/court'
import { cn } from '@/lib/utils'

export type PlayerNameSize = 'default' | 'medium' | 'large'

/**
 * Fluid type: scales with the team card (@container), not fixed rem.
 * - cqi ≈ card width, cqb ≈ card height
 * - clamp floor keeps mobile readable; cap prevents huge type on big iPads
 */
const nameSizeClasses: Record<PlayerNameSize, string> = {
  // 3+ courts (grid cells are smaller)
  default:
    'text-[18px] leading-tight md:text-[clamp(1.125rem,min(8cqi,6.5cqb),1.5rem)] md:leading-tight',
  // 2 courts stacked
  medium:
    'text-[18px] leading-tight md:text-[clamp(1.25rem,min(10cqi,7.5cqb),2.25rem)] md:leading-tight',
  // 1 court — biggest, but shrinks on narrower tablets
  large:
    'text-[18px] leading-tight md:text-[clamp(1.35rem,min(12cqi,9cqb),3.5rem)] md:leading-[1.1]',
}

type PlayerRowProps = {
  player: Player
  align?: 'left' | 'right'
  size?: PlayerNameSize
}

export function PlayerRow({ player, align = 'left', size = 'default' }: PlayerRowProps) {
  return (
    <div
      className={cn(
        'min-w-0 break-words py-1 font-semibold text-foreground',
        nameSizeClasses[size],
        align === 'right' && 'text-right',
      )}
    >
      {player.name}
    </div>
  )
}
