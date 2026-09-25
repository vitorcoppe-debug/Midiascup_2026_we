import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useChampionship } from '@/lib/championship-context'
import { LayoutDashboard, Shield, Users, CalendarDays } from 'lucide-react'

// "Admin" fica fora do menu de propósito — só é acessível digitando /admin
// direto na URL (e ainda pede a senha de sempre). Ver AdminGate.
const NAV_ITEMS = [
  { to: '/', label: 'Visão Geral', icon: LayoutDashboard, end: true },
  { to: '/meu-time', label: 'Meu Time', icon: Shield },
  { to: '/atletas', label: 'Atletas', icon: Users },
  { to: '/jogos', label: 'Jogos', icon: CalendarDays },
]

export function Layout() {
  const { myTeam } = useChampionship()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/escudo.png" alt={myTeam?.name ?? 'Escudo do time'} className="h-10 w-10 shrink-0 object-contain" />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">Mídia's Cup</p>
              <p className="text-xs text-white/75">{myTeam?.name ?? 'Meu time'}</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-white/85 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-6 md:py-8">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
