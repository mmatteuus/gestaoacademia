import type {
  Alerta,
  AtividadeRecente,
  Campeonato,
  Despesa,
  GraduacaoAluno,
  HistoricoGraduacao,
  RankingEntry,
  Receita,
  RegraGraduacao,
} from '@/types';

export interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
}

export interface InsightsDataContextValue {
  alertas: Alerta[];
  atividadesRecentes: AtividadeRecente[];
  graduacoesAlunos: GraduacaoAluno[];
  historicoGraduacoes: HistoricoGraduacao[];
  regrasGraduacao: RegraGraduacao[];
  ranking: RankingEntry[];
  campeonatos: Campeonato[];
  frequenciaMensal: { mes: string; presenca: number }[];
  receitaDespesaMensal: { mes: string; receita: number; despesa: number }[];
  frequenciaHeatmap: { dia: string; horario: string; presenca: number }[];
  rankingEvolucao: Record<string, string | number>[];
  vendasPorCategoria: { categoria: string; valor: number }[];
  receitas: Receita[];
  despesas: Despesa[];
  upsertRegraGraduacao: (regra: RegraGraduacao) => ActionResult<RegraGraduacao>;
  createCampeonato: (campeonato: Campeonato) => ActionResult<Campeonato>;
  addParticipantesCampeonato: (
    campeonatoId: string,
    participantes: Campeonato['participantes'],
  ) => ActionResult;
}
