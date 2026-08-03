import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { PlayPage } from '@/pages/PlayPage'
import { RankingsPage } from '@/pages/RankingsPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="play" replace />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="rankings" element={<RankingsPage />} />
          <Route path="*" element={<Navigate to="play" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
