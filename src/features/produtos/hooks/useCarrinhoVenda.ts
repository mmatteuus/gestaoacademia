import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { SalePayload } from '@/services/api/domain';
import type { Produto } from '@/types';
import type {
  CarrinhoItem,
  DescontoTipo,
  FormaPagamentoVenda,
  VendaDetalhada,
} from '../produtos.types';

type CreateVenda = (
  venda: SalePayload,
) => Promise<{ ok: boolean; message?: string; warnings?: string[] }>;

interface UseCarrinhoVendaOptions {
  produtosList: Produto[];
  createVenda: CreateVenda;
  onSaleCompleted: (venda: VendaDetalhada) => void;
}

export function useCarrinhoVenda({
  produtosList,
  createVenda,
  onSaleCompleted,
}: UseCarrinhoVendaOptions) {
  const [open, setOpen] = useState(false);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [compradorNome, setCompradorNome] = useState('');
  const [compradorTelefone, setCompradorTelefone] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoVenda>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [parcelado, setParcelado] = useState(false);
  const [parcelas, setParcelas] = useState('2');
  const [descontoTipo, setDescontoTipo] = useState<DescontoTipo>('valor');
  const [descontoInput, setDescontoInput] = useState('0');

  const subtotal = useMemo(
    () => carrinho.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0),
    [carrinho],
  );
  const desconto = useMemo(() => {
    const rawValue = Number(descontoInput || 0);
    if (Number.isNaN(rawValue) || rawValue <= 0) return 0;
    return descontoTipo === 'percentual'
      ? Math.min(subtotal, subtotal * (rawValue / 100))
      : Math.min(subtotal, rawValue);
  }, [descontoInput, descontoTipo, subtotal]);
  const total = Math.max(0, subtotal - desconto);
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

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
        item.produtoId === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item,
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
        const produto = produtosList.find((candidate) => candidate.id === produtoId);
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

  const reset = () => {
    setCarrinho([]);
    setCompradorNome('');
    setCompradorTelefone('');
    setFormaPagamento('PIX');
    setObservacoes('');
    setParcelado(false);
    setParcelas('2');
    setDescontoTipo('valor');
    setDescontoInput('0');
  };

  const finalizarVenda = async () => {
    if (carrinho.length === 0) return toast.error('Carrinho vazio.');
    if (!compradorNome.trim()) return toast.error('Informe o nome do comprador.');
    if (parcelado && Number(parcelas) < 2) return toast.error('Informe pelo menos 2 parcelas.');

    const venda: VendaDetalhada = {
      id: `v${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      itens: carrinho,
      subtotal,
      desconto,
      descontoTipo,
      total,
      compradorNome: compradorNome.trim(),
      compradorTelefone: compradorTelefone.trim(),
      recipientPhone: compradorTelefone.trim(),
      formaPagamento,
      observacoes,
      parcelado,
      quantidadeParcelas: parcelado ? Number(parcelas) : undefined,
      comprovanteId: `CV-${Date.now()}`,
    };

    const result = await createVenda({
      id: venda.id,
      data: venda.data,
      itens: venda.itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        nomeProduto: item.nomeProduto,
        precoUnitario: item.precoUnitario,
      })),
      compradorNome: venda.compradorNome,
      compradorTelefone: venda.compradorTelefone,
      formaPagamento: venda.formaPagamento,
      observacoes: venda.observacoes,
      parcelado: venda.parcelado,
      quantidadeParcelas: venda.quantidadeParcelas,
      descontoTipo,
      descontoValor: descontoTipo === 'percentual' ? Number(descontoInput || 0) : desconto,
      comprovanteId: venda.comprovanteId,
    });

    if (!result.ok) return toast.error(result.message || 'Não foi possível concluir a venda.');
    if (result.warnings?.length) toast.warning(result.warnings.join(' | '));

    reset();
    setOpen(false);
    toast.success('Venda realizada com sucesso!');
    onSaleCompleted(venda);
  };

  return {
    open,
    carrinho,
    compradorNome,
    compradorTelefone,
    formaPagamento,
    observacoes,
    parcelado,
    parcelas,
    descontoTipo,
    descontoInput,
    subtotal,
    desconto,
    total,
    totalItens,
    setOpen,
    setCompradorNome,
    setCompradorTelefone,
    setFormaPagamento,
    setObservacoes,
    setParcelado,
    setParcelas,
    setDescontoTipo,
    setDescontoInput,
    addProduto,
    removeProduto,
    updateQuantidade,
    finalizarVenda,
  };
}

export type CarrinhoVendaState = ReturnType<typeof useCarrinhoVenda>;
