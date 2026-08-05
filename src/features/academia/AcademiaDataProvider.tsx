import { useEffect, useRef, type ReactNode } from 'react';
import {
  useAlunos,
  useCobrancas,
  useGraduacoesAlunos,
  useResponsaveis,
  useSessoesAula,
  useTurmas,
} from '@/services/queries';
import { AcademiaDataContext } from './academia.context';
import type { AcademiaDataContextValue } from './academia.types';
import { useAlunoActions } from './hooks/useAlunoActions';
import { useGraduacaoSync } from './hooks/useGraduacaoSync';
import { useMensalidadeSync } from './hooks/useMensalidadeSync';
import { useSessaoActions } from './hooks/useSessaoActions';
import { useTurmaActions } from './hooks/useTurmaActions';

export function AcademiaDataProvider({ children }: { children: ReactNode }) {
  const alunos = useAlunos();
  const turmas = useTurmas();
  const sessoes = useSessoesAula();
  const cobrancas = useCobrancas();
  const graduacoes = useGraduacoesAlunos();
  const responsaveis = useResponsaveis();
  const didBootstrapSync = useRef(false);

  const alunosList = alunos.list.data ?? [];
  const turmasList = turmas.list.data ?? [];
  const sessoesList = sessoes.list.data ?? [];
  const cobrancasList = cobrancas.list.data ?? [];
  const graduacoesAlunosList = graduacoes.list.data ?? [];
  const responsaveisList = responsaveis.list.data ?? [];
  const isLoading = [alunos, turmas, sessoes, cobrancas, graduacoes, responsaveis]
    .some((query) => query.list.isLoading);

  const {
    ensureMensalidadesForAluno,
    syncMensalidadesParaTodos,
  } = useMensalidadeSync({ alunosList, cobrancasList, cobrancas });
  const {
    ensureGraduacaoForAluno,
    syncGraduacoesParaTodos,
  } = useGraduacaoSync({
    alunosList,
    graduacoesList: graduacoesAlunosList,
    graduacoes,
  });
  const alunoActions = useAlunoActions({
    turmasList,
    alunos,
    turmas,
    ensureMensalidades: ensureMensalidadesForAluno,
    ensureGraduacao: ensureGraduacaoForAluno,
  });
  const turmaActions = useTurmaActions({ alunosList, turmasList, alunos, turmas });
  const sessaoActions = useSessaoActions({ sessoesList, sessoes });

  useEffect(() => {
    if (isLoading || didBootstrapSync.current) return;

    const timer = window.setTimeout(() => {
      if (didBootstrapSync.current) return;
      didBootstrapSync.current = true;
      syncMensalidadesParaTodos();
      syncGraduacoesParaTodos();
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isLoading, syncGraduacoesParaTodos, syncMensalidadesParaTodos]);

  const value: AcademiaDataContextValue = {
    alunosList,
    turmasList,
    sessoesList,
    cobrancasList,
    graduacoesAlunosList,
    responsaveisList,
    isLoading,
    ...alunoActions,
    ...turmaActions,
    ...sessaoActions,
    syncMensalidadesParaTodos,
    syncGraduacoesParaTodos,
  };

  return <AcademiaDataContext.Provider value={value}>{children}</AcademiaDataContext.Provider>;
}

export { useAcademiaData } from './academia.context';
