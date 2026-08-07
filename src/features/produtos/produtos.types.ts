import type { FormaPagamento, Venda } from '@/types';

export interface CarrinhoItem {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export type DescontoTipo = 'valor' | 'percentual';

export type FormaPagamentoVenda = Exclude<FormaPagamento, 'Boleto'>;

export type VendaDetalhada = Venda & {
  compradorTelefone?: string;
  subtotal?: number;
  desconto?: number;
  descontoTipo?: DescontoTipo;
  recipientPhone?: string;
};
