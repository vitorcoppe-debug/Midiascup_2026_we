import { useChampionship } from '@/lib/championship-context'
import { computeFase1Standings } from '@/lib/standings'
import { teamMatches, resultForTeam, opponentId, scoreLabel, formatDate, teamOf, playerAggregates } from '@/lib/aggregations'
import { miniGameForTime } from '@/lib/minigames'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamBadge } from '@/components/TeamBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlayerProfileDialog } from '@/components/PlayerProfileDialog'
import { ResultPill } from '@/components/ResultPill'
import { Badge } from '@/components/ui/badge'
import { StatTile } from '@/components/StatTile'
import { Trophy, Goal, ShieldAlert, Gamepad2 } from 'lucide-react'

export function MyTeam() {
  const { data, myTeam } = useChampionship()
  const standings = computeFase1Standings(data)
  const myStanding = standings.find((s) => s.teamId === data.myTeamId)
  const myPosition = standings.findIndex((s) => s.teamId === data.myTeamId) + 1

  const matches = teamMatches(data.matches, data.myTeamId)
  const teamById = new Map(data.teams.map((t) => [t.id, t]))
  const roster = data.players.filter((p) => p.teamId === data.myTeamId)
  const coaches = data.coaches.filter((c) => c.teamId === data.myTeamId)
  const aggregates = playerAggregates(data, data.myTeamId)

  const form = matches
    .filter((m) => m.status === 'realizado')
    .slice(-5)
    .map((m) => resultForTeam(m, data.myTeamId))

  if (!myTeam) {
    return <p className="text-sm text-muted-foreground">Nenhum time configurado como "meu time" ainda. Ajuste em Admin.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <img src="/escudo.png" alt={myTeam.name} className="h-14 w-14 shrink-0 object-contain" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{myTeam.name}</h1>
          <p className="text-sm text-muted-foreground">
            {myPosition}º lugar na fase 1 · {myStanding?.points ?? 0} pontos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Jogos (fase 1)" value={myStanding?.played ?? 0} icon={Trophy} />
        <StatTile label="Gols marcados" value={myStanding?.goalsFor ?? 0} icon={Goal} />
        <StatTile label="Gols sofridos" value={myStanding?.goalsAgainst ?? 0} icon={ShieldAlert} />
        <Card>
          <CardContent className="flex h-full flex-col justify-center gap-2 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Últimos jogos</p>
            <div className="flex gap-1.5">
              {form.length === 0 && <span className="text-sm text-muted-foreground">—</span>}
              {form.map((r, i) => r && <ResultPill key={i} result={r} />)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos os jogos do time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {matches.map((m) => {
            const opp = teamOf(teamById, opponentId(m, data.myTeamId))
            const result = resultForTeam(m, data.myTeamId)
            const miniGame = miniGameForTime(m.time)
            return (
              <div key={m.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {m.round ? `Rodada ${m.round}` : m.label} · {formatDate(m.date)}
                      {m.time && ` · ${m.time}`}
                    </p>
                    <div className="mt-0.5">
                      <TeamBadge team={opp} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-bold tabular-nums">{scoreLabel(m, data.myTeamId)}</span>
                    {result ? <ResultPill result={result} /> : <Badge variant="secondary">Agendado</Badge>}
                  </div>
                </div>
                {miniGame && (
                  <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
                    <Gamepad2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                    Últimos 2 min: <span className="font-medium text-foreground">{miniGame.rule}</span>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Elenco ({roster.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {roster
              .sort((a, b) => a.number - b.number)
              .map((p) => (
                <PlayerProfileDialog
                  key={p.id}
                  player={p}
                  aggregate={aggregates.find((a) => a.player.id === p.id)}
                  triggerClassName="w-full rounded-xl"
                >
                  <div className="group flex flex-col items-center gap-2 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
                    <Avatar className="h-16 w-16 shadow-sm transition-transform duration-200 group-hover:scale-110">
                      {p.photoUrl && <AvatarImage src={p.photoUrl} alt={p.name} className="object-cover" />}
                      <AvatarFallback className="text-lg font-bold tabular-nums">{p.number}</AvatarFallback>
                    </Avatar>
                    <p className="w-full truncate text-center text-xs font-medium">{p.name}</p>
                  </div>
                </PlayerProfileDialog>
              ))}
          </div>
        </CardContent>
      </Card>

      {coaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comissão Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {coaches.map((c) => (
                <div key={c.id} className="flex flex-col items-center gap-2 rounded-xl border border-border p-3">
                  <Avatar className="h-16 w-16 shadow-sm">
                    {c.photoUrl && <AvatarImage src={c.photoUrl} alt={c.name} className="object-cover" />}
                    <AvatarFallback className="text-lg font-bold">{c.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="w-full truncate text-xs font-medium">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
