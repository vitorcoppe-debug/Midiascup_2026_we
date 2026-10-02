import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { seedData } from '@/lib/seed-data'
import type { ChampionshipData, Coach, Match, Player, PlayerMatchStat, Team } from '@/types'

// v9: Renan Cano virou o técnico do time (comissão técnica) e Marcelo Lopes
// assumiu a camisa 8 — dados salvos no formato antigo são ignorados de propósito.
const STORAGE_KEY = 'midias-cup-data-v9'
const SEED_SIG_KEY = 'midias-cup-seed-sig'

// Assinatura do seed-data.ts: quando o código muda (novos resultados publicados),
// os dados guardados no navegador deixam de valer e todo mundo vê a versão nova.
// Edições feitas no Admin e ainda não salvas no código se perdem nessa hora.
const SEED_SIG = (() => {
  const s = JSON.stringify(seedData)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return String(h)
})()

function loadInitialData(): ChampionshipData {
  if (typeof window === 'undefined') return seedData
  try {
    if (window.localStorage.getItem(SEED_SIG_KEY) !== SEED_SIG) return seedData
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedData
    const parsed = JSON.parse(raw) as ChampionshipData
    if (!parsed.teams || !parsed.matches) return seedData
    return parsed
  } catch {
    return seedData
  }
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

interface ChampionshipContextValue {
  data: ChampionshipData
  myTeam: Team | undefined
  setMyTeamId: (teamId: string) => void

  addTeam: (team: Omit<Team, 'id'>) => void
  updateTeam: (id: string, patch: Partial<Team>) => void
  removeTeam: (id: string) => void

  addPlayer: (player: Omit<Player, 'id'>) => void
  updatePlayer: (id: string, patch: Partial<Player>) => void
  removePlayer: (id: string) => void

  addCoach: (coach: Omit<Coach, 'id'>) => void
  updateCoach: (id: string, patch: Partial<Coach>) => void
  removeCoach: (id: string) => void

  addMatch: (match: Omit<Match, 'id'>) => void
  updateMatch: (id: string, patch: Partial<Match>) => void
  removeMatch: (id: string) => void

  upsertStat: (stat: Omit<PlayerMatchStat, 'id'> & { id?: string }) => void
  removeStat: (id: string) => void

  resetToSample: () => void
}

const ChampionshipContext = createContext<ChampionshipContextValue | null>(null)

export function ChampionshipProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ChampionshipData>(loadInitialData)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.localStorage.setItem(SEED_SIG_KEY, SEED_SIG)
  }, [data])

  const myTeam = useMemo(() => data.teams.find((t) => t.id === data.myTeamId), [data.teams, data.myTeamId])

  const setMyTeamId = useCallback((teamId: string) => {
    setData((prev) => ({ ...prev, myTeamId: teamId }))
  }, [])

  const addTeam = useCallback((team: Omit<Team, 'id'>) => {
    setData((prev) => ({ ...prev, teams: [...prev.teams, { ...team, id: uid('t') }] }))
  }, [])

  const updateTeam = useCallback((id: string, patch: Partial<Team>) => {
    setData((prev) => ({ ...prev, teams: prev.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  }, [])

  const removeTeam = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== id),
      matches: prev.matches.filter((m) => m.homeTeamId !== id && m.awayTeamId !== id),
      players: prev.players.filter((p) => p.teamId !== id),
      coaches: prev.coaches.filter((c) => c.teamId !== id),
    }))
  }, [])

  const addPlayer = useCallback((player: Omit<Player, 'id'>) => {
    setData((prev) => ({ ...prev, players: [...prev.players, { ...player, id: uid('p') }] }))
  }, [])

  const updatePlayer = useCallback((id: string, patch: Partial<Player>) => {
    setData((prev) => ({ ...prev, players: prev.players.map((p) => (p.id === id ? { ...p, ...patch } : p)) }))
  }, [])

  const removePlayer = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
      stats: prev.stats.filter((s) => s.playerId !== id),
    }))
  }, [])

  const addCoach = useCallback((coach: Omit<Coach, 'id'>) => {
    setData((prev) => ({ ...prev, coaches: [...prev.coaches, { ...coach, id: uid('c') }] }))
  }, [])

  const updateCoach = useCallback((id: string, patch: Partial<Coach>) => {
    setData((prev) => ({ ...prev, coaches: prev.coaches.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }, [])

  const removeCoach = useCallback((id: string) => {
    setData((prev) => ({ ...prev, coaches: prev.coaches.filter((c) => c.id !== id) }))
  }, [])

  const addMatch = useCallback((match: Omit<Match, 'id'>) => {
    setData((prev) => ({ ...prev, matches: [...prev.matches, { ...match, id: uid('m') }] }))
  }, [])

  const updateMatch = useCallback((id: string, patch: Partial<Match>) => {
    setData((prev) => ({ ...prev, matches: prev.matches.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  }, [])

  const removeMatch = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      matches: prev.matches.filter((m) => m.id !== id),
      stats: prev.stats.filter((s) => s.matchId !== id),
    }))
  }, [])

  const upsertStat = useCallback((stat: Omit<PlayerMatchStat, 'id'> & { id?: string }) => {
    setData((prev) => {
      if (stat.id) {
        return { ...prev, stats: prev.stats.map((s) => (s.id === stat.id ? { ...s, ...stat, id: stat.id } : s)) }
      }
      const existing = prev.stats.find((s) => s.playerId === stat.playerId && s.matchId === stat.matchId)
      if (existing) {
        return { ...prev, stats: prev.stats.map((s) => (s.id === existing.id ? { ...s, ...stat, id: existing.id } : s)) }
      }
      return { ...prev, stats: [...prev.stats, { ...stat, id: uid('s') }] }
    })
  }, [])

  const removeStat = useCallback((id: string) => {
    setData((prev) => ({ ...prev, stats: prev.stats.filter((s) => s.id !== id) }))
  }, [])

  const resetToSample = useCallback(() => setData(seedData), [])

  const value: ChampionshipContextValue = {
    data,
    myTeam,
    setMyTeamId,
    addTeam,
    updateTeam,
    removeTeam,
    addPlayer,
    updatePlayer,
    removePlayer,
    addCoach,
    updateCoach,
    removeCoach,
    addMatch,
    updateMatch,
    removeMatch,
    upsertStat,
    removeStat,
    resetToSample,
  }

  return <ChampionshipContext.Provider value={value}>{children}</ChampionshipContext.Provider>
}

export function useChampionship() {
  const ctx = useContext(ChampionshipContext)
  if (!ctx) throw new Error('useChampionship deve ser usado dentro de ChampionshipProvider')
  return ctx
}
