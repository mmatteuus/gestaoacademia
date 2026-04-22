import { http } from './client';

export interface SalePayload {
  id?: string;
  data?: string;
  compradorNome: string;
  compradorTelefone?: string;
  formaPagamento: 'PIX' | 'Cartao' | 'Dinheiro' | 'Transferencia';
  observacoes?: string;
  parcelado?: boolean;
  quantidadeParcelas?: number;
  descontoTipo?: 'valor' | 'percentual';
  descontoValor?: number;
  comprovanteId?: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    nomeProduto?: string;
    precoUnitario?: number;
  }>;
}

export interface FinancePaymentPayload {
  cobrancaId: string;
  valorPagamento: number;
  formaPagamento: 'PIX' | 'Cartao' | 'Dinheiro' | 'Transferencia' | 'Boleto';
  observacoes?: string;
  referencia?: string;
  comprovanteId?: string;
  dataPagamento?: string;
}

export interface ReservationPayload {
  id?: string;
  espaco: string;
  locatario: string;
  locatarioTelefone?: string;
  dataInicio: string;
  dataFim?: string;
  horaInicio: string;
  horaFim: string;
  valor: number;
  status?: 'confirmada' | 'pendente' | 'cancelada';
  observacoes?: string;
}

export type DomainSuccess<T> = {
  ok: true;
  data: T;
  warnings?: string[];
};

export const domainApi = {
  createSale: (payload: SalePayload) =>
    http.post<DomainSuccess<Record<string, unknown>>>('/api/sales', payload),

  createFinancePayment: (payload: FinancePaymentPayload) =>
    http.post<DomainSuccess<Record<string, unknown>>>('/api/finance/payments', payload),

  createReservation: (payload: ReservationPayload) =>
    http.post<DomainSuccess<Record<string, unknown>>>('/api/rentals/reservations', payload),
};
