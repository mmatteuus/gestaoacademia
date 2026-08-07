import type { AlunoStatus } from '@/types';

export const ALUNOS_PER_PAGE = 6;

export const ALUNO_STATUS_FILTERS: { label: string; value: AlunoStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
];
