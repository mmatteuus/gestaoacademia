import type { FormaPagamento, Venda } from '@/types';

export type FormaPagamentoVenda = Exclude<FormaPagamento, 'Boleto'>;
export type DescontoTipo = 'valor' | 'percentual';

export interface CarrinhoItem {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export type VendaDetalhada = Venda & {
  compradorTelefone?: string;
  subtotal?: number;
  desconto?: number;
  descontoTipo?: DescontoTipo;
  recipientPhone?: string;
};

export interface ComprovanteState {
  open: boolean;
  subtitle: string;
  fields: { label: string; value: string }[];
  phone: string;
  recipient: string;
}
