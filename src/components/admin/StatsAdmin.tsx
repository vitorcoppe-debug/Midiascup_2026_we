import { useMemo, useState } from 'react'
import { useChampionship } from '@/lib/championship-context'
import { teamMatches, opponentId, formatDate, teamOf } from '@/lib/aggregations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function StatsAdmin() {
  const { data, upsertStat } = useChampionship()
  const myMatches = useMemo(() => teamMatches(data.matches, data.myTeamId), [data.matches, data.myTeamId])
  const teamById = new Map(data.teams.map((t) => [t.id, t]))
  const roster = data.players.filter((p) => p.teamId === data.myTeamId).sort((a, b) => a.number - b.number)

  const [matchId, setMatchId] = useState(myMatches[myMatches.length - 1]?.id ?? '')
  const match = data.matches.find((m) => m.id === matchId)

  function statFor(playerId: string) {
    return data.stats.find((s) => s.playerId === playerId && s.matchId === matchId)
  }

  function setField(playerId: string, field: 'goals' | 'assists' | 'yellowCards' | 'redCards', value: number) {
    const existing = statFor(playerId)
    upsertStat({
      id: existing?.id,
      playerId,
      matchId,
      played: existing?.played ?? true,
      goals: existing?.goals ?? 0,
      assists: existing?.assists ?? 0,
      yellowCards: existing?.yellowCards ?? 0,
      redCards: existing?.redCards ?? 0,
      [field]: value,
    })
  }

  function setPlayed(playerId: string, played: boolean) {
    const existing = statFor(playerId)
    upsertStat({
      id: existing?.id,
      playerId,
      matchId,
      played,
      goals: existing?.goals ?? 0,
      assists: existing?.assists ?? 0,
      yellowCards: existing?.yellowCards ?? 0,
      redCards: existing?.redCards ?? 0,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Estatísticas por jogo</CardTitle>
        <p className="text-sm text-muted-foreground">Lance quem jogou, gols, assistências e cartões dos atletas do seu time.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm space-y-1.5">
          <Select value={matchId} onValueChange={setMatchId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o jogo" />
            </SelectTrigger>
            <SelectContent>
              {myMatches.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.round ? `R${m.round}` : m.label} · {formatDate(m.date)} vs{' '}
                  {teamOf(teamById, opponentId(m, data.myTeamId))?.name ?? 'A definir'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!match && <p className="text-sm text-muted-foreground">Cadastre um jogo em "Jogos" para lançar estatísticas.</p>}

        {match && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Jogou</TableHead>
                  <TableHead>Atleta</TableHead>
                  <TableHead className="w-20 text-center">Gols</TableHead>
                  <TableHead className="w-20 text-center">Assist.</TableHead>
                  <TableHead className="w-20 text-center">CA</TableHead>
                  <TableHead className="w-20 text-center">CV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((player) => {
                  const stat = statFor(player.id)
                  return (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Checkbox
                          checked={stat?.played ?? false}
                          onCheckedChange={(checked) => setPlayed(player.id, checked === true)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {player.number} · {player.name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          className="h-8 w-16 text-center"
                          value={stat?.goals ?? 0}
                          onChange={(e) => setField(player.id, 'goals', Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          className="h-8 w-16 text-center"
                          value={stat?.assists ?? 0}
                          onChange={(e) => setField(player.id, 'assists', Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={2}
                          className="h-8 w-16 text-center"
                          value={stat?.yellowCards ?? 0}
                          onChange={(e) => setField(player.id, 'yellowCards', Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={1}
                          className="h-8 w-16 text-center"
                          value={stat?.redCards ?? 0}
                          onChange={(e) => setField(player.id, 'redCards', Number(e.target.value))}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
