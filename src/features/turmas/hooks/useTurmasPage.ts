import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import type { Turma } from '@/types';
import type { TurmaFormValues } from '@/features/turmas/types/turma.types';

export function useTurmasPage() {
  const {
    turmasList,
    alunosList,
    addTurma,
    updateTurma,
    addAlunoToTurma,
    removeAlunoFromTurma,
  } = useAcademiaData();

  const [formOpen, setFormOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [editingTurmaId, setEditingTurmaId] = useState<string | null>(null);
  const [manageTurmaId, setManageTurmaId] = useState<string | null>(null);

  const editingTurma = editingTurmaId
    ? turmasList.find((turma) => turma.id === editingTurmaId)
    : undefined;

  const manageTurma = manageTurmaId
    ? turmasList.find((turma) => turma.id === manageTurmaId) ?? null
    : null;

  const alunosDaTurma = useMemo(() => {
    if (!manageTurma) return [];
    return alunosList.filter((aluno) => manageTurma.alunoIds.includes(aluno.id));
  }, [manageTurma, alunosList]);

  const alunosDisponiveis = useMemo(() => {
    if (!manageTurma) return [];
    return alunosList.filter((aluno) => !manageTurma.alunoIds.includes(aluno.id));
  }, [manageTurma, alunosList]);

  function openCreateForm() {
    setEditingTurmaId(null);
    setFormOpen(true);
  }

  function openEditForm(turma: Turma) {
    setEditingTurmaId(turma.id);
    setFormOpen(true);
  }

  function openManageDialog(turma: Turma) {
    setManageTurmaId(turma.id);
    setManageOpen(true);
  }

  async function submitTurma(data: TurmaFormValues) {
    if (editingTurma) {
      const result = await updateTurma({ ...editingTurma, ...data });

      if (!result.ok) {
        toast.error(result.message || 'Não foi possível atualizar a turma.');
        return;
      }

      toast.success('Turma atualizada com sucesso');
      setFormOpen(false);
      return;
    }

    const newTurma: Turma = {
      ...data,
      id: `t${Date.now()}`,
      alunoIds: [],
    };

    const result = await addTurma(newTurma);

    if (!result.ok) {
      toast.error(result.message || 'Falha ao criar turma.');
      return;
    }

    toast.success('Turma criada com sucesso');
    setFormOpen(false);
  }

  function addAluno(alunoId: string) {
    if (!manageTurma) return;

    const result = addAlunoToTurma(alunoId, manageTurma.id);

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível adicionar o aluno.');
      return;
    }

    const aluno = alunosList.find((item) => item.id === alunoId);
    toast.success(`${aluno?.nome || 'Aluno'} adicionado à turma.`);
  }

  function removeAluno(alunoId: string) {
    if (!manageTurma) return;

    const result = removeAlunoFromTurma(alunoId, manageTurma.id);

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível remover o aluno.');
      return;
    }

    const aluno = alunosList.find((item) => item.id === alunoId);
    toast.success(`${aluno?.nome || 'Aluno'} removido da turma.`);
  }

  return {
    turmasList,
    alunosList,
    formOpen,
    setFormOpen,
    manageOpen,
    setManageOpen,
    editingTurma,
    manageTurma,
    alunosDaTurma,
    alunosDisponiveis,
    openCreateForm,
    openEditForm,
    openManageDialog,
    submitTurma,
    addAluno,
    removeAluno,
  };
}
