import type { Player } from '@/types/court'
import { cn } from '@/lib/utils'

type PlayerRowProps = {
  player: Player
  align?: 'left' | 'right'
  large?: boolean
}

export function PlayerRow({ player, align = 'left', large }: PlayerRowProps) {
  return (
    <div
      className={cn(
        'break-words py-1.5 font-semibold leading-tight text-foreground',
        large ? 'text-[18px] md:text-4xl' : 'text-[18px] md:text-2xl',
        align === 'right' && 'text-right',
      )}
    >
      {player.name}
    </div>
  )
}
