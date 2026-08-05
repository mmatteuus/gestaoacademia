import type { AlunoStatus } from '@/types';

export const CATEGORIAS = ['Infantil', 'Juvenil', 'Adulto'] as const;
export const FAIXAS = ['Branca', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'] as const;
export const NO_RESPONSAVEL_VALUE = '__none__';

export const STATUS_OPTIONS: { label: string; value: AlunoStatus }[] = [
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Inativo', value: 'inativo' },
];
