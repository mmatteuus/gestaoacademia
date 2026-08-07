import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { haptic } from '@/lib/haptics';
import type { Aluno, AlunoStatus } from '@/types';
import type { AlunoFormValues } from '../types/aluno.types';
import { fromFormToAlunoPatch } from '../adapters/alunos.adapter';

const PER_PAGE = 6;

export function useAlunosPage() {
  const { alunosList, addAluno, updateAluno, responsaveisList } = useAcademiaData();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<AlunoStatus | 'todos'>('todos');
  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAlunoId, setEditingAlunoId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const refreshState = usePullToRefresh(async () => {
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

  const updateSearch = (value: string) => {
    setBusca(value);
    setPage(1);
  };

  const updateStatus = (value: AlunoStatus | 'todos') => {
    setFiltroStatus(value);
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingAlunoId(null);
    setFormOpen(true);
  };

  const openEditForm = (aluno: Aluno) => {
    setEditingAlunoId(aluno.id);
    setFormOpen(true);
    setSelectedAlunoId(null);
  };

  const submitForm = async (values: AlunoFormValues) => {
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

  return {
    alunosList,
    responsaveisList,
    busca,
    filtroStatus,
    paginated,
    page,
    totalPages,
    selectedAlunoId,
    formOpen,
    editingAluno,
    refreshState,
    updateSearch,
    updateStatus,
    openCreateForm,
    openEditForm,
    openAluno: setSelectedAlunoId,
    closeAluno: () => setSelectedAlunoId(null),
    setFormOpen,
    submitForm,
    previousPage: () => setPage((current) => Math.max(1, current - 1)),
    nextPage: () => setPage((current) => Math.min(totalPages, current + 1)),
  };
}
