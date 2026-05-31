import type { Player } from '@/types/court'
import { cn } from '@/lib/utils'

type PlayerRowProps = {
  player: Player
  align?: 'left' | 'right'
}

export function PlayerRow({ player, align = 'left' }: PlayerRowProps) {
  return (
    <div
      className={cn(
        'break-words py-1.5 text-2xl font-semibold leading-tight text-foreground',
        align === 'right' && 'text-right',
      )}
    >
      {player.name}
    </div>
  )
}
