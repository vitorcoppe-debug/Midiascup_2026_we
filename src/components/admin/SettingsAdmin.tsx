import { useChampionship } from '@/lib/championship-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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

export function SettingsAdmin() {
  const { data, setMyTeamId, resetToSample } = useChampionship()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meu time</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define qual time é "o nosso" nas páginas de Meu Time e Atletas.
          </p>
        </CardHeader>
        <CardContent className="max-w-sm">
          <div className="space-y-1.5">
            <Label>Time</Label>
            <Select value={data.myTeamId} onValueChange={setMyTeamId}>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados de exemplo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Os dados ficam salvos no navegador (localStorage). Use isso para voltar ao exemplo inicial e recomeçar do zero.
          </p>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Restaurar dados de exemplo</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar dados de exemplo?</AlertDialogTitle>
              </AlertDialogHeader>
              <p className="text-sm text-muted-foreground">
                Isso substitui times, jogos, elenco e estatísticas atuais pelos dados de exemplo. Não pode ser desfeito.
              </p>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={resetToSample}>Restaurar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
