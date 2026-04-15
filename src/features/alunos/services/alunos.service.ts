import type { Aluno } from '@/types';

import { alunos as alunosMock } from '@/services/mocks/data';

export async function listAlunos(): Promise<Aluno[]> {
  // Mock-first: later this can call the API and keep the same interface.
  return alunosMock;
}
