import { z } from 'zod';

export const vendaCheckoutSchema = z
  .object({
    compradorNome: z.string().trim().min(2, 'Informe o nome do comprador.'),
    compradorTelefone: z.string().trim(),
    formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia']),
    observacoes: z.string().trim().max(500, 'Use no máximo 500 caracteres.'),
    parcelado: z.boolean(),
    parcelas: z.coerce.number().int().min(2, 'Informe pelo menos duas parcelas.'),
    descontoTipo: z.enum(['valor', 'percentual']),
    descontoInput: z.coerce.number().min(0, 'O desconto não pode ser negativo.'),
  })
  .superRefine((values, context) => {
    if (values.descontoTipo === 'percentual' && values.descontoInput > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['descontoInput'],
        message: 'O desconto percentual não pode ultrapassar 100%.',
      });
    }
  });

export type VendaCheckoutValues = z.infer<typeof vendaCheckoutSchema>;
