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
import type { Team } from '@/types'

const EMPTY_FORM = { name: '', shortName: '', color: '#16a34a' }

export function TeamsAdmin() {
  const { data, addTeam, updateTeam, removeTeam } = useChampionship()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Team | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(team: Team) {
    setEditing(team)
    setForm({ name: team.name, shortName: team.shortName, color: team.color })
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editing) {
      updateTeam(editing.id, form)
    } else {
      addTeam({ ...form, shortName: form.shortName.toUpperCase().slice(0, 3) || form.name.slice(0, 3).toUpperCase() })
    }
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Times ({data.teams.length})</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}>
              <Plus className="h-4 w-4" /> Novo time
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar time' : 'Novo time'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="team-name">Nome</Label>
                <Input id="team-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="team-short">Sigla</Label>
                  <Input
                    id="team-short"
                    maxLength={3}
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-color">Cor</Label>
                  <Input
                    id="team-color"
                    type="color"
                    className="h-10 w-full p-1"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.teams.map((team) => (
          <div key={team.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />
              <span className="truncate text-sm font-medium">{team.name}</span>
              <span className="text-xs text-muted-foreground">{team.shortName}</span>
              {team.isMyTeam && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  Meu time
                </span>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(team)}>
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
                    <AlertDialogTitle>Excluir {team.name}?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p className="text-sm text-muted-foreground">
                    Isso também remove os jogos e jogadores vinculados a esse time. Não pode ser desfeito.
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeTeam(team.id)}>Excluir</AlertDialogAction>
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
