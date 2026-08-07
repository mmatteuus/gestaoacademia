import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptics';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { fromFormToAlunoPatch } from '@/features/alunos/adapters/alunos.adapter';
import type { AlunoFormValues } from '@/features/alunos/types/aluno.types';
import type { Aluno, AlunoStatus } from '@/types';
import { ALUNOS_PER_PAGE } from '../alunos.constants';

export function useAlunosPage() {
  const { alunosList, responsaveisList, addAluno, updateAluno } = useAcademiaData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [editingAlunoId, setEditingAlunoId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const pullToRefresh = usePullToRefresh(() => queryClient.invalidateQueries());

  const editingAluno = editingAlunoId
    ? alunosList.find((aluno) => aluno.id === editingAlunoId)
    : undefined;

  const filtered = useMemo(() => {
    const normalizedSearch = busca.trim().toLocaleLowerCase('pt-BR');
    return alunosList.filter((aluno) => {
      const matchesSearch = aluno.nome.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
      const matchesStatus = filtroStatus === 'todos' || aluno.status === filtroStatus;
      return matchesSearch && matchesStatus;
    });
  }, [alunosList, busca, filtroStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ALUNOS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ALUNOS_PER_PAGE,
    currentPage * ALUNOS_PER_PAGE,
  );

  const changeBusca = (value: string) => {
    setBusca(value);
    setPage(1);
  };

  const changeStatus = (value: AlunoStatus | 'todos') => {
    setFiltroStatus(value);
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingAlunoId(null);
    setFormOpen(true);
  };

  const openEditForm = (aluno: Aluno) => {
    setEditingAlunoId(aluno.id);
    setSelectedAlunoId(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: AlunoFormValues) => {
    const patch = fromFormToAlunoPatch(values);
    const result = editingAluno
      ? await updateAluno({ ...editingAluno, ...patch, turmaIds: patch.turmaIds || [] })
      : await addAluno({
          ...patch,
          id: `a${Date.now()}`,
          turmaIds: patch.turmaIds || [],
          dataMatricula: new Date().toISOString().split('T')[0],
        });

    if (!result.ok) {
      toast.error(
        result.message ||
          (editingAluno ? 'Falha ao atualizar aluno.' : 'Falha ao cadastrar aluno.'),
      );
      return;
    }

    toast.success(editingAluno ? 'Aluno atualizado com sucesso.' : 'Aluno cadastrado com sucesso.');
    haptic('success');
    setFormOpen(false);
  };

  return {
    alunosList,
    responsaveisList,
    busca,
    filtroStatus,
    selectedAlunoId,
    editingAluno,
    formOpen,
    page: currentPage,
    totalPages,
    paginated,
    pullToRefresh,
    changeBusca,
    changeStatus,
    setSelectedAlunoId,
    setFormOpen,
    setPage,
    openCreateForm,
    openEditForm,
    handleFormSubmit,
  };
}
