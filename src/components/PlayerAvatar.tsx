import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Player } from '@/types'

export function PlayerAvatar({ player, className }: { player: Player; className?: string }) {
  return (
    <Avatar className={cn('h-9 w-9', className)}>
      {player.photoUrl && <AvatarImage src={player.photoUrl} alt={player.name} className="object-cover" />}
      <AvatarFallback className="text-xs font-bold tabular-nums">{player.number}</AvatarFallback>
    </Avatar>
  )
}
