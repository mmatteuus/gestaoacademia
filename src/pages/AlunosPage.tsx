import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AlunoForm } from '@/components/forms/AlunoForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { PullToRefreshIndicator } from '@/components/shared/PullToRefreshIndicator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { fromFormToAlunoPatch } from '@/features/alunos/adapters/alunos.adapter';
import { AlunoDetailsSheet } from '@/features/alunos/components/AlunoDetailsSheet';
import { AlunosListPanel } from '@/features/alunos/components/AlunosListPanel';
import type { AlunoFormValues } from '@/features/alunos/types/aluno.types';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { haptic } from '@/lib/haptics';
import type { Aluno, AlunoStatus } from '@/types';

const PER_PAGE = 6;

export default function AlunosPage() {
  const data = useAcademiaData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [editingAlunoId, setEditingAlunoId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { pullDistance, refreshing, threshold } = usePullToRefresh(() => queryClient.invalidateQueries());

  const selectedAluno = selectedAlunoId
    ? data.alunosList.find((aluno) => aluno.id === selectedAlunoId) ?? null
    : null;
  const editingAluno = editingAlunoId
    ? data.alunosList.find((aluno) => aluno.id === editingAlunoId)
    : undefined;
  const filtered = useMemo(() => data.alunosList.filter((aluno) => {
    const matchesName = aluno.nome.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === 'todos' || aluno.status === filtroStatus;
    return matchesName && matchesStatus;
  }), [busca, data.alunosList, filtroStatus]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openCreate = () => {
    setEditingAlunoId(null);
    setFormOpen(true);
  };
  const openEdit = (aluno: Aluno) => {
    setEditingAlunoId(aluno.id);
    setSelectedAlunoId(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values: AlunoFormValues) => {
    const patch = fromFormToAlunoPatch(values);
    const result = editingAluno
      ? await data.updateAluno({ ...editingAluno, ...patch, turmaIds: patch.turmaIds || [] })
      : await data.addAluno({
          ...patch,
          id: `a${Date.now()}`,
          turmaIds: patch.turmaIds || [],
          dataMatricula: new Date().toISOString().split('T')[0],
        });

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível salvar o aluno.');
      return;
    }

    toast.success(editingAluno ? 'Aluno atualizado com sucesso.' : 'Aluno cadastrado com sucesso.');
    haptic('success');
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PullToRefreshIndicator distance={pullDistance} threshold={threshold} refreshing={refreshing} />
      <PageHeader
        title="Alunos"
        subtitle={`${data.alunosList.length} alunos cadastrados`}
        actions={(
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Novo aluno
          </Button>
        )}
      />

      <AlunosListPanel
        alunos={paginated}
        busca={busca}
        filtroStatus={filtroStatus}
        page={page}
        totalPages={totalPages}
        onBuscaChange={(value) => { setBusca(value); setPage(1); }}
        onStatusChange={(value) => { setFiltroStatus(value); setPage(1); }}
        onPageChange={(next) => setPage(Math.min(totalPages, Math.max(1, next)))}
        onSelect={(aluno) => setSelectedAlunoId(aluno.id)}
        onEdit={openEdit}
        onCreate={openCreate}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingAluno ? 'Editar aluno' : 'Novo aluno'}</DialogTitle>
            <DialogDescription>
              {editingAluno ? 'Atualize os dados do aluno.' : 'Preencha os dados para cadastrar um novo aluno.'}
            </DialogDescription>
          </DialogHeader>
          <AlunoForm
            aluno={editingAluno}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            responsaveis={data.responsaveisList.map((responsavel) => ({ id: responsavel.id, nome: responsavel.nome }))}
          />
        </DialogContent>
      </Dialog>

      <AlunoDetailsSheet
        aluno={selectedAluno}
        cobrancas={data.cobrancasList}
        graduacoes={data.graduacoesAlunosList}
        responsaveis={data.responsaveisList}
        sessoes={data.sessoesList}
        turmas={data.turmasList}
        onClose={() => setSelectedAlunoId(null)}
        onEdit={openEdit}
        onAddTurma={data.addAlunoToTurma}
        onRemoveTurma={data.removeAlunoFromTurma}
      />
    </div>
  );
}
