import type { Produto, Venda } from '@/types';
import type { CarrinhoItem, DescontoTipo, VendaDetalhada } from '../types/produtos.types';

export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function getEstoqueStatus(produto: Produto) {
  if (produto.estoque === 0) return 'sem-estoque';
  if (produto.estoque <= produto.estoqueMinimo) return 'estoque-baixo';
  return 'estoque-ok';
}

export function calcularSubtotal(carrinho: CarrinhoItem[]) {
  return carrinho.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0);
}

export function calcularDesconto(subtotal: number, tipo: DescontoTipo, input: number) {
  if (!Number.isFinite(input) || input <= 0) return 0;
  const desconto = tipo === 'percentual' ? subtotal * (input / 100) : input;
  return Math.min(subtotal, desconto);
}

export function buildComprovanteFields(venda: Venda) {
  const detalhada = venda as VendaDetalhada;

  return [
    { label: 'Comprador', value: venda.compradorNome },
    { label: 'Telefone', value: detalhada.compradorTelefone || 'Não informado' },
    { label: 'Itens', value: venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ') },
    { label: 'Subtotal', value: formatCurrency(detalhada.subtotal ?? venda.total) },
    { label: 'Desconto aplicado', value: formatCurrency(detalhada.desconto ?? 0) },
    { label: 'Total', value: formatCurrency(venda.total) },
    { label: 'Forma de pagamento', value: venda.formaPagamento },
    { label: 'Parcelado', value: venda.parcelado ? `Sim • ${venda.quantidadeParcelas || 1}x` : 'Não' },
    { label: 'Observações', value: venda.observacoes || 'Sem observações' },
    { label: 'Comprovante', value: venda.comprovanteId || 'Não gerado' },
  ];
}
