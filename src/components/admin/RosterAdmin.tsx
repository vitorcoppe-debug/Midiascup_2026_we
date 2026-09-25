import { useState } from 'react'
import { useChampionship } from '@/lib/championship-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import type { Player } from '@/types'

const EMPTY_FORM = { name: '', number: 1 }

export function RosterAdmin() {
  const { data, myTeam, addPlayer, updatePlayer, removePlayer } = useChampionship()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Player | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const roster = data.players.filter((p) => p.teamId === data.myTeamId).sort((a, b) => a.number - b.number)

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(player: Player) {
    setEditing(player)
    setForm({ name: player.name, number: player.number })
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editing) {
      updatePlayer(editing.id, form)
    } else {
      addPlayer({ ...form, teamId: data.myTeamId })
    }
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Elenco do {myTeam?.name ?? 'meu time'} ({roster.length})</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}>
              <Plus className="h-4 w-4" /> Novo atleta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar atleta' : 'Novo atleta'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Número</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {roster.map((player) => (
          <div key={player.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <PlayerAvatar player={player} />
              <p className="truncate text-sm font-medium">{player.name}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(player)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir {player.name}?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p className="text-sm text-muted-foreground">As estatísticas desse atleta também serão removidas.</p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removePlayer(player.id)}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
