import type { Player } from '@/types/court'
import { cn } from '@/lib/utils'

export type PlayerNameSize = 'default' | 'medium' | 'large'

const nameSizeClasses: Record<PlayerNameSize, string> = {
  default: 'text-[18px] md:text-2xl',
  medium: 'text-[18px] md:text-4xl md:leading-tight',
  large: 'text-[18px] md:text-6xl md:leading-[1.05]',
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
        'break-words py-1.5 font-semibold leading-tight text-foreground',
        nameSizeClasses[size],
        align === 'right' && 'text-right',
      )}
    >
      {player.name}
    </div>
  )
}
