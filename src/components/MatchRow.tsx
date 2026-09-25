import { Card, CardContent } from '@/components/ui/card'
import { TeamBadge } from '@/components/TeamBadge'
import { formatDate } from '@/lib/aggregations'
import { miniGameForTime } from '@/lib/minigames'
import { MapPin, Gamepad2 } from 'lucide-react'
import type { Match, Team } from '@/types'

export function MatchRow({ match, homeTeam, awayTeam }: { match: Match; homeTeam?: Team; awayTeam?: Team }) {
  const played = match.status === 'realizado'
  const miniGame = miniGameForTime(match.time)

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {match.round ? `Rodada ${match.round}` : match.label} · {formatDate(match.date)}
            {match.time && ` · ${match.time}`}
          </span>
          {match.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {match.location}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <TeamBadge team={homeTeam} className="min-w-0 flex-1 truncate" />
          <div className="flex shrink-0 items-center gap-2 font-bold tabular-nums">
            {played ? (
              <>
                <span className="w-5 text-right">{match.homeScore}</span>
                <span className="text-muted-foreground">x</span>
                <span className="w-5">{match.awayScore}</span>
              </>
            ) : (
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Agendado</span>
            )}
          </div>
          <TeamBadge team={awayTeam} className="min-w-0 flex-1 flex-row-reverse truncate text-right" />
        </div>
        {miniGame && (
          <div className="flex items-center gap-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
            <Gamepad2 className="h-3.5 w-3.5 shrink-0 text-accent" />
            Últimos 2 min: <span className="font-medium text-foreground">{miniGame.rule}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
