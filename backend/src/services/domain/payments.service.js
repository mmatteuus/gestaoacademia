import { getRowById, updateRow } from '../../repositories/sheets.repository.js';
import {
  normalizePaymentMethod,
  nowDateIso,
  parseNumber,
} from '../../lib/normalizers.js';
import { withLock } from '../../lib/locks.js';
import { computePaymentStatus } from './domain.utils.js';

export async function registerFinancePayment(payload) {
  return withLock(`finance:${payload.cobrancaId}`, async () => {
    const cobranca = await getRowById(payload.cobrancaId, 'Financeiro');
    if (!cobranca) {
      return {
        ok: false,
        status: 404,
        error: 'operation_failed',
        message: 'Billing entry not found',
      };
    }

    const total = parseNumber(cobranca.valor, 0);
    const paid = parseNumber(cobranca.valor_pago, 0);
    const delta = parseNumber(payload.valorPagamento, 0);
    const comprovanteId = payload.comprovanteId || '';

    if (comprovanteId && comprovanteId === String(cobranca.comprovante_id || '')) {
      return {
        ok: true,
        status: 200,
        data: {
          id: payload.cobrancaId,
          valorPago: paid,
          status: computePaymentStatus({ total, paid, dueDate: cobranca.data_vencimento }),
          valorTotal: total,
          restante: Math.max(0, total - paid),
          formaPagamento: cobranca.forma_pagamento || normalizePaymentMethod(payload.formaPagamento),
          dataPagamento: cobranca.data_pagamento || payload.dataPagamento || nowDateIso(),
          comprovanteId,
        },
        warnings: ['Payment already processed with the same receipt id'],
      };
    }

    if (delta <= 0) {
      return {
        ok: false,
        status: 400,
        error: 'validation_error',
        message: 'Payment amount must be positive',
      };
    }

    if (paid + delta > total) {
      return {
        ok: false,
        status: 409,
        error: 'operation_failed',
        message: `Payment exceeds remaining amount (${(total - paid).toFixed(2)})`,
      };
    }

    const nextPaid = paid + delta;
    const nextStatus = computePaymentStatus({
      total,
      paid: nextPaid,
      dueDate: cobranca.data_vencimento,
    });
    const patch = {
      valor_pago: nextPaid,
      status: nextStatus,
      data_pagamento: payload.dataPagamento || nowDateIso(),
      forma_pagamento: normalizePaymentMethod(payload.formaPagamento),
      observacoes: payload.observacoes || cobranca.observacoes || '',
      comprovante_id: comprovanteId || `CP-${Date.now()}`,
      referencia: payload.referencia || '',
    };

    const updated = await updateRow(payload.cobrancaId, patch, 'Financeiro');
    if (!updated) {
      return {
        ok: false,
        status: 500,
        error: 'operation_failed',
        message: 'Failed to update billing entry',
      };
    }

    return {
      ok: true,
      status: 200,
      data: {
        id: payload.cobrancaId,
        valorPago: nextPaid,
        status: nextStatus,
        valorTotal: total,
        restante: Math.max(0, total - nextPaid),
        formaPagamento: patch.forma_pagamento,
        dataPagamento: patch.data_pagamento,
        comprovanteId: patch.comprovante_id,
      },
    };
  });
}
