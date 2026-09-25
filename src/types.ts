export interface Team {
  id: string
  name: string
  shortName: string
  color: string // hex, used for badges/charts
  isMyTeam?: boolean
}

export type MatchStatus = 'agendado' | 'realizado'

// fase1 = pontos corridos (todos x todos). As demais são o mata-mata:
// semifinal (1º x 4º, 2º x 3º) -> final (vencedores) e terceiro (perdedores).
export type Phase = 'fase1' | 'semifinal' | 'terceiro' | 'final'

export interface Match {
  id: string
  phase: Phase
  round: number | null // só usado na fase1 (1 a 7); null no mata-mata
  label?: string // ex: "Semifinal 1", "Disputa de 3º lugar", "Final"
  date: string // ISO date
  time?: string // "HH:MM", opcional
  // null enquanto o time ainda não foi definido (ex: mata-mata antes da fase 1 terminar)
  homeTeamId: string | null
  awayTeamId: string | null
  homeScore: number | null
  awayScore: number | null
  status: MatchStatus
  location?: string
}

export interface Player {
  id: string
  teamId: string
  name: string
  number: number
  photoUrl?: string
}

// Comissão técnica (técnico, auxiliar etc.) — não entra nas estatísticas de jogo.
export interface Coach {
  id: string
  teamId: string
  name: string
  role: string
  photoUrl?: string
}

export interface PlayerMatchStat {
  id: string
  playerId: string
  matchId: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  played: boolean
}

export interface Standing {
  teamId: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export interface ChampionshipData {
  myTeamId: string
  teams: Team[]
  matches: Match[]
  players: Player[]
  coaches: Coach[]
  stats: PlayerMatchStat[]
}
