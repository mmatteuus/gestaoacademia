import type { Produto } from '@/types';
import type { VendaDetalhada } from './produtos.types';

export function getEstoqueStatus(produto: Produto) {
  if (produto.estoque === 0) return 'sem-estoque';
  if (produto.estoque <= produto.estoqueMinimo) return 'estoque-baixo';
  return 'estoque-ok';
}

export function buildComprovanteData(venda: VendaDetalhada) {
  return {
    subtitle: `${venda.compradorNome} • ${venda.data}`,
    fields: [
      { label: 'Comprador', value: venda.compradorNome },
      { label: 'Telefone', value: venda.compradorTelefone || 'Não informado' },
      {
        label: 'Itens',
        value: venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', '),
      },
      { label: 'Subtotal', value: `R$ ${(venda.subtotal ?? venda.total).toFixed(2)}` },
      { label: 'Desconto aplicado', value: `R$ ${(venda.desconto ?? 0).toFixed(2)}` },
      { label: 'Total', value: `R$ ${venda.total.toFixed(2)}` },
      { label: 'Forma de pagamento', value: venda.formaPagamento },
      {
        label: 'Parcelado',
        value: venda.parcelado ? `Sim • ${venda.quantidadeParcelas || 1}x` : 'Não',
      },
      { label: 'Observações', value: venda.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: venda.comprovanteId || 'Não gerado' },
    ],
    phone: venda.compradorTelefone || venda.recipientPhone || '',
    recipient: venda.compradorNome,
  };
}
