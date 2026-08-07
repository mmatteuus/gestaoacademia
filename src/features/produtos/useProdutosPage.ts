import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import type { FormaPagamento, Produto, Venda } from '@/types';

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
  descontoTipo?: 'valor' | 'percentual';
  recipientPhone?: string;
};

export const FORMAS_PAGAMENTO: Exclude<FormaPagamento, 'Boleto'>[] = [
  'PIX',
  'Cartao',
  'Dinheiro',
  'Transferencia',
];

export function useProdutosPage() {
  const { produtosList, vendasList, upsertProduto, createVenda } = useOperacionalData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>();
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [compradorNome, setCompradorNome] = useState('');
  const [compradorTelefone, setCompradorTelefone] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<Exclude<FormaPagamento, 'Boleto'>>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [parcelado, setParcelado] = useState(false);
  const [parcelas, setParcelas] = useState('2');
  const [descontoTipo, setDescontoTipo] = useState<'valor' | 'percentual'>('valor');
  const [descontoInput, setDescontoInput] = useState('0');
  const [comprovanteOpen, setComprovanteOpen] = useState(false);
  const [comprovanteFields, setComprovanteFields] = useState<{ label: string; value: string }[]>([]);
  const [comprovanteSubtitle, setComprovanteSubtitle] = useState('');
  const [comprovantePhone, setComprovantePhone] = useState('');
  const [comprovanteRecipient, setComprovanteRecipient] = useState('');

  const subtotalCarrinho = useMemo(
    () => carrinho.reduce((soma, item) => soma + item.quantidade * item.precoUnitario, 0),
    [carrinho],
  );
  const descontoCalculado = useMemo(() => {
    const valorBruto = Number(descontoInput || 0);
    if (Number.isNaN(valorBruto) || valorBruto <= 0) return 0;
    if (descontoTipo === 'percentual') {
      return Math.min(subtotalCarrinho, subtotalCarrinho * (valorBruto / 100));
    }
    return Math.min(subtotalCarrinho, valorBruto);
  }, [descontoInput, descontoTipo, subtotalCarrinho]);
  const totalCarrinho = Math.max(0, subtotalCarrinho - descontoCalculado);
  const estoqueBaixo = produtosList.filter((produto) => produto.estoque <= produto.estoqueMinimo && produto.estoque > 0).length;
  const semEstoque = produtosList.filter((produto) => produto.estoque === 0).length;
  const receitaVendas = vendasList.reduce((soma, venda) => soma + venda.total, 0);

  const openCreate = () => {
    setEditingProduto(undefined);
    setFormOpen(true);
  };
  const openEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormOpen(true);
  };
  const saveProduto = async (data: Partial<Produto>) => {
    const produto: Produto = editingProduto
      ? { ...editingProduto, ...data }
      : {
          id: `p${Date.now()}`,
          nome: data.nome || 'Novo produto',
          descricao: data.descricao || '',
          preco: data.preco || 0,
          estoque: data.estoque || 0,
          estoqueMinimo: data.estoqueMinimo || 0,
          categoria: data.categoria || 'Geral',
        };
    const result = await upsertProduto(produto);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível salvar o produto.');
      return;
    }
    toast.success(editingProduto ? 'Produto atualizado.' : 'Produto cadastrado.');
    setFormOpen(false);
  };

  const openReceipt = (venda: Venda) => {
    const detalhada = venda as VendaDetalhada;
    setComprovanteSubtitle(`${venda.compradorNome} • ${venda.data}`);
    setComprovanteFields([
      { label: 'Comprador', value: venda.compradorNome },
      { label: 'Telefone', value: detalhada.compradorTelefone || 'Não informado' },
      { label: 'Itens', value: venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ') },
      { label: 'Subtotal', value: `R$ ${(detalhada.subtotal ?? venda.total).toFixed(2)}` },
      { label: 'Desconto aplicado', value: `R$ ${(detalhada.desconto ?? 0).toFixed(2)}` },
      { label: 'Total', value: `R$ ${venda.total.toFixed(2)}` },
      { label: 'Forma de pagamento', value: venda.formaPagamento },
      { label: 'Parcelado', value: venda.parcelado ? `Sim • ${venda.quantidadeParcelas || 1}x` : 'Não' },
      { label: 'Observações', value: venda.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: venda.comprovanteId || 'Não gerado' },
    ]);
    setComprovantePhone(detalhada.compradorTelefone || detalhada.recipientPhone || '');
    setComprovanteRecipient(venda.compradorNome);
    setComprovanteOpen(true);
  };

  const addToCarrinho = (produto: Produto) => {
    if (produto.estoque === 0) return toast.error('Produto sem estoque');
    setCarrinho((atual) => {
      const existente = atual.find((item) => item.produtoId === produto.id);
      if (!existente) {
        return [...atual, { produtoId: produto.id, nomeProduto: produto.nome, quantidade: 1, precoUnitario: produto.preco }];
      }
      if (existente.quantidade >= produto.estoque) {
        toast.error('Estoque insuficiente');
        return atual;
      }
      return atual.map((item) => item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
    });
  };

  const updateQty = (produtoId: string, delta: number) => {
    setCarrinho((atual) => atual.flatMap((item) => {
      if (item.produtoId !== produtoId) return [item];
      const produto = produtosList.find((product) => product.id === produtoId);
      const quantidade = item.quantidade + delta;
      if (quantidade <= 0) return [];
      if (produto && quantidade > produto.estoque) {
        toast.error('Estoque insuficiente');
        return [item];
      }
      return [{ ...item, quantidade }];
    }));
  };

  const resetVenda = () => {
    setCarrinho([]);
    setCompradorNome('');
    setCompradorTelefone('');
    setFormaPagamento('PIX');
    setObservacoes('');
    setParcelado(false);
    setParcelas('2');
    setDescontoTipo('valor');
    setDescontoInput('0');
    setCarrinhoOpen(false);
  };

  const finalizarVenda = async () => {
    if (carrinho.length === 0) return toast.error('Carrinho vazio');
    if (!compradorNome.trim()) return toast.error('Informe o nome do comprador');
    if (parcelado && Number(parcelas) < 2) return toast.error('Informe pelo menos 2 parcelas');

    const id = `v${Date.now()}`;
    const comprovanteId = `CV-${Date.now()}`;
    const result = await createVenda({
      id,
      data: new Date().toISOString().split('T')[0],
      itens: carrinho,
      compradorNome: compradorNome.trim(),
      compradorTelefone: compradorTelefone.trim(),
      formaPagamento,
      observacoes,
      parcelado,
      quantidadeParcelas: parcelado ? Number(parcelas) : undefined,
      descontoTipo,
      descontoValor: descontoTipo === 'percentual' ? Number(descontoInput || 0) : descontoCalculado,
      comprovanteId,
    });
    if (!result.ok) return toast.error(result.message || 'Não foi possível concluir a venda.');
    if (result.warnings?.length) toast.warning(result.warnings.join(' | '));

    const venda: VendaDetalhada = {
      id,
      data: new Date().toISOString().split('T')[0],
      itens: carrinho,
      subtotal: subtotalCarrinho,
      desconto: descontoCalculado,
      descontoTipo,
      total: totalCarrinho,
      compradorNome: compradorNome.trim(),
      compradorTelefone: compradorTelefone.trim(),
      recipientPhone: compradorTelefone.trim(),
      formaPagamento,
      observacoes,
      parcelado,
      quantidadeParcelas: parcelado ? Number(parcelas) : undefined,
      comprovanteId,
    };
    resetVenda();
    toast.success('Venda realizada com sucesso!');
    openReceipt(venda);
  };

  return {
    produtosList, vendasList, estoqueBaixo, semEstoque, receitaVendas,
    formOpen, setFormOpen, editingProduto, openCreate, openEdit, saveProduto,
    carrinhoOpen, setCarrinhoOpen, carrinho, addToCarrinho,
    removeFromCarrinho: (id: string) => setCarrinho((items) => items.filter((item) => item.produtoId !== id)),
    updateQty, compradorNome, setCompradorNome, compradorTelefone, setCompradorTelefone,
    formaPagamento, setFormaPagamento, observacoes, setObservacoes, parcelado, setParcelado,
    parcelas, setParcelas, descontoTipo, setDescontoTipo, descontoInput, setDescontoInput,
    subtotalCarrinho, descontoCalculado, totalCarrinho, finalizarVenda,
    comprovanteOpen, setComprovanteOpen, comprovanteFields, comprovanteSubtitle,
    comprovantePhone, comprovanteRecipient, openReceipt,
  };
}
