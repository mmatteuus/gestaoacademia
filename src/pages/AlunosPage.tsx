import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { PullToRefreshIndicator } from '@/components/shared/PullToRefreshIndicator';
import { AlunoCard } from '@/features/alunos/components/AlunoCard';
import { AlunoDetailsSheet } from '@/features/alunos/components/AlunoDetailsSheet';
import { AlunoFormDialog } from '@/features/alunos/components/AlunoFormDialog';
import { AlunosFilters } from '@/features/alunos/components/AlunosFilters';
import { AlunosPagination } from '@/features/alunos/components/AlunosPagination';
import { useAlunosPage } from '@/features/alunos/hooks/useAlunosPage';

export default function AlunosPage() {
  const page = useAlunosPage();
  const { pullDistance, refreshing, threshold } = page.pullToRefresh;

  return (
    <div className="space-y-6">
      <PullToRefreshIndicator
        distance={pullDistance}
        threshold={threshold}
        refreshing={refreshing}
      />

      <PageHeader
        title="Alunos"
        subtitle={`${page.alunosList.length} alunos cadastrados`}
        actions={
          <Button size="sm" onClick={page.openCreateForm}>
            <Plus className="mr-1 h-4 w-4" />
            Novo aluno
          </Button>
        }
      />

      <AlunosFilters
        busca={page.busca}
        filtroStatus={page.filtroStatus}
        onBuscaChange={page.changeBusca}
        onStatusChange={page.changeStatus}
      />

      {page.paginated.length === 0 ? (
        <EmptyState
          title="Nenhum aluno encontrado"
          description="Ajuste os filtros ou cadastre um novo aluno."
          action={{ label: 'Cadastrar aluno', onClick: page.openCreateForm }}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {page.paginated.map((aluno) => (
            <AlunoCard
              key={aluno.id}
              aluno={aluno}
              onOpen={page.setSelectedAlunoId}
              onEdit={page.openEditForm}
            />
          ))}
        </div>
      )}

      <AlunosPagination
        page={page.page}
        totalPages={page.totalPages}
        onPageChange={page.setPage}
      />

      <AlunoFormDialog
        open={page.formOpen}
        aluno={page.editingAluno}
        responsaveis={page.responsaveisList.map((item) => ({ id: item.id, nome: item.nome }))}
        onOpenChange={page.setFormOpen}
        onSubmit={page.handleFormSubmit}
      />

      <AlunoDetailsSheet
        alunoId={page.selectedAlunoId}
        onClose={() => page.setSelectedAlunoId(null)}
        onEdit={page.openEditForm}
      />
    </div>
  );
}
