import { z } from 'zod';

export const pagamentoContratoSchema = z.object({
  recipientPhone: z.string().trim(),
  valor: z.coerce.number().positive('Informe um valor maior que zero.'),
  formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia']),
  referencia: z.string().trim().min(2, 'Informe a referência do pagamento.'),
  observacoes: z.string().trim().max(500, 'Use no máximo 500 caracteres.'),
});

export type PagamentoContratoValues = z.infer<typeof pagamentoContratoSchema>;
