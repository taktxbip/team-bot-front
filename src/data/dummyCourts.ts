import type { CourtsMessage } from '@/types/court'

export const dummyCourtsMessage: CourtsMessage = {
  status: 'finished',
  courts: [
    {
      id: 'court-1',
      name: 'Court 1',
      winner: 'team1',
      pointsChange: 12,
      team1: {
        rank: 847,
        winProbability: 58,
        player1: { id: 'p1', name: 'Alex Chen' },
        player2: { id: 'p2', name: 'Maria Santos' },
      },
      team2: {
        rank: 1203,
        winProbability: 42,
        player1: { id: 'p3', name: 'James Park' },
        player2: { id: 'p4', name: 'Elena Volkov' },
      },
    },
    {
      id: 'court-2',
      name: 'Court 2',
      winner: 'team2',
      pointsChange: 15,
      team1: {
        rank: 2156,
        winProbability: 38,
        player1: { id: 'p5', name: 'Tom Nguyen' },
        player2: { id: 'p6', name: 'Sara Kim' },
      },
      team2: {
        rank: 934,
        winProbability: 62,
        player1: { id: 'p7', name: 'David Lee' },
        player2: { id: 'p8', name: 'Anna Müller' },
      },
    }
  ],
}
