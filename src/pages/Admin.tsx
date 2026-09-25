import { AdminGate } from '@/components/admin/AdminGate'
import { TeamsAdmin } from '@/components/admin/TeamsAdmin'
import { MatchesAdmin } from '@/components/admin/MatchesAdmin'
import { RosterAdmin } from '@/components/admin/RosterAdmin'
import { CoachAdmin } from '@/components/admin/CoachAdmin'
import { StatsAdmin } from '@/components/admin/StatsAdmin'
import { SettingsAdmin } from '@/components/admin/SettingsAdmin'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Admin() {
  return (
    <AdminGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">Lance os resultados e estatísticas depois de cada rodada.</p>
        </div>

        <Tabs defaultValue="jogos">
          <TabsList className="flex-wrap">
            <TabsTrigger value="jogos">Jogos</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            <TabsTrigger value="elenco">Elenco</TabsTrigger>
            <TabsTrigger value="times">Times</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="jogos" className="mt-4">
            <MatchesAdmin />
          </TabsContent>
          <TabsContent value="estatisticas" className="mt-4">
            <StatsAdmin />
          </TabsContent>
          <TabsContent value="elenco" className="mt-4 space-y-4">
            <RosterAdmin />
            <CoachAdmin />
          </TabsContent>
          <TabsContent value="times" className="mt-4">
            <TeamsAdmin />
          </TabsContent>
          <TabsContent value="config" className="mt-4">
            <SettingsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  )
}
