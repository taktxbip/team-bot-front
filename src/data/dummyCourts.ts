import type { CourtsMessage } from '@/types/court'

export const dummyCourtsMessage: CourtsMessage = {
  status: 'live',
  courts: [
    {
      id: 'court-1',
      name: 'Court 1',
      team1: {
        rank: 847,
        winProbability: 58,
        player1: { id: 'p1', name: 'Alex Chen', rank: 4 },
        player2: { id: 'p2', name: 'Maria Santos', rank: 7 },
      },
      team2: {
        rank: 1203,
        winProbability: 42,
        player1: { id: 'p3', name: 'James Park', rank: 5 },
        player2: { id: 'p4', name: 'Elena Volkov', rank: 9 },
      },
    },
    {
      id: 'court-2',
      name: 'Court 2',
      team1: {
        rank: 2156,
        winProbability: 38,
        player1: { id: 'p5', name: 'Tom Nguyen', rank: 12 },
        player2: { id: 'p6', name: 'Sara Kim', rank: 11 },
      },
      team2: {
        rank: 934,
        winProbability: 62,
        player1: { id: 'p7', name: 'David Lee', rank: 8 },
        player2: { id: 'p8', name: 'Anna Müller', rank: 6 },
      },
    },
    {
      id: 'court-3',
      name: 'Court 3',
      team1: {
        rank: 512,
        winProbability: 71,
        player1: { id: 'p9', name: 'Chris Wong', rank: 3 },
        player2: { id: 'p10', name: 'Priya Sharma', rank: 10 },
      },
      team2: {
        rank: 3487,
        winProbability: 29,
        player1: { id: 'p11', name: 'Mike Johnson', rank: 14 },
        player2: { id: 'p12', name: 'Yuki Tanaka', rank: 13 },
      },
    },
    {
      id: 'court-4',
      name: 'Court 4',
      team1: {
        rank: 128,
        winProbability: 74,
        player1: { id: 'p13', name: 'Oliver Brown', rank: 2 },
        player2: { id: 'p14', name: 'Lucia Rossi', rank: 5 },
      },
      team2: {
        rank: 4521,
        winProbability: 26,
        player1: { id: 'p15', name: 'Ryan O\'Connor', rank: 16 },
        player2: { id: 'p16', name: 'Nina Patel', rank: 18 },
      },
    },
  ],
}
