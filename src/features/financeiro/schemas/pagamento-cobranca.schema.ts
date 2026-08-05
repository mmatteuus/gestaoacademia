import { z } from 'zod';

export const pagamentoCobrancaSchema = z.object({
  valorPagamento: z.coerce.number().positive('Informe um valor maior que zero.'),
  formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia', 'Boleto']),
  observacoes: z.string().trim().max(500, 'Use no máximo 500 caracteres.'),
});

export type PagamentoCobrancaValues = z.infer<typeof pagamentoCobrancaSchema>;
