import type { Produto } from '@/types';

export type ProdutoViewModel = Produto;

export interface ProdutoFormValues {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoria: string;
}
