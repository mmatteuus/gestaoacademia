import type { Responsavel } from '@/types';

import { responsaveis as responsaveisMock } from '@/services/mocks/data';

export async function listResponsaveis(): Promise<Responsavel[]> {
  return responsaveisMock;
}
