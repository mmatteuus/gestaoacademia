import type { Produto } from '@/types';

import { produtos as produtosMock } from '@/services/mocks/data';

export async function listProdutos(): Promise<Produto[]> {
  return produtosMock;
}
