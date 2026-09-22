import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { EloHistoryPoint } from '@/types/playerProfile'

type RankHistoryChartProps = {
  history: EloHistoryPoint[]
  loading?: boolean
  error?: string | null
}

function formatEloTick(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export function RankHistoryChart({ history, loading, error }: RankHistoryChartProps) {
  return (
    <div className="rounded-xl bg-card">
      <div className="border-b px-5 py-3">
        <h2 className="text-sm font-medium text-muted-foreground">Elo points over time</h2>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading elo history…
        </div>
      )}

      {!loading && error && (
        <div className="px-5 py-4 text-sm text-destructive">{error}</div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No elo history yet
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="h-64 w-full px-2 py-4 sm:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <YAxis
                dataKey="elo"
                domain={['auto', 'auto']}
                width={44}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatEloTick}
              />
              <Tooltip
                cursor={{ stroke: 'var(--border)' }}
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--muted-foreground)' }}
                formatter={(value) => [formatEloTick(Number(value)), 'Elo']}
              />
              <Line
                type="monotone"
                dataKey="elo"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--chart-2)', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
