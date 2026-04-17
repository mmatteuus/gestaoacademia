import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  alertas as alertasMock,
  atividadesRecentes as atividadesMock,
  frequenciaHeatmap as frequenciaHeatmapMock,
  frequenciaMensal as frequenciaMensalMock,
  rankingEvolucao as rankingEvolucaoMock,
  receitaDespesaMensal as receitaDespesaMensalMock,
  vendasPorCategoria as vendasPorCategoriaMock,
} from '@/services/mocks/data';
import {
  useCampeonatos,
  useDespesas,
  useGraduacoesAlunos,
  useHistoricoGraduacao,
  useRanking,
  useReceitas,
  useRegrasGraduacao,
} from '@/services/queries';
import type {
  Alerta,
  AtividadeRecente,
  Campeonato,
  GraduacaoAluno,
  HistoricoGraduacao,
  RankingEntry,
  Receita,
  Despesa,
  RegraGraduacao,
} from '@/types';

interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
}

interface InsightsDataContextValue {
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
  addParticipantesCampeonato: (campeonatoId: string, participantes: Campeonato['participantes']) => ActionResult;
}

const InsightsDataContext = createContext<InsightsDataContextValue | undefined>(undefined);

export function InsightsDataProvider({ children }: { children: ReactNode }) {
  // Entidades reais vindas do Google Sheets
  const graduacoesAlunosQ = useGraduacoesAlunos();
  const historicoGraduacoesQ = useHistoricoGraduacao();
  const regrasGraduacaoQ = useRegrasGraduacao();
  const rankingQ = useRanking();
  const campeonatosQ = useCampeonatos();
  const receitasQ = useReceitas();
  const despesasQ = useDespesas();

  // Séries agregadas / UI-only — seguem mock até termos cálculos a partir das entidades.
  const [alertas] = useState<Alerta[]>(alertasMock);
  const [atividadesRecentes] = useState<AtividadeRecente[]>(atividadesMock);
  const [frequenciaMensal] = useState(frequenciaMensalMock);
  const [receitaDespesaMensal] = useState(receitaDespesaMensalMock);
  const [frequenciaHeatmap] = useState(frequenciaHeatmapMock);
  const [rankingEvolucao] = useState<Record<string, string | number>[]>(rankingEvolucaoMock);
  const [vendasPorCategoria] = useState(vendasPorCategoriaMock);

  const graduacoesAlunos = graduacoesAlunosQ.list.data ?? [];
  const historicoGraduacoes = historicoGraduacoesQ.list.data ?? [];
  const regrasGraduacao = regrasGraduacaoQ.list.data ?? [];
  const ranking = rankingQ.list.data ?? [];
  const campeonatos = campeonatosQ.list.data ?? [];
  const receitas = receitasQ.list.data ?? [];
  const despesas = despesasQ.list.data ?? [];

  const upsertRegraGraduacao = (regra: RegraGraduacao): ActionResult<RegraGraduacao> => {
    if (!regra.faixaOrigem.trim() || !regra.faixaDestino.trim()) {
      return { ok: false, message: 'Preencha as faixas de origem e destino.' };
    }

    const exists = regrasGraduacao.some((item) => item.id === regra.id);
    if (exists) {
      regrasGraduacaoQ.update.mutate({ id: regra.id, data: regra });
    } else {
      regrasGraduacaoQ.create.mutate(regra);
    }
    return { ok: true, data: regra };
  };

  const createCampeonato = (campeonato: Campeonato): ActionResult<Campeonato> => {
    campeonatosQ.create.mutate(campeonato);
    return { ok: true, data: campeonato };
  };

  const addParticipantesCampeonato = (
    campeonatoId: string,
    participantes: Campeonato['participantes']
  ): ActionResult => {
    const campeonato = campeonatos.find((item) => item.id === campeonatoId);
    if (!campeonato) return { ok: false, message: 'Campeonato não encontrado.' };

    const existentes = new Set(campeonato.participantes.map((item) => item.alunoId));
    const novos = participantes.filter((item) => !existentes.has(item.alunoId));

    campeonatosQ.update.mutate({
      id: campeonatoId,
      data: { participantes: [...campeonato.participantes, ...novos] },
    });
    return { ok: true };
  };

  const value = useMemo<InsightsDataContextValue>(
    () => ({
      alertas,
      atividadesRecentes,
      graduacoesAlunos,
      historicoGraduacoes,
      regrasGraduacao,
      ranking,
      campeonatos,
      frequenciaMensal,
      receitaDespesaMensal,
      frequenciaHeatmap,
      rankingEvolucao,
      vendasPorCategoria,
      receitas,
      despesas,
      upsertRegraGraduacao,
      createCampeonato,
      addParticipantesCampeonato,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      alertas,
      atividadesRecentes,
      graduacoesAlunos,
      historicoGraduacoes,
      regrasGraduacao,
      ranking,
      campeonatos,
      frequenciaMensal,
      receitaDespesaMensal,
      frequenciaHeatmap,
      rankingEvolucao,
      vendasPorCategoria,
      receitas,
      despesas,
    ]
  );

  return <InsightsDataContext.Provider value={value}>{children}</InsightsDataContext.Provider>;
}

export function useInsightsData() {
  const context = useContext(InsightsDataContext);
  if (!context) {
    throw new Error('useInsightsData deve ser usado dentro de InsightsDataProvider');
  }
  return context;
}
