import { useMemo } from 'react';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';

export function useRelatoriosData() {
  const { alunosList } = useAcademiaData();
  const { cobrancasList, vendasList } = useOperacionalData();
  const {
    graduacoesAlunos,
    ranking,
    frequenciaMensal,
    receitaDespesaMensal,
    frequenciaHeatmap,
    rankingEvolucao,
    vendasPorCategoria,
  } = useInsightsData();

  const statusAlunos = useMemo(
    () => [
      { name: 'Ativo', value: alunosList.filter((item) => item.status === 'ativo').length },
      { name: 'Inadimplente', value: alunosList.filter((item) => item.status === 'inadimplente').length },
      { name: 'Trancado', value: alunosList.filter((item) => item.status === 'trancado').length },
      { name: 'Inativo', value: alunosList.filter((item) => item.status === 'inativo').length },
      { name: 'Pré-cadastro', value: alunosList.filter((item) => item.status === 'pre-cadastro').length },
    ],
    [alunosList],
  );

  const funilGraduacao = useMemo(
    () => [
      {
        name: 'Não elegível',
        value: graduacoesAlunos.filter((item) => item.status === 'nao-elegivel').length,
        fill: 'hsl(var(--muted-foreground))',
      },
      {
        name: 'Elegível',
        value: graduacoesAlunos.filter((item) => item.status === 'elegivel').length,
        fill: 'hsl(var(--warning))',
      },
      {
        name: 'Aprovado',
        value: graduacoesAlunos.filter((item) => item.status === 'aprovado').length,
        fill: 'hsl(var(--info))',
      },
      {
        name: 'Graduado',
        value: graduacoesAlunos.filter((item) => item.status === 'graduado').length,
        fill: 'hsl(var(--success))',
      },
    ],
    [graduacoesAlunos],
  );

  const situacaoCobrancas = useMemo(
    () => [
      { name: 'Paga', value: cobrancasList.filter((item) => item.status === 'paga').length },
      { name: 'Aberta', value: cobrancasList.filter((item) => item.status === 'aberta').length },
      { name: 'Parcial', value: cobrancasList.filter((item) => item.status === 'parcial').length },
      { name: 'Vencida', value: cobrancasList.filter((item) => item.status === 'vencida').length },
      { name: 'Cancelada', value: cobrancasList.filter((item) => item.status === 'cancelada').length },
    ],
    [cobrancasList],
  );

  const rankingSeries = useMemo(
    () => ranking.slice(0, 3).map((item) => item.nomeAluno),
    [ranking],
  );

  const rankingTimeline = useMemo(
    () => rankingEvolucao.map((item) => {
      const point: Record<string, string | number> = { mes: String(item.mes ?? '') };
      rankingSeries.forEach((name) => {
        point[name] = Number(item[name] ?? 0);
      });
      return point;
    }),
    [rankingEvolucao, rankingSeries],
  );

  const vendasDistribuicao = useMemo(
    () => vendasPorCategoria.map((item) => ({
      categoria: String(item.categoria),
      total: Number(item.valor ?? 0),
    })),
    [vendasPorCategoria],
  );

  const resumoVendas = useMemo(
    () => ({
      quantidade: vendasList.length,
      total: vendasList.reduce((soma, item) => soma + item.total, 0),
    }),
    [vendasList],
  );

  return {
    statusAlunos,
    frequenciaMensal,
    frequenciaHeatmap,
    receitaDespesaMensal,
    situacaoCobrancas,
    funilGraduacao,
    ranking,
    rankingSeries,
    rankingTimeline,
    vendasDistribuicao,
    resumoVendas,
  };
}
