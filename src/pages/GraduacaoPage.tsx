import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduacaoAlunoFilter } from '@/features/graduacao/components/GraduacaoAlunoFilter';
import { GraduacaoHistoryList } from '@/features/graduacao/components/GraduacaoHistoryList';
import { GraduacaoProgressList } from '@/features/graduacao/components/GraduacaoProgressList';
import { GraduacaoRulesList } from '@/features/graduacao/components/GraduacaoRulesList';
import { RegraGraduacaoDialog } from '@/features/graduacao/components/RegraGraduacaoDialog';
import { useGraduacaoPage } from '@/features/graduacao/hooks/useGraduacaoPage';

export default function GraduacaoPage() {
  const graduacao = useGraduacaoPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Graduação"
        subtitle="Progresso e regras de graduação"
        actions={
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={graduacao.sincronizarGraduacoes}>
              Sincronizar alunos
            </Button>
            <Button type="button" size="sm" onClick={graduacao.abrirNovaRegra}>
              <Plus className="mr-1 h-4 w-4" />
              Nova regra
            </Button>
          </div>
        }
      />

      <GraduacaoAlunoFilter
        alunoId={graduacao.alunoFiltroId}
        alunos={graduacao.alunos}
        onChange={graduacao.setAlunoFiltro}
      />

      <Tabs defaultValue="progresso">
        <TabsList className="h-auto flex-wrap bg-muted/50">
          <TabsTrigger value="progresso" className="text-xs">Progresso</TabsTrigger>
          <TabsTrigger value="regras" className="text-xs">Regras</TabsTrigger>
          <TabsTrigger value="historico" className="text-xs">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="progresso" className="mt-4">
          <GraduacaoProgressList alunos={graduacao.alunos} graduacoes={graduacao.graduacoes} />
        </TabsContent>

        <TabsContent value="regras" className="mt-4">
          <GraduacaoRulesList regras={graduacao.regras} onEdit={graduacao.abrirEdicao} />
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          <GraduacaoHistoryList alunos={graduacao.alunos} historico={graduacao.historico} />
        </TabsContent>
      </Tabs>

      <RegraGraduacaoDialog
        open={graduacao.dialogOpen}
        regra={graduacao.editingRegra}
        onOpenChange={graduacao.setDialogOpen}
        onSubmit={graduacao.salvarRegra}
      />
    </div>
  );
}
