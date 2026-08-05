import { z } from 'zod';

export const responsavelRapidoSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome completo.'),
  telefone: z.string().trim().min(8, 'Informe um telefone válido.'),
  email: z.union([z.string().trim().email('Informe um e-mail válido.'), z.literal('')]),
});

export type ResponsavelRapidoValues = z.infer<typeof responsavelRapidoSchema>;
