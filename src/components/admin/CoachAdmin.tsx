import { useState } from 'react'
import { useChampionship } from '@/lib/championship-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import type { Coach } from '@/types'

const EMPTY_FORM = { name: '', role: 'Técnico' }

export function CoachAdmin() {
  const { data, myTeam, addCoach, updateCoach, removeCoach } = useChampionship()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Coach | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const coaches = data.coaches.filter((c) => c.teamId === data.myTeamId)

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(coach: Coach) {
    setEditing(coach)
    setForm({ name: coach.name, role: coach.role })
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editing) {
      updateCoach(editing.id, form)
    } else {
      addCoach({ ...form, teamId: data.myTeamId })
    }
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Comissão técnica do {myTeam?.name ?? 'meu time'} ({coaches.length})</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}>
              <Plus className="h-4 w-4" /> Novo membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar membro' : 'Novo membro da comissão'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Função</Label>
                <Input
                  value={form.role}
                  placeholder="Técnico, Auxiliar técnico, Preparador físico..."
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
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
        {coaches.length === 0 && <p className="text-sm text-muted-foreground">Nenhum membro cadastrado ainda.</p>}
        {coaches.map((coach) => (
          <div key={coach.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-9 w-9">
                {coach.photoUrl && <AvatarImage src={coach.photoUrl} alt={coach.name} className="object-cover" />}
                <AvatarFallback className="text-xs font-bold">{coach.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{coach.name}</p>
                <p className="text-xs text-muted-foreground">{coach.role}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(coach)}>
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
                    <AlertDialogTitle>Excluir {coach.name}?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p className="text-sm text-muted-foreground">Não pode ser desfeito.</p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeCoach(coach.id)}>Excluir</AlertDialogAction>
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
