import { z } from 'zod';

export const frequenciaSchema = z.object({
  data: z.string().min(1, 'Informe a data da aula.'),
});

export type FrequenciaValues = z.infer<typeof frequenciaSchema>;
