import type { Player } from '@/types/court'
import { usePlayDisplaySettings } from '@/hooks/PlayDisplaySettingsContext'
import { cn } from '@/lib/utils'

type PlayerRowProps = {
  player: Player
  align?: 'left' | 'right'
}

export function PlayerRow({ player, align = 'left' }: PlayerRowProps) {
  const { nameFontSize } = usePlayDisplaySettings()

  return (
    <div
      className={cn(
        'min-w-0 break-words py-1 font-semibold leading-tight text-foreground',
        align === 'right' && 'text-right',
      )}
      style={{ fontSize: `${nameFontSize}px` }}
    >
      {player.name}
    </div>
  )
}
