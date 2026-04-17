import { z } from 'zod';

export const responsavelSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  telefone: z.string().trim().min(10, 'Telefone inválido').max(20),
  email: z.string().trim().email('Email inválido').max(255).optional().or(z.literal('')),
  observacoes: z.string().max(500).optional(),
});

export type ResponsavelSchema = typeof responsavelSchema;
