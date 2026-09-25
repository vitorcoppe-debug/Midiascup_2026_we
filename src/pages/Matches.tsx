import { useMemo } from 'react'
import { useChampionship } from '@/lib/championship-context'
import { teamOf } from '@/lib/aggregations'
import { BRACKET_IDS } from '@/lib/bracket'
import { MINIGAME_LIST } from '@/lib/minigames'
import { MatchRow } from '@/components/MatchRow'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Gamepad2 } from 'lucide-react'

export function Matches() {
  const { data } = useChampionship()
  const teamById = new Map(data.teams.map((t) => [t.id, t]))

  const fase1Rounds = useMemo(() => {
    const byRound = new Map<number, typeof data.matches>()
    for (const m of data.matches) {
      if (m.phase !== 'fase1' || m.round === null) continue
      const list = byRound.get(m.round) ?? []
      list.push(m)
      byRound.set(m.round, list)
    }
    return Array.from(byRound.entries()).sort((a, b) => a[0] - b[0])
  }, [data.matches])

  const sf1 = data.matches.find((m) => m.id === BRACKET_IDS.sf1)
  const sf2 = data.matches.find((m) => m.id === BRACKET_IDS.sf2)
  const final = data.matches.find((m) => m.id === BRACKET_IDS.final)
  const terceiro = data.matches.find((m) => m.id === BRACKET_IDS.terceiro)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jogos</h1>
        <p className="text-sm text-muted-foreground">Calendário completo da Mídia's Cup.</p>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Trophy className="h-4 w-4" /> Mata-mata (fase 2)
        </h2>
        <Card>
          <CardContent className="space-y-4 p-4">
            <p className="text-xs text-muted-foreground">
              1º x 4º e 2º x 3º da fase 1 nas semifinais · vencedores na final · perdedores na disputa de 3º lugar.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {[sf1, sf2, final, terceiro].map(
                (m) =>
                  m && (
                    <MatchRow
                      key={m.id}
                      match={m}
                      homeTeam={teamOf(teamById, m.homeTeamId)}
                      awayTeam={teamOf(teamById, m.awayTeamId)}
                    />
                  ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Fase 1 — pontos corridos</h2>
          <Card>
            <CardContent className="space-y-1.5 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5 font-medium text-foreground">
                <Gamepad2 className="h-3.5 w-3.5 text-accent" /> Regra nova: mini-game nos últimos 2 minutos de cada jogo
              </p>
              <p>O mini-game depende do horário da partida:</p>
              <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                {MINIGAME_LIST.map((mg) => (
                  <li key={mg.label}>
                    <span className="font-medium text-foreground">{mg.label}</span> — {mg.rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        {fase1Rounds.map(([round, matches]) => (
          <div key={round} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rodada {round}</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {matches
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((m) => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    homeTeam={teamOf(teamById, m.homeTeamId)}
                    awayTeam={teamOf(teamById, m.awayTeamId)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
