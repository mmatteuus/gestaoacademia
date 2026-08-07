import { useMemo } from 'react';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { isMinor } from '../alunos.utils';

export function useAlunoDetails(alunoId: string | null) {
  const {
    alunosList,
    turmasList,
    sessoesList,
    cobrancasList,
    graduacoesAlunosList,
    responsaveisList,
    addAlunoToTurma,
    removeAlunoFromTurma,
  } = useAcademiaData();

  const aluno = alunoId ? alunosList.find((item) => item.id === alunoId) ?? null : null;

  const cobrancas = useMemo(() => {
    if (!aluno) return [];
    return cobrancasList
      .filter((cobranca) => cobranca.alunoId === aluno.id)
      .sort((a, b) => (a.dataVencimento > b.dataVencimento ? -1 : 1));
  }, [aluno, cobrancasList]);

  const mensalidades = useMemo(
    () => cobrancas.filter((cobranca) => cobranca.tipo === 'mensalidade'),
    [cobrancas],
  );
  const mensalidadePendente = mensalidades.find((cobranca) => cobranca.status !== 'paga');
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

  const historicoFrequencia = useMemo(() => {
    if (!aluno) return [];

    return sessoesList
      .map((sessao) => {
        const presenca = sessao.presencas.find((item) => item.alunoId === aluno.id);
        if (!presenca) return null;

        return {
          sessaoId: sessao.id,
          data: sessao.data,
          turmaNome: turmasList.find((turma) => turma.id === sessao.turmaId)?.nome || 'Turma não encontrada',
          presente: presenca.presente,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => (a.data > b.data ? -1 : 1));
  }, [aluno, sessoesList, turmasList]);

  const totalAulas = historicoFrequencia.length;
  const totalPresencas = historicoFrequencia.filter((registro) => registro.presente).length;
  const taxaPresenca = totalAulas === 0 ? 0 : Math.round((totalPresencas / totalAulas) * 100);
  const percentualGraduacao = graduacao
    ? Math.round((graduacao.aulasRealizadas / Math.max(1, graduacao.aulasNecessarias)) * 100)
    : 0;

  return {
    aluno,
    cobrancas,
    mensalidades,
    mensalidadePendente,
    graduacao,
    responsavel,
    showResponsavel,
    turmasDoAluno,
    turmasDisponiveis,
    historicoFrequencia,
    totalAulas,
    totalPresencas,
    taxaPresenca,
    percentualGraduacao,
    addAlunoToTurma,
    removeAlunoFromTurma,
  };
}

export type AlunoDetails = ReturnType<typeof useAlunoDetails>;
