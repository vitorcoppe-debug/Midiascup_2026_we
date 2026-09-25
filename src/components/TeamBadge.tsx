import type { Team } from '@/types'
import { cn } from '@/lib/utils'

export function TeamBadge({ team, className }: { team: Team | undefined; className?: string }) {
  if (!team) return <span className={cn('text-muted-foreground', className)}>A definir</span>
  return (
    <span className={cn('inline-flex items-center gap-2 font-medium', className)}>
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: team.color }}
        aria-hidden
      />
      {team.name}
      {team.isMyTeam && (
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          Meu time
        </span>
      )}
    </span>
  )
}
