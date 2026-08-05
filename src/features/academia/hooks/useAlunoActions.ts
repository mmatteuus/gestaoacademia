import { useCallback } from 'react';
import { useAlunos, useTurmas } from '@/services/queries';
import type { Aluno, Turma } from '@/types';
import type { ActionResult } from '../academia.types';

type AlunosQuery = ReturnType<typeof useAlunos>;
type TurmasQuery = ReturnType<typeof useTurmas>;

interface UseAlunoActionsOptions {
  turmasList: Turma[];
  alunos: AlunosQuery;
  turmas: TurmasQuery;
  ensureMensalidades: (aluno: Aluno) => number;
  ensureGraduacao: (aluno: Aluno) => number;
}

export function useAlunoActions({
  turmasList,
  alunos,
  turmas,
  ensureMensalidades,
  ensureGraduacao,
}: UseAlunoActionsOptions) {
  const syncTurmasForAluno = useCallback(async (alunoId: string, turmaIds: string[]) => {
    const tasks = turmasList.flatMap((turma) => {
      const shouldContain = turmaIds.includes(turma.id);
      const alreadyContains = turma.alunoIds.includes(alunoId);

      if (shouldContain && !alreadyContains) {
        return turmas.update.mutateAsync({
          id: turma.id,
          data: { alunoIds: [...turma.alunoIds, alunoId] },
        });
      }

      if (!shouldContain && alreadyContains) {
        return turmas.update.mutateAsync({
          id: turma.id,
          data: { alunoIds: turma.alunoIds.filter((id) => id !== alunoId) },
        });
      }

      return [];
    });

    await Promise.allSettled(tasks);
  }, [turmas.update, turmasList]);

  const addAluno = useCallback(async (aluno: Aluno): Promise<ActionResult> => {
    try {
      await alunos.create.mutateAsync(aluno);
      await syncTurmasForAluno(aluno.id, aluno.turmaIds);
      ensureMensalidades(aluno);
      ensureGraduacao(aluno);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Não foi possível cadastrar o aluno.' };
    }
  }, [alunos.create, ensureGraduacao, ensureMensalidades, syncTurmasForAluno]);

  const updateAluno = useCallback(async (aluno: Aluno): Promise<ActionResult> => {
    try {
      await alunos.update.mutateAsync({ id: aluno.id, data: aluno });
      await syncTurmasForAluno(aluno.id, aluno.turmaIds);
      ensureMensalidades(aluno);
      ensureGraduacao(aluno);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Não foi possível atualizar o aluno.' };
    }
  }, [alunos.update, ensureGraduacao, ensureMensalidades, syncTurmasForAluno]);

  return { addAluno, updateAluno };
}
