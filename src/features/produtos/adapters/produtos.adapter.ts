import type { ProdutoFormValues } from '../types/produto.types';

export function fromFormToProdutoCreate(values: ProdutoFormValues) {
  return {
    nome: values.nome,
    descricao: values.descricao || '',
    preco: values.preco,
    estoque: values.estoque,
    estoqueMinimo: values.estoqueMinimo,
    categoria: values.categoria,
  };
}
