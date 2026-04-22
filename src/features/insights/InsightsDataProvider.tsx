import { createContext, useContext, useMemo, type ReactNode } from 'react';
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
  const sessoesQ = useSessoesAula();
  const cobrancasQ = useCobrancas();
  const vendasQ = useVendas();
  const produtosQ = useProdutos();
  const alunosQ = useAlunos();

  const graduacoesAlunos = graduacoesAlunosQ.list.data ?? [];
  const historicoGraduacoes = historicoGraduacoesQ.list.data ?? [];
  const regrasGraduacao = regrasGraduacaoQ.list.data ?? [];
  const ranking = rankingQ.list.data ?? [];
  const campeonatos = campeonatosQ.list.data ?? [];
  const receitas = receitasQ.list.data ?? [];
  const despesas = despesasQ.list.data ?? [];
  const sessoes = sessoesQ.list.data ?? [];
  const cobrancas = cobrancasQ.list.data ?? [];
  const vendas = vendasQ.list.data ?? [];
  const produtos = produtosQ.list.data ?? [];
  const alunos = alunosQ.list.data ?? [];

  // ===== Séries agregadas a partir dos dados reais =====
  const MES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const frequenciaMensal = useMemo(() => {
    if (sessoes.length === 0) return [];
    const now = new Date();
    const buckets: { mes: string; total: number; presentes: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ mes: MES_LABELS[d.getMonth()], total: 0, presentes: 0 });
    }
    const baseMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    for (const sessao of sessoes) {
      const data = new Date(`${sessao.data}T00:00:00`);
      if (Number.isNaN(data.getTime()) || data < baseMonth) continue;
      const idx = (data.getFullYear() - baseMonth.getFullYear()) * 12 + (data.getMonth() - baseMonth.getMonth());
      if (idx < 0 || idx >= buckets.length) continue;
      for (const p of sessao.presencas) {
        buckets[idx].total++;
        if (p.presente) buckets[idx].presentes++;
      }
    }
    return buckets.map((b) => ({ mes: b.mes, presenca: b.total === 0 ? 0 : Math.round((b.presentes / b.total) * 100) }));
  }, [sessoes]);

  const receitaDespesaMensal = useMemo(() => {
    if (receitas.length === 0 && despesas.length === 0 && cobrancas.length === 0) return [];
    const now = new Date();
    const baseMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const buckets: { mes: string; receita: number; despesa: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ mes: MES_LABELS[d.getMonth()], receita: 0, despesa: 0 });
    }
    const idxOf = (iso: string) => {
      const data = new Date(`${iso}T00:00:00`);
      if (Number.isNaN(data.getTime()) || data < baseMonth) return -1;
      const i = (data.getFullYear() - baseMonth.getFullYear()) * 12 + (data.getMonth() - baseMonth.getMonth());
      return i >= 0 && i < buckets.length ? i : -1;
    };
    for (const r of receitas) {
      const i = idxOf(r.data || '');
      if (i >= 0) buckets[i].receita += Number(r.valor) || 0;
    }
    for (const c of cobrancas) {
      if (c.status !== 'paga' && c.status !== 'parcial') continue;
      const i = idxOf(c.dataPagamento || c.dataVencimento || '');
      if (i >= 0) buckets[i].receita += Number(c.valorPago) || 0;
    }
    for (const d of despesas) {
      const i = idxOf(d.data || '');
      if (i >= 0) buckets[i].despesa += Number(d.valor) || 0;
    }
    return buckets;
  }, [receitas, despesas, cobrancas]);

  const frequenciaHeatmap = useMemo<{ dia: string; horario: string; presenca: number }[]>(() => {
    // Sem dado origem rico (sessões só têm data, não dia da semana × horário) → vazio.
    return [];
  }, []);

  const rankingEvolucao = useMemo<Record<string, string | number>[]>(() => {
    // Histórico de ranking por mês requer entidade própria → vazio até então.
    return [];
  }, []);

  const vendasPorCategoria = useMemo(() => {
    if (vendas.length === 0 || produtos.length === 0) return [];
    const catByProd = new Map(produtos.map((p) => [p.id, p.categoria || 'Sem categoria']));
    const acc = new Map<string, number>();
    for (const v of vendas) {
      for (const item of v.itens || []) {
        const cat = catByProd.get(item.produtoId) || 'Sem categoria';
        const valor = (Number(item.precoUnitario) || 0) * (Number(item.quantidade) || 0);
        acc.set(cat, (acc.get(cat) || 0) + valor);
      }
    }
    return Array.from(acc.entries()).map(([categoria, valor]) => ({ categoria, valor }));
  }, [vendas, produtos]);

  const alertas = useMemo<Alerta[]>(() => {
    const out: Alerta[] = [];
    const today = new Date().toISOString().slice(0, 10);
    // Cobranças vencidas
    for (const c of cobrancas) {
      if (c.status === 'vencida' || (c.status === 'aberta' && c.dataVencimento && c.dataVencimento < today)) {
        out.push({ id: `al-cob-${c.id}`, tipo: 'urgente', mensagem: `${c.nomeAluno || 'Aluno'} com mensalidade vencida`, data: c.dataVencimento || today });
      }
    }
    // Estoque baixo / zerado
    for (const p of produtos) {
      const est = Number(p.estoque) || 0;
      const min = Number(p.estoqueMinimo) || 0;
      if (est === 0) out.push({ id: `al-prod-${p.id}`, tipo: 'aviso', mensagem: `Estoque zerado: ${p.nome}`, data: today });
      else if (min > 0 && est <= min) out.push({ id: `al-prod-${p.id}`, tipo: 'aviso', mensagem: `Estoque baixo: ${p.nome} (${est} unid.)`, data: today });
    }
    // Aptos para graduação
    for (const g of graduacoesAlunos) {
      if (g.status === 'elegivel' || g.status === 'aprovado') {
        const aluno = alunos.find((a) => a.id === g.alunoId);
        out.push({ id: `al-grad-${g.id}`, tipo: 'info', mensagem: `${aluno?.nome || 'Aluno'} elegível para graduação`, data: today });
      }
    }
    return out.slice(0, 8);
  }, [cobrancas, produtos, graduacoesAlunos, alunos]);

  const atividadesRecentes = useMemo<AtividadeRecente[]>(() => {
    const out: { item: AtividadeRecente; ts: number }[] = [];
    const ts = (iso: string) => {
      const t = new Date(`${iso}T00:00:00`).getTime();
      return Number.isFinite(t) ? t : 0;
    };
    for (const v of vendas.slice(-10)) {
      const nome = v.itens?.[0]?.nomeProduto || 'Produto';
      out.push({ item: { id: `at-v-${v.id}`, descricao: `Venda de ${nome} para ${v.compradorNome || 'cliente'}`, data: v.data, tipo: 'venda' }, ts: ts(v.data) });
    }
    for (const c of cobrancas) {
      if ((c.status === 'paga' || c.status === 'parcial') && c.dataPagamento) {
        out.push({ item: { id: `at-c-${c.id}`, descricao: `Pagamento recebido de ${c.nomeAluno || 'aluno'}`, data: c.dataPagamento, tipo: 'pagamento' }, ts: ts(c.dataPagamento) });
      }
    }
    for (const a of alunos) {
      if (a.status === 'pre-cadastro') {
        out.push({ item: { id: `at-a-${a.id}`, descricao: `${a.nome} realizou pré-cadastro`, data: a.dataMatricula, tipo: 'cadastro' }, ts: ts(a.dataMatricula) });
      }
    }
    for (const s of sessoes.slice(-10)) {
      out.push({ item: { id: `at-s-${s.id}`, descricao: `Frequência lançada (${s.presencas.length} alunos)`, data: s.data, tipo: 'frequencia' }, ts: ts(s.data) });
    }
    return out.sort((a, b) => b.ts - a.ts).slice(0, 6).map((x) => x.item);
  }, [vendas, cobrancas, alunos, sessoes]);

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
