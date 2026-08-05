import type { Aluno, AtividadeRecente, Cobranca, SessaoAula, Venda } from '@/types';

interface DatedActivity {
  item: AtividadeRecente;
  timestamp: number;
}

function timestamp(isoDate: string) {
  const value = new Date(`${isoDate}T00:00:00`).getTime();
  return Number.isFinite(value) ? value : 0;
}

function sortActivities<T>(
  items: T[],
  factory: (item: T) => DatedActivity,
) {
  return items.map(factory).sort((left, right) => right.timestamp - left.timestamp);
}

export function buildAtividadesRecentes(
  vendas: Venda[],
  cobrancas: Cobranca[],
  alunos: Aluno[],
  sessoes: SessaoAula[],
) {
  const saleActivities = sortActivities(vendas, (venda) => {
    const productName = venda.itens?.[0]?.nomeProduto || 'Produto';
    return {
      item: {
        id: `at-v-${venda.id}`,
        descricao: `Venda de ${productName} para ${venda.compradorNome || 'cliente'}`,
        data: venda.data,
        tipo: 'venda',
      },
      timestamp: timestamp(venda.data),
    };
  });

  const paymentActivities = sortActivities(
    cobrancas.filter(
      (cobranca) =>
        (cobranca.status === 'paga' || cobranca.status === 'parcial') &&
        cobranca.dataPagamento,
    ),
    (cobranca) => ({
      item: {
        id: `at-c-${cobranca.id}`,
        descricao: `Pagamento recebido de ${cobranca.nomeAluno || 'aluno'}`,
        data: cobranca.dataPagamento || '',
        tipo: 'pagamento',
      },
      timestamp: timestamp(cobranca.dataPagamento || ''),
    }),
  );

  const registrationActivities = sortActivities(
    alunos.filter((aluno) => aluno.status === 'pre-cadastro'),
    (aluno) => ({
      item: {
        id: `at-a-${aluno.id}`,
        descricao: `${aluno.nome} realizou pré-cadastro`,
        data: aluno.dataMatricula,
        tipo: 'cadastro',
      },
      timestamp: timestamp(aluno.dataMatricula),
    }),
  );

  const attendanceActivities = sortActivities(sessoes, (sessao) => ({
    item: {
      id: `at-s-${sessao.id}`,
      descricao: `Frequência lançada (${sessao.presencas.length} alunos)`,
      data: sessao.data,
      tipo: 'frequencia',
    },
    timestamp: timestamp(sessao.data),
  }));

  const groups = [
    saleActivities,
    paymentActivities,
    registrationActivities,
    attendanceActivities,
  ];
  const result: AtividadeRecente[] = [];

  for (let index = 0; result.length < 8; index += 1) {
    let added = false;
    for (const group of groups) {
      if (!group[index]) continue;
      result.push(group[index].item);
      added = true;
      if (result.length >= 8) break;
    }
    if (!added) break;
  }

  return result;
}
