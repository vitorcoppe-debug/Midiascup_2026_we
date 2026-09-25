import type { ChampionshipData, Match, Standing, Team } from '@/types'

export function computeStandings(teams: Team[], matches: Match[]): Standing[] {
  const table = new Map<string, Standing>(
    teams.map((t) => [
      t.id,
      { teamId: t.id, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 },
    ]),
  )

  for (const match of matches) {
    if (match.status !== 'realizado' || match.homeScore === null || match.awayScore === null) continue
    if (!match.homeTeamId || !match.awayTeamId) continue

    const home = table.get(match.homeTeamId)
    const away = table.get(match.awayTeamId)
    if (!home || !away) continue

    home.played += 1
    away.played += 1
    home.goalsFor += match.homeScore
    home.goalsAgainst += match.awayScore
    away.goalsFor += match.awayScore
    away.goalsAgainst += match.homeScore

    if (match.homeScore > match.awayScore) {
      home.wins += 1
      home.points += 3
      away.losses += 1
    } else if (match.homeScore < match.awayScore) {
      away.wins += 1
      away.points += 3
      home.losses += 1
    } else {
      home.draws += 1
      away.draws += 1
      home.points += 1
      away.points += 1
    }
  }

  for (const row of table.values()) {
    row.goalDiff = row.goalsFor - row.goalsAgainst
  }

  return Array.from(table.values()).sort(
    (a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor,
  )
}

// A classificação do campeonato é sempre baseada só na fase 1 (pontos corridos) —
// o mata-mata não altera pontos, posições nem saldo de gols.
export function computeFase1Standings(data: ChampionshipData): Standing[] {
  return computeStandings(
    data.teams,
    data.matches.filter((m) => m.phase === 'fase1'),
  )
}
