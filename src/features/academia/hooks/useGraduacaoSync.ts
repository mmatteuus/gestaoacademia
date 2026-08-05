import { useCallback, useRef } from 'react';
import { useGraduacoesAlunos } from '@/services/queries';
import type { Aluno, GraduacaoAluno } from '@/types';
import type { ActionResult } from '../academia.types';
import {
  DEFAULT_AULAS_GRADUACAO,
  FAIXAS_ORDEM,
  nextFaixaFrom,
} from '../academia.utils';

type GraduacoesQuery = ReturnType<typeof useGraduacoesAlunos>;

interface UseGraduacaoSyncOptions {
  alunosList: Aluno[];
  graduacoesList: GraduacaoAluno[];
  graduacoes: GraduacoesQuery;
}

export function useGraduacaoSync({
  alunosList,
  graduacoesList,
  graduacoes,
}: UseGraduacaoSyncOptions) {
  const pendingIds = useRef<Set<string>>(new Set());

  const ensureGraduacaoForAluno = useCallback((aluno: Aluno) => {
    const graduacaoId = `grad-${aluno.id}`;
    const exists = graduacoesList.some((graduacao) => graduacao.alunoId === aluno.id);
    if (exists || pendingIds.current.has(graduacaoId)) return 0;

    const faixaAtual = aluno.faixaAtual || FAIXAS_ORDEM[0];
    pendingIds.current.add(graduacaoId);
    graduacoes.create.mutate(
      {
        id: graduacaoId,
        alunoId: aluno.id,
        faixaAtual,
        proximaFaixa: nextFaixaFrom(faixaAtual),
        aulasRealizadas: 0,
        aulasNecessarias: DEFAULT_AULAS_GRADUACAO,
        status: 'nao-elegivel',
      },
      { onSettled: () => pendingIds.current.delete(graduacaoId) },
    );

    return 1;
  }, [graduacoes.create, graduacoesList]);

  const syncGraduacoesParaTodos = useCallback((): ActionResult<{ created: number }> => {
    const created = alunosList.reduce(
      (total, aluno) => total + ensureGraduacaoForAluno(aluno),
      0,
    );
    return { ok: true, data: { created } };
  }, [alunosList, ensureGraduacaoForAluno]);

  return { ensureGraduacaoForAluno, syncGraduacoesParaTodos };
}
