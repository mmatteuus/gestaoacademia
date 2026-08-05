import type { Alerta, Aluno, Cobranca, GraduacaoAluno, Produto } from '@/types';

export function buildAlertas(
  cobrancas: Cobranca[],
  produtos: Produto[],
  graduacoes: GraduacaoAluno[],
  alunos: Aluno[],
) {
  const today = new Date().toISOString().slice(0, 10);
  const overdueByStudent = new Map<string, { nome: string; data: string; total: number }>();

  for (const cobranca of cobrancas) {
    const overdue =
      cobranca.status === 'vencida' ||
      (cobranca.status === 'aberta' && Boolean(cobranca.dataVencimento) && cobranca.dataVencimento < today);
    if (!overdue) continue;

    const key = cobranca.alunoId || cobranca.nomeAluno || cobranca.id;
    const current = overdueByStudent.get(key);
    const total = (current?.total || 0) + 1;
    const earliestDate = !current || cobranca.dataVencimento < current.data
      ? cobranca.dataVencimento || today
      : current.data;

    overdueByStudent.set(key, {
      nome: cobranca.nomeAluno || 'Aluno',
      data: earliestDate,
      total,
    });
  }

  const billingAlerts: Alerta[] = Array.from(overdueByStudent, ([key, info]) => ({
    id: `al-cob-${key}`,
    tipo: 'urgente',
    mensagem: `${info.nome} com mensalidade vencida${info.total > 1 ? ` (${info.total} cobranças)` : ''}`,
    data: info.data,
  }));

  const stockAlerts: Alerta[] = produtos.flatMap((produto) => {
    const stock = Number(produto.estoque) || 0;
    const minimum = Number(produto.estoqueMinimo) || 0;
    if (stock === 0) {
      return [{
        id: `al-prod-${produto.id}`,
        tipo: 'aviso' as const,
        mensagem: `Estoque zerado: ${produto.nome}`,
        data: today,
      }];
    }
    if (minimum > 0 && stock <= minimum) {
      return [{
        id: `al-prod-${produto.id}`,
        tipo: 'aviso' as const,
        mensagem: `Estoque baixo: ${produto.nome} (${stock} unid.)`,
        data: today,
      }];
    }
    return [];
  });

  const graduationAlerts: Alerta[] = graduacoes.flatMap((graduacao) => {
    if (graduacao.status !== 'elegivel' && graduacao.status !== 'aprovado') return [];
    const aluno = alunos.find((item) => item.id === graduacao.alunoId);
    return [{
      id: `al-grad-${graduacao.id}`,
      tipo: 'info' as const,
      mensagem: `${aluno?.nome || 'Aluno'} elegível para graduação`,
      data: today,
    }];
  });

  return [
    ...billingAlerts.slice(0, 4),
    ...stockAlerts.slice(0, 4),
    ...graduationAlerts.slice(0, 4),
  ].slice(0, 12);
}
