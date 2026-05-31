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
    },
    {
      id: 'court-3',
      name: 'Court 3',
      team1: {
        rank: 512,
        winProbability: 71,
        player1: { id: 'p9', name: 'Chris Wong' },
        player2: { id: 'p10', name: 'Priya Sharma' },
      },
      team2: {
        rank: 3487,
        winProbability: 29,
        player1: { id: 'p11', name: 'Mike Johnson' },
        player2: { id: 'p12', name: 'Yuki Tanaka' },
      },
    },
    {
      id: 'court-4',
      name: 'Court 4',
      winner: 'team1',
      pointsChange: 18,
      team1: {
        rank: 128,
        winProbability: 74,
        player1: { id: 'p13', name: 'Oliver Brown' },
        player2: { id: 'p14', name: 'Lucia Rossi' },
      },
      team2: {
        rank: 4521,
        winProbability: 26,
        player1: { id: 'p15', name: 'Ryan O\'Connor' },
        player2: { id: 'p16', name: 'Nina Patel' },
      },
    },
  ],
}
