import { z } from 'zod';

export const regraGraduacaoSchema = z.object({
  id: z.string(),
  modalidade: z.enum(['Jiu-Jitsu', 'Karate', 'Judo', 'Muay Thai']),
  categoria: z.enum(['Infantil', 'Juvenil', 'Adulto']),
  faixaOrigem: z.string().trim().min(1, 'Informe a faixa de origem.'),
  faixaDestino: z.string().trim().min(1, 'Informe a faixa de destino.'),
  aulasMinimas: z.coerce.number().int().min(0, 'Use um valor igual ou maior que zero.'),
  mesesMinimos: z.coerce.number().int().min(0, 'Use um valor igual ou maior que zero.'),
});

export type RegraGraduacaoValues = z.infer<typeof regraGraduacaoSchema>;
