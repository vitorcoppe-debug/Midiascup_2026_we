import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TeamBadge } from '@/components/TeamBadge'
import { cn } from '@/lib/utils'
import type { Standing, Team } from '@/types'

export function StandingsTable({
  standings,
  teams,
  highlightTopN,
}: {
  standings: Standing[]
  teams: Team[]
  /** Destaca as N primeiras posições (ex: 4 = times classificados para o mata-mata). */
  highlightTopN?: number
}) {
  const teamById = new Map(teams.map((t) => [t.id, t]))

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">J</TableHead>
            <TableHead className="text-center">V</TableHead>
            <TableHead className="text-center">E</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">GP</TableHead>
            <TableHead className="text-center">GC</TableHead>
            <TableHead className="text-center">SG</TableHead>
            <TableHead className="text-center">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((row, i) => {
            const team = teamById.get(row.teamId)
            const isCutoffLine = !!highlightTopN && i === highlightTopN - 1
            return (
              <TableRow
                key={row.teamId}
                className={cn(team?.isMyTeam && 'bg-primary/5', isCutoffLine && 'border-b-2 border-b-primary/40')}
              >
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell>
                  <TeamBadge team={team} />
                </TableCell>
                <TableCell className="text-center tabular-nums">{row.played}</TableCell>
                <TableCell className="text-center tabular-nums">{row.wins}</TableCell>
                <TableCell className="text-center tabular-nums">{row.draws}</TableCell>
                <TableCell className="text-center tabular-nums">{row.losses}</TableCell>
                <TableCell className="text-center tabular-nums">{row.goalsFor}</TableCell>
                <TableCell className="text-center tabular-nums">{row.goalsAgainst}</TableCell>
                <TableCell className="text-center tabular-nums">
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </TableCell>
                <TableCell className="text-center text-base font-bold tabular-nums">{row.points}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
