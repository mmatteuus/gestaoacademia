import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { alunos as alunosMock, turmas as turmasMock, sessoesAula as sessoesMock, cobrancas as cobrancasMock, graduacoesAlunos as graduacoesMock, responsaveis as responsaveisMock } from '@/services/mocks/data';
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
  const [alunosList, setAlunosList] = useState<Aluno[]>(alunosMock);
  const [turmasList, setTurmasList] = useState<Turma[]>(turmasMock);
  const [sessoesList, setSessoesList] = useState<SessaoAula[]>(sessoesMock);
  const [cobrancasList] = useState<Cobranca[]>(cobrancasMock);
  const [graduacoesAlunosList] = useState<GraduacaoAluno[]>(graduacoesMock);
  const [responsaveisList] = useState<Responsavel[]>(responsaveisMock);

  const syncTurmasForAluno = (alunoId: string, turmaIds: string[]) => {
    setTurmasList((prev) =>
      prev.map((turma) => {
        const shouldContainAluno = turmaIds.includes(turma.id);
        const alreadyContainsAluno = turma.alunoIds.includes(alunoId);

        if (shouldContainAluno && !alreadyContainsAluno) {
          return { ...turma, alunoIds: [...turma.alunoIds, alunoId] };
        }

        if (!shouldContainAluno && alreadyContainsAluno) {
          return { ...turma, alunoIds: turma.alunoIds.filter((id) => id !== alunoId) };
        }

        return turma;
      })
    );
  };

  const addAluno = (aluno: Aluno) => {
    setAlunosList((prev) => [...prev, aluno]);
    syncTurmasForAluno(aluno.id, aluno.turmaIds);
  };

  const updateAluno = (aluno: Aluno) => {
    setAlunosList((prev) => prev.map((item) => (item.id === aluno.id ? aluno : item)));
    syncTurmasForAluno(aluno.id, aluno.turmaIds);
  };

  const addTurma = (turma: Turma) => {
    setTurmasList((prev) => [...prev, turma]);
  };

  const updateTurma = (turmaAtualizada: Turma): ActionResult => {
    const turmaAnterior = turmasList.find((turma) => turma.id === turmaAtualizada.id);
    if (!turmaAnterior) {
      return { ok: false, message: 'Turma não encontrada.' };
    }

    if (turmaAtualizada.capacidade < turmaAtualizada.alunoIds.length) {
      return { ok: false, message: 'A capacidade não pode ser menor do que a quantidade atual de alunos.' };
    }

    setTurmasList((prev) => prev.map((turma) => (turma.id === turmaAtualizada.id ? turmaAtualizada : turma)));
    setAlunosList((prev) =>
      prev.map((aluno) => {
        const shouldContainTurma = turmaAtualizada.alunoIds.includes(aluno.id);
        const alreadyContainsTurma = aluno.turmaIds.includes(turmaAtualizada.id);

        if (shouldContainTurma && !alreadyContainsTurma) {
          return { ...aluno, turmaIds: [...aluno.turmaIds, turmaAtualizada.id] };
        }

        if (!shouldContainTurma && alreadyContainsTurma) {
          return { ...aluno, turmaIds: aluno.turmaIds.filter((id) => id !== turmaAtualizada.id) };
        }

        return aluno;
      })
    );

    return { ok: true };
  };

  const addAlunoToTurma = (alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);

    if (!turma || !aluno) {
      return { ok: false, message: 'Aluno ou turma não encontrado.' };
    }

    if (turma.alunoIds.includes(alunoId)) {
      return { ok: false, message: 'Este aluno já está vinculado à turma.' };
    }

    if (turma.alunoIds.length >= turma.capacidade) {
      return { ok: false, message: 'A turma já atingiu a capacidade máxima.' };
    }

    setTurmasList((prev) =>
      prev.map((item) =>
        item.id === turmaId ? { ...item, alunoIds: [...item.alunoIds, alunoId] } : item
      )
    );

    setAlunosList((prev) =>
      prev.map((item) =>
        item.id === alunoId ? { ...item, turmaIds: [...item.turmaIds, turmaId] } : item
      )
    );

    return { ok: true };
  };

  const removeAlunoFromTurma = (alunoId: string, turmaId: string): ActionResult => {
    const turma = turmasList.find((item) => item.id === turmaId);
    const aluno = alunosList.find((item) => item.id === alunoId);

    if (!turma || !aluno) {
      return { ok: false, message: 'Aluno ou turma não encontrado.' };
    }

    if (!turma.alunoIds.includes(alunoId)) {
      return { ok: false, message: 'Este aluno não está vinculado à turma.' };
    }

    setTurmasList((prev) =>
      prev.map((item) =>
        item.id === turmaId ? { ...item, alunoIds: item.alunoIds.filter((id) => id !== alunoId) } : item
      )
    );

    setAlunosList((prev) =>
      prev.map((item) =>
        item.id === alunoId ? { ...item, turmaIds: item.turmaIds.filter((id) => id !== turmaId) } : item
      )
    );

    return { ok: true };
  };

  const addSessao = (sessao: SessaoAula): ActionResult => {
    const existeSessaoMesmoDia = sessoesList.some(
      (item) => item.turmaId === sessao.turmaId && item.data === sessao.data
    );

    if (existeSessaoMesmoDia) {
      return { ok: false, message: 'Já existe uma sessão lançada para esta turma nesta data.' };
    }

    setSessoesList((prev) => [sessao, ...prev]);
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
      addAluno,
      updateAluno,
      addTurma,
      updateTurma,
      addAlunoToTurma,
      removeAlunoFromTurma,
      addSessao,
    }),
    [alunosList, turmasList, sessoesList, cobrancasList, graduacoesAlunosList, responsaveisList]
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
