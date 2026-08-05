import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { SalePayload } from '@/services/api/domain';
import type { Produto, Venda } from '@/types';
import type { VendaCheckoutValues } from '../schemas/venda-checkout.schema';
import type { CarrinhoItem, ComprovanteState, VendaDetalhada } from '../types/produtos.types';
import {
  buildComprovanteFields,
  calcularDesconto,
  calcularSubtotal,
} from '../utils/produtos.utils';

interface VendaResult {
  ok: boolean;
  message?: string;
  warnings?: string[];
}

interface UseCarrinhoVendaOptions {
  produtos: Produto[];
  createVenda: (payload: SalePayload) => Promise<VendaResult>;
}

const EMPTY_COMPROVANTE: ComprovanteState = {
  open: false,
  subtitle: '',
  fields: [],
  phone: '',
  recipient: '',
};

export function useCarrinhoVenda({ produtos, createVenda }: UseCarrinhoVendaOptions) {
  const [open, setOpen] = useState(false);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [comprovante, setComprovante] = useState<ComprovanteState>(EMPTY_COMPROVANTE);

  const itemCount = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const subtotal = useMemo(() => calcularSubtotal(carrinho), [carrinho]);

  const addProduto = (produto: Produto) => {
    if (produto.estoque === 0) {
      toast.error('Produto sem estoque.');
      return;
    }

    setCarrinho((current) => {
      const existing = current.find((item) => item.produtoId === produto.id);
      if (!existing) {
        return [
          ...current,
          {
            produtoId: produto.id,
            nomeProduto: produto.nome,
            quantidade: 1,
            precoUnitario: produto.preco,
          },
        ];
      }

      if (existing.quantidade >= produto.estoque) {
        toast.error('Estoque insuficiente.');
        return current;
      }

      return current.map((item) =>
        item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
      );
    });

    toast.success(`${produto.nome} adicionado ao carrinho.`);
  };

  const removeProduto = (produtoId: string) => {
    setCarrinho((current) => current.filter((item) => item.produtoId !== produtoId));
  };

  const updateQuantidade = (produtoId: string, delta: number) => {
    setCarrinho((current) =>
      current.flatMap((item) => {
        if (item.produtoId !== produtoId) return [item];

        const produto = produtos.find((candidate) => candidate.id === produtoId);
        const nextQuantity = item.quantidade + delta;
        if (nextQuantity <= 0) return [];

        if (produto && nextQuantity > produto.estoque) {
          toast.error('Estoque insuficiente.');
          return [item];
        }

        return [{ ...item, quantidade: nextQuantity }];
      }),
    );
  };

  const abrirComprovante = (venda: Venda) => {
    const detalhada = venda as VendaDetalhada;
    setComprovante({
      open: true,
      subtitle: `${venda.compradorNome} • ${venda.data}`,
      fields: buildComprovanteFields(venda),
      phone: detalhada.compradorTelefone || detalhada.recipientPhone || '',
      recipient: venda.compradorNome,
    });
  };

  const finalizarVenda = async (values: VendaCheckoutValues) => {
    if (carrinho.length === 0) {
      toast.error('Carrinho vazio.');
      return false;
    }

    const desconto = calcularDesconto(subtotal, values.descontoTipo, values.descontoInput);
    const total = Math.max(0, subtotal - desconto);
    const timestamp = Date.now();

    const venda: VendaDetalhada = {
      id: `v${timestamp}`,
      data: new Date().toISOString().split('T')[0],
      itens: carrinho,
      subtotal,
      desconto,
      descontoTipo: values.descontoTipo,
      total,
      compradorNome: values.compradorNome.trim(),
      compradorTelefone: values.compradorTelefone.trim(),
      recipientPhone: values.compradorTelefone.trim(),
      formaPagamento: values.formaPagamento,
      observacoes: values.observacoes,
      parcelado: values.parcelado,
      quantidadeParcelas: values.parcelado ? values.parcelas : undefined,
      comprovanteId: `CV-${timestamp}`,
    };

    const result = await createVenda({
      id: venda.id,
      data: venda.data,
      itens: venda.itens,
      compradorNome: venda.compradorNome,
      compradorTelefone: venda.compradorTelefone,
      formaPagamento: venda.formaPagamento,
      observacoes: venda.observacoes,
      parcelado: venda.parcelado,
      quantidadeParcelas: venda.quantidadeParcelas,
      descontoTipo: values.descontoTipo,
      descontoValor: values.descontoInput,
      comprovanteId: venda.comprovanteId,
    });

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível concluir a venda.');
      return false;
    }

    if (result.warnings?.length) toast.warning(result.warnings.join(' | '));

    setCarrinho([]);
    setOpen(false);
    toast.success('Venda realizada com sucesso.');
    abrirComprovante(venda);
    return true;
  };

  return {
    open,
    setOpen,
    carrinho,
    itemCount,
    subtotal,
    comprovante,
    addProduto,
    removeProduto,
    updateQuantidade,
    finalizarVenda,
    abrirComprovante,
    setComprovanteOpen: (nextOpen: boolean) =>
      setComprovante((current) => ({ ...current, open: nextOpen })),
  };
}
