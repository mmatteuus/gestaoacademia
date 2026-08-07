import { useMemo } from 'react';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import type { AlunoAttendanceRecord } from '../types/aluno-details.types';
import { isMinor } from '../utils/aluno-details.utils';

export function useAlunoDetails(alunoId: string | null) {
  const {
    alunosList,
    turmasList,
    sessoesList,
    addAlunoToTurma,
    removeAlunoFromTurma,
    cobrancasList,
    graduacoesAlunosList,
    responsaveisList,
  } = useAcademiaData();

  const aluno = alunoId
    ? alunosList.find((item) => item.id === alunoId) ?? null
    : null;

  const cobrancas = useMemo(() => {
    if (!aluno) return [];

    return cobrancasList
      .filter((cobranca) => cobranca.alunoId === aluno.id)
      .sort((left, right) => (left.dataVencimento > right.dataVencimento ? -1 : 1));
  }, [aluno, cobrancasList]);

  const mensalidades = useMemo(
    () => cobrancas.filter((cobranca) => cobranca.tipo === 'mensalidade'),
    [cobrancas],
  );

  const mensalidadePendente = useMemo(
    () => mensalidades.find((cobranca) => cobranca.status !== 'paga'),
    [mensalidades],
  );

  const graduacao = aluno
    ? graduacoesAlunosList.find((item) => item.alunoId === aluno.id) ?? null
    : null;

  const responsavel = aluno?.responsavelId
    ? responsaveisList.find((item) => item.id === aluno.responsavelId) ?? null
    : null;

  const showResponsavel = Boolean(responsavel) || Boolean(aluno && isMinor(aluno.dataNascimento));

  const turmasDoAluno = useMemo(() => {
    if (!aluno) return [];
    return turmasList.filter((turma) => aluno.turmaIds.includes(turma.id));
  }, [aluno, turmasList]);

  const turmasDisponiveis = useMemo(() => {
    if (!aluno) return [];
    return turmasList.filter((turma) => !aluno.turmaIds.includes(turma.id));
  }, [aluno, turmasList]);

  const percentualGraduacao = graduacao
    ? Math.round((graduacao.aulasRealizadas / Math.max(1, graduacao.aulasNecessarias)) * 100)
    : 0;

  const historicoFrequencia = useMemo<AlunoAttendanceRecord[]>(() => {
    if (!aluno) return [];

    return sessoesList
      .map((sessao) => {
        const presenca = sessao.presencas.find((item) => item.alunoId === aluno.id);
        if (!presenca) return null;

        return {
          sessaoId: sessao.id,
          data: sessao.data,
          turmaNome:
            turmasList.find((turma) => turma.id === sessao.turmaId)?.nome ||
            'Turma não encontrada',
          presente: presenca.presente,
        };
      })
      .filter((item): item is AlunoAttendanceRecord => item !== null)
      .sort((left, right) => (left.data > right.data ? -1 : 1));
  }, [aluno, sessoesList, turmasList]);

  const totalAulas = historicoFrequencia.length;
  const totalPresencas = historicoFrequencia.filter((registro) => registro.presente).length;
  const taxaPresenca = totalAulas === 0 ? 0 : Math.round((totalPresencas / totalAulas) * 100);

  const addToTurma = (turmaId: string) => {
    if (!aluno) return;

    const result = addAlunoToTurma(aluno.id, turmaId);
    if (result.ok) {
      toast.success('Aluno adicionado à turma.');
      return;
    }

    toast.error(result.message || 'Falha ao vincular turma.');
  };

  const removeFromTurma = (turmaId: string) => {
    if (!aluno) return;
    removeAlunoFromTurma(aluno.id, turmaId);
  };

  return {
    aluno,
    responsavel,
    showResponsavel,
    turmasDoAluno,
    turmasDisponiveis,
    addToTurma,
    removeFromTurma,
    cobrancas,
    mensalidades,
    mensalidadePendente,
    historicoFrequencia,
    totalAulas,
    totalPresencas,
    taxaPresenca,
    graduacao,
    percentualGraduacao,
  };
}
