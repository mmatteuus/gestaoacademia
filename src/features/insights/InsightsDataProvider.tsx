import { useMemo, type ReactNode } from 'react';
import {
  useAlunos,
  useCampeonatos,
  useCobrancas,
  useDespesas,
  useGraduacoesAlunos,
  useHistoricoGraduacao,
  useProdutos,
  useRanking,
  useReceitas,
  useRegrasGraduacao,
  useSessoesAula,
  useVendas,
} from '@/services/queries';
import type {
  Aluno,
  Campeonato,
  Cobranca,
  Despesa,
  GraduacaoAluno,
  HistoricoGraduacao,
  Produto,
  RankingEntry,
  Receita,
  RegraGraduacao,
  SessaoAula,
  Venda,
} from '@/types';
import { buildAtividadesRecentes } from './insights.activities';
import { buildAlertas } from './insights.alerts';
import { InsightsDataContext } from './insights.context';
import {
  buildFrequenciaMensal,
  buildReceitaDespesaMensal,
  buildVendasPorCategoria,
} from './insights.metrics';
import type { InsightsDataContextValue } from './insights.types';
import { useInsightsActions } from './useInsightsActions';

const EMPTY_ALUNOS: Aluno[] = [];
const EMPTY_CAMPEONATOS: Campeonato[] = [];
const EMPTY_COBRANCAS: Cobranca[] = [];
const EMPTY_DESPESAS: Despesa[] = [];
const EMPTY_GRADUACOES: GraduacaoAluno[] = [];
const EMPTY_HISTORICO: HistoricoGraduacao[] = [];
const EMPTY_PRODUTOS: Produto[] = [];
const EMPTY_RANKING: RankingEntry[] = [];
const EMPTY_RECEITAS: Receita[] = [];
const EMPTY_REGRAS: RegraGraduacao[] = [];
const EMPTY_SESSOES: SessaoAula[] = [];
const EMPTY_VENDAS: Venda[] = [];
const EMPTY_HEATMAP: InsightsDataContextValue['frequenciaHeatmap'] = [];
const EMPTY_RANKING_EVOLUTION: InsightsDataContextValue['rankingEvolucao'] = [];

export function InsightsDataProvider({ children }: { children: ReactNode }) {
  const graduacoesQuery = useGraduacoesAlunos();
  const historicoQuery = useHistoricoGraduacao();
  const regrasQuery = useRegrasGraduacao();
  const rankingQuery = useRanking();
  const campeonatosQuery = useCampeonatos();
  const receitasQuery = useReceitas();
  const despesasQuery = useDespesas();
  const sessoesQuery = useSessoesAula();
  const cobrancasQuery = useCobrancas();
  const vendasQuery = useVendas();
  const produtosQuery = useProdutos();
  const alunosQuery = useAlunos();

  const graduacoesAlunos = graduacoesQuery.list.data ?? EMPTY_GRADUACOES;
  const historicoGraduacoes = historicoQuery.list.data ?? EMPTY_HISTORICO;
  const regrasGraduacao = regrasQuery.list.data ?? EMPTY_REGRAS;
  const ranking = rankingQuery.list.data ?? EMPTY_RANKING;
  const campeonatos = campeonatosQuery.list.data ?? EMPTY_CAMPEONATOS;
  const receitas = receitasQuery.list.data ?? EMPTY_RECEITAS;
  const despesas = despesasQuery.list.data ?? EMPTY_DESPESAS;
  const sessoes = sessoesQuery.list.data ?? EMPTY_SESSOES;
  const cobrancas = cobrancasQuery.list.data ?? EMPTY_COBRANCAS;
  const vendas = vendasQuery.list.data ?? EMPTY_VENDAS;
  const produtos = produtosQuery.list.data ?? EMPTY_PRODUTOS;
  const alunos = alunosQuery.list.data ?? EMPTY_ALUNOS;

  const frequenciaMensal = useMemo(() => buildFrequenciaMensal(sessoes), [sessoes]);
  const receitaDespesaMensal = useMemo(
    () => buildReceitaDespesaMensal(receitas, despesas, cobrancas),
    [cobrancas, despesas, receitas],
  );
  const vendasPorCategoria = useMemo(
    () => buildVendasPorCategoria(vendas, produtos),
    [produtos, vendas],
  );
  const alertas = useMemo(
    () => buildAlertas(cobrancas, produtos, graduacoesAlunos, alunos),
    [alunos, cobrancas, graduacoesAlunos, produtos],
  );
  const atividadesRecentes = useMemo(
    () => buildAtividadesRecentes(vendas, cobrancas, alunos, sessoes),
    [alunos, cobrancas, sessoes, vendas],
  );
  const actions = useInsightsActions({
    campeonatos,
    regras: regrasGraduacao,
    campeonatosQuery,
    regrasQuery,
  });

  const value: InsightsDataContextValue = {
    alertas,
    atividadesRecentes,
    graduacoesAlunos,
    historicoGraduacoes,
    regrasGraduacao,
    ranking,
    campeonatos,
    frequenciaMensal,
    receitaDespesaMensal,
    frequenciaHeatmap: EMPTY_HEATMAP,
    rankingEvolucao: EMPTY_RANKING_EVOLUTION,
    vendasPorCategoria,
    receitas,
    despesas,
    ...actions,
  };

  return <InsightsDataContext.Provider value={value}>{children}</InsightsDataContext.Provider>;
}

export { useInsightsData } from './insights.context';
