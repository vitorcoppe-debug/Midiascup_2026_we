import type { ChampionshipData, Match, Player, PlayerMatchStat, Team } from '@/types'
import type { MatchResult } from '@/components/ResultPill'

export function teamMatches(matches: Match[], teamId: string) {
  return matches
    .filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Nome do time, ou "A definir" enquanto o confronto do mata-mata ainda não foi gerado.
export function teamLabel(teamId: string | null, teams: Team[]) {
  if (!teamId) return 'A definir'
  return teams.find((t) => t.id === teamId)?.name ?? 'A definir'
}

// Busca segura num Map<id, Team> quando o id pode ser null (confronto do mata-mata ainda não definido).
export function teamOf(teamById: Map<string, Team>, teamId: string | null) {
  return teamId ? teamById.get(teamId) : undefined
}

export function resultForTeam(match: Match, teamId: string): MatchResult | null {
  if (match.status !== 'realizado' || match.homeScore === null || match.awayScore === null) return null
  const isHome = match.homeTeamId === teamId
  const gf = isHome ? match.homeScore : match.awayScore
  const ga = isHome ? match.awayScore : match.homeScore
  if (gf > ga) return 'V'
  if (gf < ga) return 'D'
  return 'E'
}

export function opponentId(match: Match, teamId: string) {
  return match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId
}

export function scoreLabel(match: Match, teamId: string) {
  if (match.homeScore === null || match.awayScore === null) return '—'
  const isHome = match.homeTeamId === teamId
  const gf = isHome ? match.homeScore : match.awayScore
  const ga = isHome ? match.awayScore : match.homeScore
  return `${gf} - ${ga}`
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export interface PlayerAggregate {
  player: Player
  games: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export function playerAggregates(data: ChampionshipData, teamId: string): PlayerAggregate[] {
  const teamPlayers = data.players.filter((p) => p.teamId === teamId)
  return teamPlayers.map((player) => {
    const rows = data.stats.filter((s) => s.playerId === player.id)
    return rows.reduce<PlayerAggregate>(
      (acc, row: PlayerMatchStat) => {
        acc.games += row.played ? 1 : 0
        acc.goals += row.goals
        acc.assists += row.assists
        acc.yellowCards += row.yellowCards
        acc.redCards += row.redCards
        return acc
      },
      { player, games: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    )
  })
}
