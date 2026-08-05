import type { ContratoAluguel, PagamentoContratoAluguel } from '@/types';
import type {
  ComprovanteAluguelState,
  PagamentoContratoDetalhado,
} from '../types/aluguel.types';

export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function groupPagamentosByContrato(pagamentos: PagamentoContratoAluguel[]) {
  return pagamentos.reduce<Record<string, PagamentoContratoDetalhado[]>>((groups, pagamento) => {
    const current = groups[pagamento.contratoId] ?? [];
    groups[pagamento.contratoId] = [...current, pagamento as PagamentoContratoDetalhado];
    return groups;
  }, {});
}

export function buildComprovanteAluguel(
  contrato: ContratoAluguel,
  pagamento: PagamentoContratoAluguel,
): ComprovanteAluguelState {
  const detalhado = pagamento as PagamentoContratoDetalhado;

  return {
    open: true,
    subtitle: `${contrato.locatario} • ${contrato.espaco}`,
    phone: detalhado.recipientPhone ?? '',
    recipient: contrato.locatario,
    fields: [
      { label: 'Locatário', value: contrato.locatario },
      { label: 'Telefone', value: detalhado.recipientPhone || 'Não informado' },
      { label: 'Espaço', value: contrato.espaco },
      { label: 'Período do contrato', value: `${contrato.dataInicio} a ${contrato.dataFim}` },
      { label: 'Valor pago', value: formatCurrency(pagamento.valor) },
      { label: 'Data do pagamento', value: pagamento.dataPagamento },
      { label: 'Forma de pagamento', value: pagamento.formaPagamento },
      { label: 'Referência', value: pagamento.referencia || 'Sem referência' },
      { label: 'Observações', value: pagamento.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: pagamento.comprovanteId || 'Não gerado' },
    ],
  };
}
