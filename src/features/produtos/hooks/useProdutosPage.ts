import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import type { Produto } from '@/types';
import type { ProdutoFormValues } from '../types/produto.types';

export function useProdutosPage() {
  const { produtosList, vendasList, upsertProduto, createVenda } = useOperacionalData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>();

  const metrics = useMemo(
    () => ({
      total: produtosList.length,
      estoqueBaixo: produtosList.filter(
        (produto) => produto.estoque > 0 && produto.estoque <= produto.estoqueMinimo,
      ).length,
      semEstoque: produtosList.filter((produto) => produto.estoque === 0).length,
      receita: vendasList.reduce((total, venda) => total + venda.total, 0),
    }),
    [produtosList, vendasList],
  );

  const openCreateForm = () => {
    setEditingProduto(undefined);
    setFormOpen(true);
  };

  const openEditForm = (produto: Produto) => {
    setEditingProduto(produto);
    setFormOpen(true);
  };

  const submitProduto = async (values: ProdutoFormValues) => {
    const produto: Produto = editingProduto
      ? { ...editingProduto, ...values }
      : {
          id: `p${Date.now()}`,
          ...values,
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
    createVenda,
    metrics,
    formOpen,
    editingProduto,
    setFormOpen,
    openCreateForm,
    openEditForm,
    submitProduto,
  };
}
