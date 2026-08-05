import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PullToRefreshIndicator } from '@/components/shared/PullToRefreshIndicator';
import { Button } from '@/components/ui/button';
import { AlunoDetailsSheet } from '@/features/alunos/components/AlunoDetailsSheet';
import { AlunoFormDialog } from '@/features/alunos/components/AlunoFormDialog';
import { AlunosGrid } from '@/features/alunos/components/AlunosGrid';
import { AlunosPagination } from '@/features/alunos/components/AlunosPagination';
import { AlunosToolbar } from '@/features/alunos/components/AlunosToolbar';
import { useAlunosPage } from '@/features/alunos/hooks/useAlunosPage';

export default function AlunosPage() {
  const alunos = useAlunosPage();

  return (
    <div className="space-y-6">
      <PullToRefreshIndicator
        distance={alunos.refreshState.pullDistance}
        threshold={alunos.refreshState.threshold}
        refreshing={alunos.refreshState.refreshing}
      />

      <PageHeader
        title="Alunos"
        subtitle={`${alunos.alunosList.length} alunos cadastrados`}
        actions={
          <Button size="sm" onClick={alunos.openCreateForm}>
            <Plus className="mr-1 h-4 w-4" />
            Novo aluno
          </Button>
        }
      />

      <AlunosToolbar
        search={alunos.busca}
        status={alunos.filtroStatus}
        onSearchChange={alunos.updateSearch}
        onStatusChange={alunos.updateStatus}
      />

      <AlunosGrid
        alunos={alunos.paginated}
        onCreate={alunos.openCreateForm}
        onOpen={alunos.openAluno}
        onEdit={alunos.openEditForm}
      />

      <AlunosPagination
        page={alunos.page}
        totalPages={alunos.totalPages}
        onPrevious={alunos.previousPage}
        onNext={alunos.nextPage}
      />

      <AlunoFormDialog
        open={alunos.formOpen}
        aluno={alunos.editingAluno}
        responsaveis={alunos.responsaveisList.map((responsavel) => ({
          id: responsavel.id,
          nome: responsavel.nome,
        }))}
        onOpenChange={alunos.setFormOpen}
        onSubmit={alunos.submitForm}
      />

      <AlunoDetailsSheet
        alunoId={alunos.selectedAlunoId}
        onClose={alunos.closeAluno}
        onEdit={alunos.openEditForm}
      />
    </div>
  );
}
