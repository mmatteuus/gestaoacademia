import { useMemo } from 'react';
import type {
  Aluno,
  Cobranca,
  GraduacaoAluno,
  Responsavel,
  SessaoAula,
  Turma,
} from '@/types';
import { isMinor } from './alunos-page.utils';

interface Options {
  aluno: Aluno | null;
  cobrancas: Cobranca[];
  graduacoes: GraduacaoAluno[];
  responsaveis: Responsavel[];
  sessoes: SessaoAula[];
  turmas: Turma[];
}

export function useAlunoDetails({
  aluno,
  cobrancas,
  graduacoes,
  responsaveis,
  sessoes,
  turmas,
}: Options) {
  const alunoCobrancasOrdenadas = useMemo(() => {
    if (!aluno) return [];
    return cobrancas
      .filter((cobranca) => cobranca.alunoId === aluno.id)
      .sort((a, b) => (a.dataVencimento > b.dataVencimento ? -1 : 1));
  }, [aluno, cobrancas]);

  const alunoMensalidades = useMemo(
    () => alunoCobrancasOrdenadas.filter((cobranca) => cobranca.tipo === 'mensalidade'),
    [alunoCobrancasOrdenadas],
  );
  const mensalidadePendente = alunoMensalidades.find((cobranca) => cobranca.status !== 'paga');
  const graduacao = aluno ? graduacoes.find((item) => item.alunoId === aluno.id) ?? null : null;
  const responsavel = aluno?.responsavelId
    ? responsaveis.find((item) => item.id === aluno.responsavelId) ?? null
    : null;
  const showResponsavel = Boolean(responsavel) || Boolean(aluno && isMinor(aluno.dataNascimento));

  const turmasDoAluno = useMemo(
    () => (aluno ? turmas.filter((turma) => aluno.turmaIds.includes(turma.id)) : []),
    [aluno, turmas],
  );
  const turmasDisponiveis = useMemo(
    () => (aluno ? turmas.filter((turma) => !aluno.turmaIds.includes(turma.id)) : []),
    [aluno, turmas],
  );

  const historicoFrequencia = useMemo(() => {
    if (!aluno) return [];
    return sessoes
      .map((sessao) => {
        const presenca = sessao.presencas.find((item) => item.alunoId === aluno.id);
        if (!presenca) return null;
        return {
          sessaoId: sessao.id,
          data: sessao.data,
          turmaNome: turmas.find((turma) => turma.id === sessao.turmaId)?.nome || 'Turma não encontrada',
          presente: presenca.presente,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => (a.data > b.data ? -1 : 1));
  }, [aluno, sessoes, turmas]);

  const totalAulas = historicoFrequencia.length;
  const totalPresencas = historicoFrequencia.filter((registro) => registro.presente).length;
  const taxaPresenca = totalAulas === 0 ? 0 : Math.round((totalPresencas / totalAulas) * 100);
  const percentualGraduacao = graduacao
    ? Math.round((graduacao.aulasRealizadas / Math.max(1, graduacao.aulasNecessarias)) * 100)
    : 0;

  return {
    alunoCobrancasOrdenadas,
    alunoMensalidades,
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
  };
}
