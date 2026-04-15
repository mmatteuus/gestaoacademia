import { z } from 'zod';

import type { TurmaFormValues } from '../types/turma.types';

export const turmaSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  modalidade: z.string().min(1, 'Modalidade obrigatória'),
  professor: z.string().trim().min(3, 'Professor obrigatório').max(100),
  horario: z.string().trim().min(1, 'Horário obrigatório'),
  diasSemana: z.array(z.string()).min(1, 'Selecione ao menos um dia'),
  capacidade: z.coerce.number().min(1, 'Capacidade mínima: 1').max(100),
});

export type TurmaSchema = typeof turmaSchema;
