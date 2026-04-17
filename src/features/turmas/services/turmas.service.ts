import type { Turma } from '@/types';

import { turmas as turmasMock } from '@/services/mocks/data';

export async function listTurmas(): Promise<Turma[]> {
  return turmasMock;
}
