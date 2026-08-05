import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { FrequenciaDialog } from '@/features/frequencia/components/FrequenciaDialog';
import { SessoesList } from '@/features/frequencia/components/SessoesList';
import { TurmaSelector } from '@/features/frequencia/components/TurmaSelector';
import { useFrequenciaPage } from '@/features/frequencia/hooks/useFrequenciaPage';

export default function FrequenciaPage() {
  const frequencia = useFrequenciaPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequência"
        subtitle="Lançamento e acompanhamento de presença"
        actions={
          <Button type="button" size="sm" onClick={frequencia.abrirLancamento} disabled={!frequencia.turma}>
            <Plus className="mr-1 h-4 w-4" />
            Lançar presença
          </Button>
        }
      />

      {frequencia.turmas.length === 0 ? (
        <EmptyState
          title="Nenhuma turma cadastrada"
          description="Crie uma turma antes de lançar frequência."
        />
      ) : (
        <>
          <TurmaSelector
            turmas={frequencia.turmas}
            selectedId={frequencia.turmaId}
            onChange={frequencia.setTurmaId}
          />
          <SessoesList sessoes={frequencia.sessoes} alunos={frequencia.alunos} />
        </>
      )}

      <FrequenciaDialog
        open={frequencia.dialogOpen}
        turma={frequencia.turma}
        alunos={frequencia.alunos}
        presencas={frequencia.presencas}
        onOpenChange={frequencia.setDialogOpen}
        onToggle={frequencia.togglePresenca}
        onSubmit={frequencia.salvarFrequencia}
      />
    </div>
  );
}
