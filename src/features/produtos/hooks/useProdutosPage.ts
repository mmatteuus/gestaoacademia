import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import type { Produto } from '@/types';
import type { VendaDetalhada } from '../produtos.types';
import { useCarrinhoVenda } from './useCarrinhoVenda';

export function useProdutosPage() {
  const { produtosList, vendasList, upsertProduto, createVenda } = useOperacionalData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto>();
  const [comprovanteVenda, setComprovanteVenda] = useState<VendaDetalhada | null>(null);
  const cart = useCarrinhoVenda({
    produtosList,
    createVenda,
    onSaleCompleted: setComprovanteVenda,
  });

  const kpis = useMemo(() => ({
    totalProdutos: produtosList.length,
    estoqueBaixo: produtosList.filter(
      (produto) => produto.estoque <= produto.estoqueMinimo && produto.estoque > 0,
    ).length,
    semEstoque: produtosList.filter((produto) => produto.estoque === 0).length,
    receitaVendas: vendasList.reduce((sum, venda) => sum + venda.total, 0),
  }), [produtosList, vendasList]);

  const openCreateForm = () => {
    setEditingProduto(undefined);
    setFormOpen(true);
  };

  const openEditForm = (produto: Produto) => {
    setEditingProduto(produto);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Produto>) => {
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

  return {
    produtosList,
    vendasList,
    kpis,
    formOpen,
    editingProduto,
    comprovanteVenda,
    cart,
    setFormOpen,
    setComprovanteVenda,
    openCreateForm,
    openEditForm,
    handleFormSubmit,
  };
}
