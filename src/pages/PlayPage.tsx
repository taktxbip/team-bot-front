import { CourtsGrid } from '@/components/court/CourtsGrid'
import { useMatchData } from '@/hooks/MatchDataContext'

export function PlayPage() {
  const { courts, confirmed, connected, error, selectWinner } = useMatchData()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {error && (
        <p className="mb-5 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <main className="flex min-h-0 flex-1 flex-col">
        <CourtsGrid
          courts={courts}
          confirmed={confirmed}
          onSelectWinner={selectWinner}
          canSelectWinner={connected && !confirmed}
        />
      </main>
    </div>
  )
}
