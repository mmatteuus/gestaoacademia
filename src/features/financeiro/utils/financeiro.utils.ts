import type { Aluno, Cobranca } from '@/types';
import type {
  ComprovanteFinanceiroState,
  FiltroCobranca,
  FinanceiroMetrics,
} from '../types/financeiro.types';

export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(dateIso: string) {
  if (!dateIso) return '-';
  const [year, month, day] = dateIso.split('-');
  return year && month && day ? `${day}/${month}/${year}` : dateIso;
}

export function isCobrancaPayable(cobranca: Cobranca) {
  return ['aberta', 'parcial', 'vencida'].includes(cobranca.status);
}

export function calculateFinanceiroMetrics(cobrancas: Cobranca[]): FinanceiroMetrics {
  return {
    totalAberto: cobrancas
      .filter((cobranca) => cobranca.status === 'aberta' || cobranca.status === 'parcial')
      .reduce((total, cobranca) => total + (cobranca.valor - cobranca.valorPago), 0),
    totalVencido: cobrancas
      .filter((cobranca) => cobranca.status === 'vencida')
      .reduce((total, cobranca) => total + (cobranca.valor - cobranca.valorPago), 0),
    mensalidadesPendentes: cobrancas.filter(
      (cobranca) => cobranca.tipo === 'mensalidade' && cobranca.status !== 'paga',
    ).length,
    totalCobrancas: cobrancas.length,
  };
}

export function filterCobrancas(
  cobrancas: Cobranca[],
  filtro: FiltroCobranca,
  busca: string,
  alunoId: string,
) {
  const normalizedSearch = busca.trim().toLocaleLowerCase('pt-BR');

  return cobrancas.filter((cobranca) => {
    const statusMatches = filtro === 'todas' || cobranca.status === filtro;
    const studentMatches = alunoId === 'todos' || cobranca.alunoId === alunoId;
    const searchMatches =
      normalizedSearch.length === 0 ||
      cobranca.nomeAluno.toLocaleLowerCase('pt-BR').includes(normalizedSearch) ||
      cobranca.descricao.toLocaleLowerCase('pt-BR').includes(normalizedSearch);

    return statusMatches && studentMatches && searchMatches;
  });
}

export function buildFinanceiroReceipt(
  cobranca: Cobranca,
  aluno?: Aluno,
): ComprovanteFinanceiroState {
  return {
    open: true,
    subtitle: `${cobranca.nomeAluno} • ${cobranca.descricao}`,
    phone: aluno?.telefone ?? '',
    recipient: aluno?.nome ?? cobranca.nomeAluno,
    fields: [
      { label: 'Aluno', value: cobranca.nomeAluno },
      { label: 'Descrição', value: cobranca.descricao },
      { label: 'Valor total', value: formatCurrency(cobranca.valor) },
      { label: 'Valor pago', value: formatCurrency(cobranca.valorPago) },
      { label: 'Data do pagamento', value: cobranca.dataPagamento || 'Não registrado' },
      { label: 'Forma de pagamento', value: cobranca.formaPagamento || 'Não informada' },
      { label: 'Observações', value: cobranca.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: cobranca.comprovanteId || 'Não gerado' },
    ],
  };
}
