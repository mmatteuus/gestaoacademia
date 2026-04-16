import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  alertas as alertasMock,
  atividadesRecentes as atividadesMock,
  campeonatos as campeonatosMock,
  frequenciaHeatmap as frequenciaHeatmapMock,
  frequenciaMensal as frequenciaMensalMock,
  graduacoesAlunos as graduacoesAlunosMock,
  historicoGraduacoes as historicoGraduacoesMock,
  ranking as rankingMock,
  rankingEvolucao as rankingEvolucaoMock,
  receitaDespesaMensal as receitaDespesaMensalMock,
  receitas as receitasMock,
  despesas as despesasMock,
  regrasGraduacao as regrasGraduacaoMock,
  vendasPorCategoria as vendasPorCategoriaMock,
} from '@/services/mocks/data';
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
  const [alertas] = useState<Alerta[]>(alertasMock);
  const [atividadesRecentes] = useState<AtividadeRecente[]>(atividadesMock);
  const [graduacoesAlunos] = useState<GraduacaoAluno[]>(graduacoesAlunosMock);
  const [historicoGraduacoes] = useState<HistoricoGraduacao[]>(historicoGraduacoesMock);
  const [regrasGraduacao, setRegrasGraduacao] = useState<RegraGraduacao[]>(
    regrasGraduacaoMock.map((regra) => ({
      ...regra,
      modalidade: regra.modalidade || (regra.categoria === 'Adulto' ? 'Jiu-Jitsu' : 'Karatê'),
    }))
  );
  const [ranking] = useState<RankingEntry[]>(rankingMock);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>(campeonatosMock);
  const [frequenciaMensal] = useState(frequenciaMensalMock);
  const [receitaDespesaMensal] = useState(receitaDespesaMensalMock);
  const [frequenciaHeatmap] = useState(frequenciaHeatmapMock);
  const [rankingEvolucao] = useState<Record<string, string | number>[]>(rankingEvolucaoMock);
  const [vendasPorCategoria] = useState(vendasPorCategoriaMock);
  const [receitas] = useState<Receita[]>(receitasMock);
  const [despesas] = useState<Despesa[]>(despesasMock);

  const upsertRegraGraduacao = (regra: RegraGraduacao): ActionResult<RegraGraduacao> => {
    if (!regra.faixaOrigem.trim() || !regra.faixaDestino.trim()) {
      return { ok: false, message: 'Preencha as faixas de origem e destino.' };
    }

    const regraFinal = regra.id ? regra : { ...regra, id: `rg${Date.now()}` };
    setRegrasGraduacao((prev) => {
      const exists = prev.some((item) => item.id === regraFinal.id);
      if (exists) {
        return prev.map((item) => (item.id === regraFinal.id ? regraFinal : item));
      }
      return [...prev, regraFinal];
    });

    return { ok: true, data: regraFinal };
  };

  const createCampeonato = (campeonato: Campeonato): ActionResult<Campeonato> => {
    const campeonatoFinal = { ...campeonato, id: campeonato.id || `c${Date.now()}` };
    setCampeonatos((prev) => [campeonatoFinal, ...prev]);
    return { ok: true, data: campeonatoFinal };
  };

  const addParticipantesCampeonato = (campeonatoId: string, participantes: Campeonato['participantes']): ActionResult => {
    const campeonato = campeonatos.find((item) => item.id === campeonatoId);
    if (!campeonato) {
      return { ok: false, message: 'Campeonato não encontrado.' };
    }

    const existentes = new Set(campeonato.participantes.map((item) => item.alunoId));
    const novos = participantes.filter((item) => !existentes.has(item.alunoId));

    setCampeonatos((prev) =>
      prev.map((item) =>
        item.id === campeonatoId
          ? { ...item, participantes: [...item.participantes, ...novos] }
          : item
      )
    );

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
    [alertas, atividadesRecentes, graduacoesAlunos, historicoGraduacoes, regrasGraduacao, ranking, campeonatos, frequenciaMensal, receitaDespesaMensal, frequenciaHeatmap, rankingEvolucao, vendasPorCategoria, receitas, despesas]
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
