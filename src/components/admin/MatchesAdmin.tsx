import { useState } from 'react'
import { useChampionship } from '@/lib/championship-context'
import { formatDate, teamOf } from '@/lib/aggregations'
import { computeFase1Standings } from '@/lib/standings'
import { BRACKET_IDS, isFase1Complete, winnerTeamId, loserTeamId } from '@/lib/bracket'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Plus, Trash2, Wand2 } from 'lucide-react'
import type { Match, Team } from '@/types'

function MatchEditRow({
  match,
  teamById,
  onScoreChange,
  onToggleStatus,
  onRemove,
  removable = true,
}: {
  match: Match
  teamById: Map<string, Team>
  onScoreChange: (match: Match, field: 'homeScore' | 'awayScore', value: string) => void
  onToggleStatus: (match: Match) => void
  onRemove: (id: string) => void
  removable?: boolean
}) {
  const bothDefined = !!match.homeTeamId && !!match.awayTeamId

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-2.5">
      <div className="min-w-0 text-xs text-muted-foreground">
        {match.round ? `R${match.round}` : match.label} · {formatDate(match.date)}
        {match.time && ` · ${match.time}`}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-sm">
        <span className="min-w-0 flex-1 truncate text-right">{teamOf(teamById, match.homeTeamId)?.name ?? 'A definir'}</span>
        <Input
          type="number"
          min={0}
          disabled={!bothDefined}
          className="h-8 w-14 text-center"
          value={match.homeScore ?? ''}
          onChange={(e) => onScoreChange(match, 'homeScore', e.target.value)}
        />
        <span className="text-muted-foreground">x</span>
        <Input
          type="number"
          min={0}
          disabled={!bothDefined}
          className="h-8 w-14 text-center"
          value={match.awayScore ?? ''}
          onChange={(e) => onScoreChange(match, 'awayScore', e.target.value)}
        />
        <span className="min-w-0 flex-1 truncate">{teamOf(teamById, match.awayTeamId)?.name ?? 'A definir'}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant={match.status === 'realizado' ? 'default' : 'outline'}
          size="sm"
          disabled={!bothDefined}
          onClick={() => onToggleStatus(match)}
        >
          {match.status === 'realizado' ? 'Realizado' : 'Marcar como realizado'}
        </Button>
        {removable && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir esse jogo?</AlertDialogTitle>
              </AlertDialogHeader>
              <p className="text-sm text-muted-foreground">As estatísticas de jogadores nesse jogo também serão removidas.</p>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(match.id)}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

export function MatchesAdmin() {
  const { data, addMatch, updateMatch, removeMatch } = useChampionship()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    round: 1,
    date: new Date().toISOString().slice(0, 10),
    time: '',
    homeTeamId: data.teams[0]?.id ?? '',
    awayTeamId: data.teams[1]?.id ?? '',
    location: '',
  })

  const teamById = new Map(data.teams.map((t) => [t.id, t]))
  const fase1 = [...data.matches.filter((m) => m.phase === 'fase1')].sort(
    (a, b) => (a.round ?? 0) - (b.round ?? 0) || a.date.localeCompare(b.date),
  )
  const sf1 = data.matches.find((m) => m.id === BRACKET_IDS.sf1)
  const sf2 = data.matches.find((m) => m.id === BRACKET_IDS.sf2)
  const final = data.matches.find((m) => m.id === BRACKET_IDS.final)
  const terceiro = data.matches.find((m) => m.id === BRACKET_IDS.terceiro)

  const fase1Done = isFase1Complete(data.matches)
  const semisReady = sf1?.status === 'realizado' && sf2?.status === 'realizado'

  function handleCreate() {
    if (!form.homeTeamId || !form.awayTeamId || form.homeTeamId === form.awayTeamId) return
    addMatch({
      phase: 'fase1',
      round: Number(form.round),
      date: form.date,
      time: form.time || undefined,
      homeTeamId: form.homeTeamId,
      awayTeamId: form.awayTeamId,
      homeScore: null,
      awayScore: null,
      status: 'agendado',
      location: form.location || undefined,
    })
    setOpen(false)
  }

  function handleScoreChange(match: Match, field: 'homeScore' | 'awayScore', value: string) {
    const num = value === '' ? null : Number(value)
    updateMatch(match.id, { [field]: num })
  }

  function toggleStatus(match: Match) {
    if (match.status === 'agendado') {
      updateMatch(match.id, {
        status: 'realizado',
        homeScore: match.homeScore ?? 0,
        awayScore: match.awayScore ?? 0,
      })
    } else {
      updateMatch(match.id, { status: 'agendado' })
    }
  }

  function generateSemifinals() {
    const standings = computeFase1Standings(data)
    if (standings.length < 4) return
    updateMatch(BRACKET_IDS.sf1, { homeTeamId: standings[0].teamId, awayTeamId: standings[3].teamId })
    updateMatch(BRACKET_IDS.sf2, { homeTeamId: standings[1].teamId, awayTeamId: standings[2].teamId })
  }

  function generateFinals() {
    if (!sf1 || !sf2) return
    const finalHome = winnerTeamId(sf1)
    const finalAway = winnerTeamId(sf2)
    const terceiroHome = loserTeamId(sf1)
    const terceiroAway = loserTeamId(sf2)
    if (!finalHome || !finalAway || !terceiroHome || !terceiroAway) return
    updateMatch(BRACKET_IDS.final, { homeTeamId: finalHome, awayTeamId: finalAway })
    updateMatch(BRACKET_IDS.terceiro, { homeTeamId: terceiroHome, awayTeamId: terceiroAway })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mata-mata (fase 2)</CardTitle>
          <p className="text-sm text-muted-foreground">
            1º x 4º e 2º x 3º da fase 1. Gere os confrontos quando estiver na hora — nada acontece sozinho.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled={!fase1Done} onClick={generateSemifinals}>
              <Wand2 className="h-4 w-4" /> Gerar semifinais (1º x 4º, 2º x 3º)
            </Button>
            <Button size="sm" variant="outline" disabled={!semisReady} onClick={generateFinals}>
              <Wand2 className="h-4 w-4" /> Definir final e disputa de 3º lugar
            </Button>
          </div>
          {!fase1Done && (
            <p className="text-xs text-muted-foreground">
              Marque todos os jogos da fase 1 como realizados para liberar a geração das semifinais.
            </p>
          )}
          <div className="space-y-2">
            {[sf1, sf2, final, terceiro].map(
              (m) =>
                m && (
                  <MatchEditRow
                    key={m.id}
                    match={m}
                    teamById={teamById}
                    onScoreChange={handleScoreChange}
                    onToggleStatus={toggleStatus}
                    onRemove={removeMatch}
                    removable={false}
                  />
                ),
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Fase 1 — pontos corridos ({fase1.length})</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" /> Novo jogo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo jogo (fase 1)</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Rodada</Label>
                    <Input
                      type="number"
                      min={1}
                      max={14}
                      value={form.round}
                      onChange={(e) => setForm({ ...form, round: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Horário</Label>
                    <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Mandante</Label>
                  <Select value={form.homeTeamId} onValueChange={(v) => setForm({ ...form, homeTeamId: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {data.teams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Visitante</Label>
                  <Select value={form.awayTeamId} onValueChange={(v) => setForm({ ...form, awayTeamId: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {data.teams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Local (opcional)</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-2">
          {fase1.map((match) => (
            <MatchEditRow
              key={match.id}
              match={match}
              teamById={teamById}
              onScoreChange={handleScoreChange}
              onToggleStatus={toggleStatus}
              onRemove={removeMatch}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
