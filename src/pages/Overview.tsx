import { useChampionship } from '@/lib/championship-context'
import { computeFase1Standings } from '@/lib/standings'
import { playerAggregates, teamOf } from '@/lib/aggregations'
import { isFase1Complete } from '@/lib/bracket'
import { StandingsTable } from '@/components/StandingsTable'
import { MatchRow } from '@/components/MatchRow'
import { StatTile } from '@/components/StatTile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Goal, Handshake, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Overview() {
  const { data, myTeam } = useChampionship()
  const standings = computeFase1Standings(data)
  const myPosition = standings.findIndex((s) => s.teamId === data.myTeamId) + 1
  const myStanding = standings.find((s) => s.teamId === data.myTeamId)
  const fase1Done = isFase1Complete(data.matches)
  const fase1Total = data.matches.filter((m) => m.phase === 'fase1').length
  const fase1Played = data.matches.filter((m) => m.phase === 'fase1' && m.status === 'realizado').length

  const upcoming = data.matches
    .filter((m) => m.status === 'agendado')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  const recent = data.matches
    .filter((m) => m.status === 'realizado')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  const aggregates = playerAggregates(data, data.myTeamId)
  const topScorer = [...aggregates].sort((a, b) => b.goals - a.goals)[0]
  const topAssist = [...aggregates].sort((a, b) => b.assists - a.assists)[0]

  const teamById = new Map(data.teams.map((t) => [t.id, t]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-sm text-muted-foreground">Acompanhe a Mídia's Cup e o desempenho do {myTeam?.name ?? 'seu time'}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Posição"
          value={myPosition ? `${myPosition}º` : '—'}
          icon={Trophy}
          hint={`${myStanding?.points ?? 0} pontos`}
        />
        <StatTile
          label="Aproveitamento"
          value={myStanding ? `${myStanding.wins}V ${myStanding.draws}E ${myStanding.losses}D` : '—'}
          icon={ShieldCheck}
        />
        <StatTile
          label="Artilheiro"
          value={topScorer && topScorer.goals > 0 ? topScorer.player.name.split(' ')[0] : '—'}
          hint={topScorer && topScorer.goals > 0 ? `${topScorer.goals} gols` : undefined}
          icon={Goal}
        />
        <StatTile
          label="Garçom"
          value={topAssist && topAssist.assists > 0 ? topAssist.player.name.split(' ')[0] : '—'}
          hint={topAssist && topAssist.assists > 0 ? `${topAssist.assists} assistências` : undefined}
          icon={Handshake}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Classificação — Fase 1 (pontos corridos)</CardTitle>
            <p className="text-xs text-muted-foreground">
              {fase1Done
                ? 'Fase 1 concluída — os 4 primeiros vão para o mata-mata.'
                : `${fase1Played}/${fase1Total} jogos realizados`}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/jogos">Ver todos os jogos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <StandingsTable standings={standings} teams={data.teams} highlightTopN={4} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Próximos jogos</h2>
          {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Nenhum jogo agendado.</p>}
          {upcoming.map((m) => (
            <MatchRow key={m.id} match={m} homeTeam={teamOf(teamById, m.homeTeamId)} awayTeam={teamOf(teamById, m.awayTeamId)} />
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Últimos resultados</h2>
          {recent.length === 0 && <p className="text-sm text-muted-foreground">Nenhum jogo realizado ainda.</p>}
          {recent.map((m) => (
            <MatchRow key={m.id} match={m} homeTeam={teamOf(teamById, m.homeTeamId)} awayTeam={teamOf(teamById, m.awayTeamId)} />
          ))}
        </div>
      </div>
    </div>
  )
}
