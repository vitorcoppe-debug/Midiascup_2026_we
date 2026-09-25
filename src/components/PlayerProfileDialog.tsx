import { useState, type ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Goal, Handshake, ShieldAlert, Trophy } from 'lucide-react'
import type { Player } from '@/types'
import type { PlayerAggregate } from '@/lib/aggregations'

function StatBlock({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border p-3">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

export function PlayerProfileDialog({
  player,
  aggregate,
  children,
  triggerClassName,
}: {
  player: Player
  aggregate?: PlayerAggregate
  /** Elemento clicável que abre o perfil (ex: avatar ou card inteiro). */
  children: ReactNode
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn('cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring', triggerClassName ?? 'rounded-full')}
        aria-label={`Ver perfil de ${player.name}`}
      >
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs">
          <DialogTitle className="sr-only">{player.name}</DialogTitle>
          <div className="flex flex-col items-center gap-4 pt-2">
            <Avatar className="h-32 w-32 border-4 border-primary/10 shadow-sm">
              {player.photoUrl && <AvatarImage src={player.photoUrl} alt={player.name} className="object-cover" />}
              <AvatarFallback className="text-3xl font-bold tabular-nums">{player.number}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-lg font-bold leading-tight">{player.name}</p>
              <p className="text-sm text-muted-foreground">Camisa {player.number}</p>
            </div>
            {aggregate && (
              <div className="grid w-full grid-cols-4 gap-2">
                <StatBlock icon={Trophy} label="Jogos" value={aggregate.games} />
                <StatBlock icon={Goal} label="Gols" value={aggregate.goals} />
                <StatBlock icon={Handshake} label="Assist." value={aggregate.assists} />
                <StatBlock icon={ShieldAlert} label="Cartões" value={aggregate.yellowCards + aggregate.redCards} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
