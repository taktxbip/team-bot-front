import { CourtsGrid } from '@/components/court/CourtsGrid'
import { PlaySettings } from '@/components/play/PlaySettings'
import { useMatchData } from '@/hooks/MatchDataContext'
import { PlayDisplaySettingsProvider } from '@/hooks/PlayDisplaySettingsContext'

export function PlayPage() {
  const { courts, confirmed, connected, error, pendingWinnerKey, selectWinner } = useMatchData()

  return (
    <PlayDisplaySettingsProvider>
      <div className="flex min-h-0 flex-1 flex-col">
        {error && (
          <p className="mb-5 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <main className="relative flex min-h-0 flex-1 flex-col">
          <PlaySettings />
          <CourtsGrid
            courts={courts}
            confirmed={confirmed}
            onSelectWinner={selectWinner}
            canSelectWinner={connected && !confirmed}
            pendingWinnerKey={pendingWinnerKey}
          />
        </main>
      </div>
    </PlayDisplaySettingsProvider>
  )
}
