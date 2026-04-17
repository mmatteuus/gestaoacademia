import type { Responsavel } from '@/types';

export type ResponsavelViewModel = Responsavel;

export interface ResponsavelFormValues {
  nome: string;
  telefone: string;
  email?: string;
  observacoes?: string;
}
