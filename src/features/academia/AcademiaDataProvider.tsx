import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  useAlunos,
  useTurmas,
  useSessoesAula,
  useCobrancas,
  useGraduacoesAlunos,
  useResponsaveis,
} from '@/services/queries';
import type { Aluno, SessaoAula, Turma, Cobranca, GraduacaoAluno, Responsavel } from '@/types';

interface ActionResult {
  ok: boolean;
  message?: string;
}

interface AcademiaDataContextValue {
  alunosList: Aluno[];
  turmasList: Turma[];
  sessoesList: SessaoAula[];
  cobrancasList: Cobranca[];
  graduacoesAlunosList: GraduacaoAluno[];
  responsaveisList: Responsavel[];
  isLoading: boolean;
  addAluno: (aluno: Aluno) => void;
  updateAluno: (aluno: Aluno) => void;
  addTurma: (turma: Turma) => void;
  updateTurma: (turma: Turma) => ActionResult;
  addAlunoToTurma: (alunoId: string, turmaId: string) => ActionResult;
  removeAlunoFromTurma: (alunoId: string, turmaId: string) => ActionResult;
  addSessao: (sessao: SessaoAula) => ActionResult;
}

const AcademiaDataContext = createContext<AcademiaDataContextValue | undefined>(undefined);

export function AcademiaDataProvider({ children }: { children: ReactNode }) {
  const alunos = useAlunos();
  const turmas = useTurmas();
  const sessoes = useSessoesAula();
  const cobrancas = useCobrancas();
  const graduacoesAlunos = useGraduacoesAlunos();
  const responsaveis = useResponsaveis();

  const alunosList = alunos.list.data ?? [];
  const turmasList = turmas.list.data ?? [];
  const sessoesList = sessoes.list.data ?? [];
  const cobrancasList = cobrancas.list.data ?? [];
  const graduacoesAlunosList = graduacoesAlunos.list.data ?? [];
  const responsaveisList = responsaveis.list.data ?? [];

  const isLoading =
    alunos.list.isLoading || turmas.list.isLoading || sessoes.list.isLoading;

  /** Propaga em turmas os alunoIds para refletir o turmaIds do aluno. */
  const syncTurmasForAluno = (alunoId: string, turmaIds: string[]) => {
    for (const turma of turmasList) {
      const shouldContain = turmaIds.includes(turma.id);
      const alreadyContains = turma.alunoIds.includes(alunoId);
      if (shouldContain && !alreadyContains) {
        turmas.update.mutate({
          id: turma.id,
          data: { alunoIds: [...turma.alunoIds, alunoId] },
        });
      } else if (!shouldContain && alreadyContains) {
        turmas.update.mutate({
          id: turma.id,
          data: { alunoIds: turma.alunoIds.filter((id) => id !== alunoId) },
        });
      }
    }
  };

  const addAluno = (aluno: Aluno) => {
    alunos.create.mutate(aluno, {
      onSuccess: () => syncTurmasForAluno(aluno.id, aluno.turmaIds),
    });
  };

  const updateAluno = (aluno: Aluno) => {
    alunos.update.mutate({ id: aluno.id, data: aluno });
    syncTurmasForAluno(aluno.id, aluno.turmaIds);
  };

  const addTurma = (turma: Turma) => {
    turmas.create.mutate(turma);
  };

  const updateTurma = (turmaAtualizada: Turma): ActionResult => {
    const turmaAnterior = turmasList.find((turma) => turma.id === turmaAtualizada.id);
    if (!turmaAnterior) return { ok: false, message: 'Turma não encontrada.' };

    if (turmaAtualizada.capacidade < turmaAtualizada.alunoIds.length) {
      return { ok: false, message: 'A capacidade não pode ser menor do que a quantidade atual de alunos.' };
    }

    turmas.update.mutate({ id: turmaAtualizada.id, data: turmaAtualizada });

    // Sincroniza turma_ids nos alunos impactados
    for (const aluno of alunosList) {
      const shouldContain = turmaAtualizada.alunoIds.includes(aluno.id);
      const alreadyContains = aluno.turmaIds.includes(turmaAtualizada.id);
      if (shouldContain && !alreadyContains) {
        alunos.update.mutate({
          id: aluno.id,
          data: { turmaIds: [...aluno.turmaIds, turmaAtualizada.id] },
        });
      } else if (!shouldContain && alreadyContains) {
        alunos.update.mutate({
          id: aluno.id,
          data: { turmaIds: aluno.turmaIds.filter((id) => id !== turmaAtualizada.id) },
        });
      }
    }

    return { ok: true };
  };

  const addAlunoToTurma = (alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);
    if (!turma || !aluno) return { ok: false, message: 'Aluno ou turma não encontrado.' };
    if (turma.alunoIds.includes(alunoId)) return { ok: false, message: 'Este aluno já está vinculado à turma.' };
    if (turma.alunoIds.length >= turma.capacidade) return { ok: false, message: 'A turma já atingiu a capacidade máxima.' };

    turmas.update.mutate({ id: turmaId, data: { alunoIds: [...turma.alunoIds, alunoId] } });
    alunos.update.mutate({ id: alunoId, data: { turmaIds: [...aluno.turmaIds, turmaId] } });
    return { ok: true };
  };

  const removeAlunoFromTurma = (alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);
    if (!turma || !aluno) return { ok: false, message: 'Aluno ou turma não encontrado.' };
    if (!turma.alunoIds.includes(alunoId)) return { ok: false, message: 'Este aluno não está vinculado à turma.' };

    turmas.update.mutate({
      id: turmaId,
      data: { alunoIds: turma.alunoIds.filter((id) => id !== alunoId) },
    });
    alunos.update.mutate({
      id: alunoId,
      data: { turmaIds: aluno.turmaIds.filter((id) => id !== turmaId) },
    });
    return { ok: true };
  };

  const addSessao = (sessao: SessaoAula): ActionResult => {
    const existeSessaoMesmoDia = sessoesList.some(
      (item) => item.turmaId === sessao.turmaId && item.data === sessao.data
    );
    if (existeSessaoMesmoDia) {
      return { ok: false, message: 'Já existe uma sessão lançada para esta turma nesta data.' };
    }
    sessoes.create.mutate(sessao);
    return { ok: true };
  };

  const value = useMemo<AcademiaDataContextValue>(
    () => ({
      alunosList,
      turmasList,
      sessoesList,
      cobrancasList,
      graduacoesAlunosList,
      responsaveisList,
      isLoading,
      addAluno,
      updateAluno,
      addTurma,
      updateTurma,
      addAlunoToTurma,
      removeAlunoFromTurma,
      addSessao,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alunosList, turmasList, sessoesList, cobrancasList, graduacoesAlunosList, responsaveisList, isLoading]
  );

  return <AcademiaDataContext.Provider value={value}>{children}</AcademiaDataContext.Provider>;
}

export function useAcademiaData() {
  const context = useContext(AcademiaDataContext);
  if (!context) {
    throw new Error('useAcademiaData deve ser usado dentro de AcademiaDataProvider');
  }
  return context;
}
