import type {
  Cobranca,
  Despesa,
  Produto,
  Receita,
  SessaoAula,
  Venda,
} from '@/types';

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;

function createMonthlyBuckets() {
  const now = new Date();
  const baseMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const labels = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return MONTH_LABELS[date.getMonth()];
  });

  return { baseMonth, labels };
}

function monthIndex(isoDate: string, baseMonth: Date, bucketCount: number) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date < baseMonth) return -1;

  const index =
    (date.getFullYear() - baseMonth.getFullYear()) * 12 +
    (date.getMonth() - baseMonth.getMonth());
  return index >= 0 && index < bucketCount ? index : -1;
}

export function buildFrequenciaMensal(sessoes: SessaoAula[]) {
  if (sessoes.length === 0) return [];

  const { baseMonth, labels } = createMonthlyBuckets();
  const buckets = labels.map((mes) => ({ mes, total: 0, presentes: 0 }));

  for (const sessao of sessoes) {
    const index = monthIndex(sessao.data, baseMonth, buckets.length);
    if (index < 0) continue;

    for (const presenca of sessao.presencas) {
      buckets[index].total += 1;
      if (presenca.presente) buckets[index].presentes += 1;
    }
  }

  return buckets.map((bucket) => ({
    mes: bucket.mes,
    presenca: bucket.total === 0
      ? 0
      : Math.round((bucket.presentes / bucket.total) * 100),
  }));
}

export function buildReceitaDespesaMensal(
  receitas: Receita[],
  despesas: Despesa[],
  cobrancas: Cobranca[],
) {
  if (receitas.length === 0 && despesas.length === 0 && cobrancas.length === 0) return [];

  const { baseMonth, labels } = createMonthlyBuckets();
  const buckets = labels.map((mes) => ({ mes, receita: 0, despesa: 0 }));

  for (const receita of receitas) {
    const index = monthIndex(receita.data || '', baseMonth, buckets.length);
    if (index >= 0) buckets[index].receita += Number(receita.valor) || 0;
  }

  for (const cobranca of cobrancas) {
    if (cobranca.status !== 'paga' && cobranca.status !== 'parcial') continue;
    const index = monthIndex(
      cobranca.dataPagamento || cobranca.dataVencimento || '',
      baseMonth,
      buckets.length,
    );
    if (index >= 0) buckets[index].receita += Number(cobranca.valorPago) || 0;
  }

  for (const despesa of despesas) {
    const index = monthIndex(despesa.data || '', baseMonth, buckets.length);
    if (index >= 0) buckets[index].despesa += Number(despesa.valor) || 0;
  }

  return buckets;
}

export function buildVendasPorCategoria(vendas: Venda[], produtos: Produto[]) {
  if (vendas.length === 0 || produtos.length === 0) return [];

  const categoryByProduct = new Map(
    produtos.map((produto) => [produto.id, produto.categoria || 'Sem categoria']),
  );
  const totals = new Map<string, number>();

  for (const venda of vendas) {
    for (const item of venda.itens || []) {
      const category = categoryByProduct.get(item.produtoId) || 'Sem categoria';
      const value = (Number(item.precoUnitario) || 0) * (Number(item.quantidade) || 0);
      totals.set(category, (totals.get(category) || 0) + value);
    }
  }

  return Array.from(totals, ([categoria, valor]) => ({ categoria, valor }));
}
