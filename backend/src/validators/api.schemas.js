import { z } from 'zod';
import { SHEET_TYPES } from '../config/sheet-config.js';

const sheetTypeSchema = z.enum(SHEET_TYPES);

export const rowsQuerySchema = z.object({
  type: sheetTypeSchema.optional().default('Alunos'),
});

export const rowIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const rowPayloadSchema = z.record(z.string(), z.unknown());

export const salesPayloadSchema = z.object({
  id: z.string().optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  compradorNome: z.string().min(1),
  compradorTelefone: z.string().optional(),
  formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia']),
  observacoes: z.string().optional(),
  parcelado: z.boolean().optional(),
  quantidadeParcelas: z.number().int().min(2).max(48).optional(),
  descontoTipo: z.enum(['valor', 'percentual']).optional(),
  descontoValor: z.number().min(0).optional(),
  itens: z
    .array(
      z.object({
        produtoId: z.string().min(1),
        quantidade: z.number().int().min(1),
      })
    )
    .min(1),
});

export const paymentPayloadSchema = z.object({
  cobrancaId: z.string().min(1),
  valorPagamento: z.number().positive(),
  formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia', 'Boleto']),
  observacoes: z.string().optional(),
  referencia: z.string().optional(),
  comprovanteId: z.string().optional(),
  dataPagamento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const reservationPayloadSchema = z.object({
  id: z.string().optional(),
  espaco: z.string().min(1),
  locatario: z.string().min(1),
  locatarioTelefone: z.string().optional(),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/),
  valor: z.number().nonnegative(),
  status: z.enum(['confirmada', 'pendente', 'cancelada']).optional(),
  observacoes: z.string().optional(),
});

export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    return {
      ok: false,
      details: result.error.flatten(),
    };
  }
  return {
    ok: true,
    data: result.data,
  };
}
