import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Pencil, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { PullToRefreshIndicator } from '@/components/shared/PullToRefreshIndicator';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlunoForm } from '@/components/forms/AlunoForm';
import { AlunoDetailsSheet } from '@/features/alunos/components/AlunoDetailsSheet';
import { fromFormToAlunoPatch } from '@/features/alunos/adapters/alunos.adapter';
import type { AlunoFormValues } from '@/features/alunos/types/aluno.types';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { haptic } from '@/lib/haptics';
import type { Aluno, AlunoStatus } from '@/types';

const statusFilter: { label: string; value: AlunoStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
];

const PER_PAGE = 6;

export default function AlunosPage() {
  const { alunosList, addAluno, updateAluno, responsaveisList } = useAcademiaData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAlunoId, setEditingAlunoId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const { pullDistance, refreshing, threshold } = usePullToRefresh(async () => {
    await queryClient.invalidateQueries();
  });

  const editingAluno = editingAlunoId
    ? alunosList.find((aluno) => aluno.id === editingAlunoId)
    : undefined;

  const filtered = alunosList.filter((aluno) => {
    const matchesSearch = aluno.nome.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === 'todos' || aluno.status === filtroStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCreate = () => {
    setEditingAlunoId(null);
    setFormOpen(true);
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAlunoId(aluno.id);
    setFormOpen(true);
    setSelectedAlunoId(null);
  };

  const handleFormSubmit = async (values: AlunoFormValues) => {
    const patch = fromFormToAlunoPatch(values);

    if (editingAluno) {
      const result = await updateAluno({ ...editingAluno, ...patch, turmaIds: patch.turmaIds || [] });
      if (!result.ok) {
        toast.error(result.message || 'Falha ao atualizar aluno.');
        return;
      }
      toast.success('Aluno atualizado com sucesso.');
    } else {
      const newAluno: Aluno = {
        ...patch,
        id: `a${Date.now()}`,
        turmaIds: patch.turmaIds || [],
        dataMatricula: new Date().toISOString().split('T')[0],
      };
      const result = await addAluno(newAluno);
      if (!result.ok) {
        toast.error(result.message || 'Falha ao cadastrar aluno.');
        return;
      }
      toast.success('Aluno cadastrado com sucesso.');
    }

    haptic('success');
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PullToRefreshIndicator distance={pullDistance} threshold={threshold} refreshing={refreshing} />
      <PageHeader
        title="Alunos"
        subtitle={`${alunosList.length} alunos cadastrados`}
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Novo aluno
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={busca}
            onChange={(event) => {
              setBusca(event.target.value);
              setPage(1);
            }}
            className="h-9 bg-secondary/50 pl-9 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-1.5">
          {statusFilter.map((statusItem) => (
            <Button
              key={statusItem.value}
              variant={filtroStatus === statusItem.value ? 'default' : 'secondary'}
              size="sm"
              className="h-8 justify-center rounded-full px-3 text-[11px] sm:text-xs"
              onClick={() => {
                setFiltroStatus(statusItem.value);
                setPage(1);
              }}
            >
              {statusItem.label}
            </Button>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          title="Nenhum aluno encontrado"
          description="Ajuste os filtros ou cadastre um novo aluno."
          action={{ label: 'Cadastrar aluno', onClick: handleCreate }}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((aluno) => (
            <div
              key={aluno.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedAlunoId(aluno.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedAlunoId(aluno.id);
                }
              }}
              aria-label={`Abrir ficha de ${aluno.nome}`}
              className="cursor-pointer rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{aluno.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {aluno.categoria || 'Sem categoria'} • {aluno.faixaAtual || 'Sem faixa'}
                  </p>
                </div>
                <StatusBadge status={aluno.status} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>{aluno.telefone || 'Sem telefone'}</p>
                <p>{aluno.email || 'Sem e-mail'}</p>
                <p>{aluno.turmaIds.length} turma(s)</p>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEdit(aluno);
                  }}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" size="sm" className="h-8" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">Página {page} de {totalPages}</span>
        <Button variant="secondary" size="sm" className="h-8" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

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
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
            responsaveis={responsaveisList.map((responsavel) => ({ id: responsavel.id, nome: responsavel.nome }))}
          />
        </DialogContent>
      </Dialog>

      <AlunoDetailsSheet
        alunoId={selectedAlunoId}
        onClose={() => setSelectedAlunoId(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
