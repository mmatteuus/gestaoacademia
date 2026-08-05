import { z } from 'zod';

export const reservaAluguelSchema = z.object({
  locatario: z.string().trim().min(2, 'Informe o nome do locatário.'),
  locatarioTelefone: z.string().trim(),
  espaco: z.enum(['Tatame Principal', 'Área de Musculação', 'Sala Multiuso']),
  dataInicio: z.string().min(1, 'Informe a data.'),
  horaInicio: z.string().min(1, 'Informe a hora inicial.'),
  horaFim: z.string().min(1, 'Informe a hora final.'),
  valor: z.coerce.number().positive('Informe um valor maior que zero.'),
});

export type ReservaAluguelValues = z.infer<typeof reservaAluguelSchema>;
