import type { Cobranca, CobrancaStatus, FormaPagamento } from '@/types';

export type FiltroCobranca = CobrancaStatus | 'todas';

export interface FinanceiroMetrics {
  totalAberto: number;
  totalVencido: number;
  mensalidadesPendentes: number;
  totalCobrancas: number;
}

export interface ComprovanteFinanceiroState {
  open: boolean;
  subtitle: string;
  fields: { label: string; value: string }[];
  phone: string;
  recipient: string;
}

export interface PagamentoResponse {
  valorPago?: number;
  status?: CobrancaStatus;
  formaPagamento?: FormaPagamento;
  dataPagamento?: string;
  comprovanteId?: string;
}

export interface CobrancaComAluno extends Cobranca {
  alunoTelefone?: string;
}
