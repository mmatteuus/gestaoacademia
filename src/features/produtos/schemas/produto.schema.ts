import { z } from 'zod';

import type { ProdutoFormValues } from '../types/produto.types';

export const produtoSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  descricao: z.string().max(500).optional(),
  preco: z.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  estoque: z.coerce.number().int().min(0, 'Estoque não pode ser negativo'),
  estoqueMinimo: z.coerce.number().int().min(0, 'Estoque mínimo não pode ser negativo'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
});

export type ProdutoSchema = typeof produtoSchema;
