import { useCallback } from 'react';
import { useAlunos, useTurmas } from '@/services/queries';
import type { Aluno, Turma } from '@/types';
import type { ActionResult } from '../academia.types';

type AlunosQuery = ReturnType<typeof useAlunos>;
type TurmasQuery = ReturnType<typeof useTurmas>;

interface UseTurmaActionsOptions {
  alunosList: Aluno[];
  turmasList: Turma[];
  alunos: AlunosQuery;
  turmas: TurmasQuery;
}

export function useTurmaActions({
  alunosList,
  turmasList,
  alunos,
  turmas,
}: UseTurmaActionsOptions) {
  const addTurma = useCallback(async (turma: Turma): Promise<ActionResult> => {
    try {
      await turmas.create.mutateAsync(turma);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Não foi possível criar a turma.' };
    }
  }, [turmas.create]);

  const updateTurma = useCallback(async (updated: Turma): Promise<ActionResult> => {
    const previous = turmasList.find((turma) => turma.id === updated.id);
    if (!previous) return { ok: false, message: 'Turma não encontrada.' };
    if (updated.capacidade < updated.alunoIds.length) {
      return {
        ok: false,
        message: 'A capacidade não pode ser menor do que a quantidade atual de alunos.',
      };
    }

    try {
      await turmas.update.mutateAsync({ id: updated.id, data: updated });
    } catch {
      return { ok: false, message: 'Não foi possível atualizar a turma.' };
    }

    for (const aluno of alunosList) {
      const shouldContain = updated.alunoIds.includes(aluno.id);
      const alreadyContains = aluno.turmaIds.includes(updated.id);

      if (shouldContain && !alreadyContains) {
        alunos.update.mutate({
          id: aluno.id,
          data: { turmaIds: [...aluno.turmaIds, updated.id] },
        });
      } else if (!shouldContain && alreadyContains) {
        alunos.update.mutate({
          id: aluno.id,
          data: { turmaIds: aluno.turmaIds.filter((id) => id !== updated.id) },
        });
      }
    }

    return { ok: true };
  }, [alunos.update, alunosList, turmas.update, turmasList]);

  const addAlunoToTurma = useCallback((alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);
    if (!turma || !aluno) return { ok: false, message: 'Aluno ou turma não encontrado.' };
    if (turma.alunoIds.includes(alunoId)) {
      return { ok: false, message: 'Este aluno já está vinculado à turma.' };
    }
    if (turma.alunoIds.length >= turma.capacidade) {
      return { ok: false, message: 'A turma já atingiu a capacidade máxima.' };
    }

    turmas.update.mutate({ id: turmaId, data: { alunoIds: [...turma.alunoIds, alunoId] } });
    alunos.update.mutate({ id: alunoId, data: { turmaIds: [...aluno.turmaIds, turmaId] } });
    return { ok: true };
  }, [alunos.update, alunosList, turmas.update, turmasList]);

  const removeAlunoFromTurma = useCallback((alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);
    if (!turma || !aluno) return { ok: false, message: 'Aluno ou turma não encontrado.' };
    if (!turma.alunoIds.includes(alunoId)) {
      return { ok: false, message: 'Este aluno não está vinculado à turma.' };
    }

    turmas.update.mutate({
      id: turmaId,
      data: { alunoIds: turma.alunoIds.filter((id) => id !== alunoId) },
    });
    alunos.update.mutate({
      id: alunoId,
      data: { turmaIds: aluno.turmaIds.filter((id) => id !== turmaId) },
    });
    return { ok: true };
  }, [alunos.update, alunosList, turmas.update, turmasList]);

  return { addTurma, updateTurma, addAlunoToTurma, removeAlunoFromTurma };
}
