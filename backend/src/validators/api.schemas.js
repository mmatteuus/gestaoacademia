import { z } from 'zod';
import { SHEET_TYPES } from '../config/sheet-config.js';

const sheetTypeSchema = z.enum(SHEET_TYPES);

export const rowsQuerySchema = z.object({
  type: sheetTypeSchema.optional().default('Alunos'),
});

export const rowIdParamsSchema = z.object({
  id: z.string().min(1).max(100),
});

/**
 * Schema genérico para rows.
 * Limita tamanho de chaves e valores para prevenir payloads abusivos.
 * Valores são convertidos para string ou número — objetos aninhados são rejeitados.
 */
const safeValue = z.union([
  z.string().max(5000),
  z.number(),
  z.boolean(),
  z.null(),
]).optional();

export const rowPayloadSchema = z
  .record(
    z.string().min(1).max(100),
    safeValue,
  )
  .refine(
    (obj) => Object.keys(obj).length <= 100,
    { message: 'Too many fields (max 100)' }
  );

export const salesPayloadSchema = z.object({
  id: z.string().max(100).optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  compradorNome: z.string().trim().min(1).max(200),
  compradorTelefone: z.string().max(30).optional(),
  formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia']),
  observacoes: z.string().max(2000).optional(),
  parcelado: z.boolean().optional(),
  quantidadeParcelas: z.number().int().min(2).max(48).optional(),
  descontoTipo: z.enum(['valor', 'percentual']).optional(),
  descontoValor: z.number().min(0).max(999999).optional(),
  itens: z
    .array(
      z.object({
        produtoId: z.string().min(1).max(100),
        quantidade: z.number().int().min(1).max(9999),
      })
    )
    .min(1)
    .max(100),
});

export const paymentPayloadSchema = z.object({
  cobrancaId: z.string().min(1).max(100),
  valorPagamento: z.number().positive().max(9999999),
  formaPagamento: z.enum(['PIX', 'Cartao', 'Dinheiro', 'Transferencia', 'Boleto']),
  observacoes: z.string().max(2000).optional(),
  referencia: z.string().max(200).optional(),
  comprovanteId: z.string().max(200).optional(),
  dataPagamento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const reservationPayloadSchema = z.object({
  id: z.string().max(100).optional(),
  espaco: z.string().trim().min(1).max(200),
  locatario: z.string().trim().min(1).max(200),
  locatarioTelefone: z.string().max(30).optional(),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/),
  valor: z.number().nonnegative().max(9999999),
  status: z.enum(['confirmada', 'pendente', 'cancelada']).optional(),
  observacoes: z.string().max(2000).optional(),
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
