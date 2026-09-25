import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChampionshipProvider } from '@/lib/championship-context'
import { Layout } from '@/components/layout/Layout'
import { Overview } from '@/pages/Overview'
import { MyTeam } from '@/pages/MyTeam'
import { Athletes } from '@/pages/Athletes'
import { Matches } from '@/pages/Matches'
import { Admin } from '@/pages/Admin'

function App() {
  return (
    <ChampionshipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/meu-time" element={<MyTeam />} />
            <Route path="/atletas" element={<Athletes />} />
            <Route path="/jogos" element={<Matches />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChampionshipProvider>
  )
}

export default App
