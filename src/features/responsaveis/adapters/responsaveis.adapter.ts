import type { Responsavel } from '@/types';

import type { ResponsavelFormValues } from '../types/responsavel.types';

export function fromFormToResponsavelCreate(values: ResponsavelFormValues): Omit<Responsavel, 'id' | 'alunoIds' | 'cpf'> {
  return {
    nome: values.nome,
    telefone: values.telefone,
    // Keep empty -> '' to match current in-app type; future DTO will use null.
    email: values.email?.trim() || '',
  };
}
