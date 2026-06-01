export const teamStyles = {
  team1: {
    block: 'border-blue-400 dark:border-blue-500',
    blockFilled: 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/50',
    label: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500 dark:bg-blue-400',
  },
  team2: {
    block: 'border-orange-400 dark:border-orange-500',
    blockFilled: 'border-orange-400 bg-orange-50 dark:border-orange-500 dark:bg-orange-950/50',
    label: 'text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500 dark:bg-orange-400',
  },
} as const

export type TeamSide = keyof typeof teamStyles
