import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { DemoPage } from '@/pages/DemoPage'
import { PlayPage } from '@/pages/PlayPage'
import { PlayerRankingsPage } from '@/pages/PlayerRankingsPage'
import { RankingsPage } from '@/pages/RankingsPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="play" replace />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="rankings" element={<RankingsPage />} />
          <Route path="rankings/:playerName" element={<PlayerRankingsPage />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="*" element={<Navigate to="play" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
