import { useMemo, useState } from 'react'
import { useChampionship } from '@/lib/championship-context'
import { playerAggregates, type PlayerAggregate } from '@/lib/aggregations'
import { Card, CardContent } from '@/components/ui/card'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import { PlayerProfileDialog } from '@/components/PlayerProfileDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type SortKey = 'goals' | 'assists' | 'games' | 'yellowCards'

const SORT_LABELS: Record<SortKey, string> = {
  goals: 'Gols',
  assists: 'Assistências',
  games: 'Jogos',
  yellowCards: 'Cartões',
}

export function Athletes() {
  const { data, myTeam } = useChampionship()
  const [sortKey, setSortKey] = useState<SortKey>('goals')

  const aggregates = useMemo(() => playerAggregates(data, data.myTeamId), [data])

  const sorted = useMemo(
    () => [...aggregates].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number) || a.player.name.localeCompare(b.player.name)),
    [aggregates, sortKey],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Atletas</h1>
        <p className="text-sm text-muted-foreground">
          Estatísticas individuais do {myTeam?.name ?? 'seu time'}. Só temos dados detalhados do nosso elenco.
        </p>
      </div>

      <Tabs value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
        <TabsList>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {SORT_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Atleta</TableHead>
                  <TableHead className="text-center">J</TableHead>
                  <TableHead className="text-center">Gols</TableHead>
                  <TableHead className="text-center">Assist.</TableHead>
                  <TableHead className="text-center">CA</TableHead>
                  <TableHead className="text-center">CV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((row: PlayerAggregate, i) => (
                  <TableRow key={row.player.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PlayerProfileDialog player={row.player} aggregate={row}>
                          <PlayerAvatar player={row.player} className="h-7 w-7 transition-transform hover:scale-125" />
                        </PlayerProfileDialog>
                        <span className="font-medium">{row.player.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{row.games}</TableCell>
                    <TableCell className="text-center font-semibold tabular-nums">{row.goals}</TableCell>
                    <TableCell className="text-center tabular-nums">{row.assists}</TableCell>
                    <TableCell className="text-center tabular-nums text-warning">{row.yellowCards || ''}</TableCell>
                    <TableCell className="text-center tabular-nums text-destructive">{row.redCards || ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
