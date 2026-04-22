import { getRowById, insertRow, listRows, updateRow } from '../repositories/sheets.repository.js';
import { nowDateIso, normalizePaymentMethod, parseNumber, toIsoDate } from '../lib/normalizers.js';
import { withLock, withLocks } from '../lib/locks.js';

function toMinutes(time) {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + minutes;
}

function overlaps(startA, endA, startB, endB) {
  return startB < endA && endB > startA;
}

function normalizeReservationRow(row) {
  return {
    ...row,
    data_inicio: toIsoDate(row.data_inicio),
    data_fim: toIsoDate(row.data_fim) || toIsoDate(row.data_inicio),
  };
}

function computePaymentStatus({ total, paid, dueDate }) {
  if (paid >= total) return 'paga';
  if (paid > 0) return 'parcial';
  const dueIso = toIsoDate(dueDate);
  if (dueIso && dueIso < nowDateIso()) return 'vencida';
  return 'aberta';
}

export async function executeSale(payload) {
  const saleId = payload.id || `v${Date.now()}`;
  const productLockKeys = (payload.itens || []).map((item) => `product:${item.produtoId}`);

  return withLocks(productLockKeys, async () => {
    const existingSale = await getRowById(saleId, 'Vendas');
    if (existingSale) {
      return {
        ok: true,
        status: 200,
        data: {
          id: saleId,
          total: parseNumber(existingSale.total, 0),
          subtotal: parseNumber(existingSale.subtotal, 0),
          descontoValor: parseNumber(existingSale.desconto_valor, 0),
          descontoTipo: existingSale.desconto_tipo || 'valor',
          itens: [],
        },
        warnings: ['Sale already processed with the same id'],
      };
    }

    const productsRows = await listRows('Produtos');
    const productById = new Map(productsRows.map((row) => [row.id, row]));

    const computedItems = payload.itens.map((item) => {
      const product = productById.get(item.produtoId);
      if (!product) {
        return {
          ...item,
          status: 'missing_product',
        };
      }

      const stock = parseNumber(product.estoque, 0);
      const unitPrice = parseNumber(product.preco, 0);

      if (item.quantidade > stock) {
        return {
          ...item,
          nomeProduto: product.nome,
          precoUnitario: unitPrice,
          status: 'insufficient_stock',
          availableStock: stock,
        };
      }

      return {
        ...item,
        nomeProduto: product.nome,
        precoUnitario: unitPrice,
        status: 'ok',
        previousStock: stock,
        nextStock: stock - item.quantidade,
      };
    });

    const failingItems = computedItems.filter((item) => item.status !== 'ok');
    if (failingItems.length > 0) {
      return {
        ok: false,
        status: 409,
        error: 'operation_failed',
        message: 'Unable to process sale due to inventory constraints',
        details: failingItems,
      };
    }

    const stockUpdates = [];
    const warnings = [];

    try {
      for (const item of computedItems) {
        const updated = await updateRow(item.produtoId, { estoque: item.nextStock }, 'Produtos');
        if (!updated) {
          throw new Error(`Failed to update product stock: ${item.produtoId}`);
        }
        stockUpdates.push(item);
      }

      const subtotal = computedItems.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);
      const descontoTipo = payload.descontoTipo || 'valor';
      const descontoValorBruto = parseNumber(payload.descontoValor, 0);
      const descontoValor =
        descontoTipo === 'percentual'
          ? Math.min(subtotal, subtotal * (descontoValorBruto / 100))
          : Math.min(subtotal, descontoValorBruto);
      const total = Math.max(0, subtotal - descontoValor);

      const insertResult = await insertRow({
        id: saleId,
        sheet_type: 'Vendas',
        data: payload.data || nowDateIso(),
        comprador_nome: payload.compradorNome,
        comprador_telefone: payload.compradorTelefone || '',
        itens: JSON.stringify(
          computedItems.map((item) => ({
            produtoId: item.produtoId,
            nomeProduto: item.nomeProduto,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          }))
        ),
        subtotal,
        desconto_tipo: descontoTipo,
        desconto_valor: descontoValor,
        total,
        forma_pagamento: normalizePaymentMethod(payload.formaPagamento),
        parcelado: String(Boolean(payload.parcelado)),
        quantidade_parcelas: payload.parcelado ? Number(payload.quantidadeParcelas || 2) : '',
        observacoes: payload.observacoes || '',
        comprovante_id: payload.comprovanteId || `CV-${Date.now()}`,
      });

      if (!insertResult?.success) {
        throw new Error('Failed to persist sale');
      }

      return {
        ok: true,
        status: 201,
        data: {
          id: saleId,
          total,
          subtotal,
          descontoValor,
          descontoTipo,
          itens: computedItems,
        },
        warnings,
      };
    } catch (error) {
      for (const applied of [...stockUpdates].reverse()) {
        try {
          await updateRow(applied.produtoId, { estoque: applied.previousStock }, 'Produtos');
        } catch (_rollbackError) {
          warnings.push(`Failed to rollback stock for product ${applied.produtoId}`);
        }
      }

      return {
        ok: false,
        status: 500,
        error: 'operation_failed',
        message: 'Sale processing failed',
        details: {
          reason: error?.message || 'unknown_error',
        },
        warnings,
      };
    }
  });
}

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

export async function createRentalReservation(payload) {
  const reservationId = payload.id || `res${Date.now()}`;
  const reservationLockKey = `reservation:${payload.espaco}`;

  return withLock(reservationLockKey, async () => {
    if (payload.id) {
      const existingReservation = await getRowById(payload.id, 'Reservas');
      if (existingReservation) {
        return {
          ok: true,
          status: 200,
          data: {
            id: payload.id,
            conflito: String(existingReservation.conflito || 'false') === 'true',
            status: existingReservation.status || 'confirmada',
            dataInicio: existingReservation.data_inicio || payload.dataInicio,
            dataFim: existingReservation.data_fim || existingReservation.data_inicio || payload.dataInicio,
            horaInicio: existingReservation.hora_inicio || payload.horaInicio,
            horaFim: existingReservation.hora_fim || payload.horaFim,
          },
          warnings: ['Reservation already processed with the same id'],
        };
      }
    }

    const nextReservation = {
      id: reservationId,
      espaco: payload.espaco,
      locatario: payload.locatario,
      locatario_telefone: payload.locatarioTelefone || '',
      data_inicio: payload.dataInicio,
      data_fim: payload.dataFim || payload.dataInicio,
      hora_inicio: payload.horaInicio,
      hora_fim: payload.horaFim,
      valor: payload.valor,
      status: payload.status || 'confirmada',
      observacoes: payload.observacoes || '',
    };

    const startMinutes = toMinutes(nextReservation.hora_inicio);
    const endMinutes = toMinutes(nextReservation.hora_fim);

    if (startMinutes >= endMinutes) {
      return {
        ok: false,
        status: 400,
        error: 'validation_error',
        message: 'End time must be greater than start time',
      };
    }

    const reservations = (await listRows('Reservas')).map(normalizeReservationRow);
    const newStartDate = nextReservation.data_inicio;
    const newEndDate = nextReservation.data_fim || nextReservation.data_inicio;
    const hasConflict = reservations.some((row) => {
      if (row.espaco !== nextReservation.espaco) return false;
      if (String(row.status || '').toLowerCase() === 'cancelada') return false;

      const rowStartDate = row.data_inicio;
      const rowEndDate = row.data_fim || row.data_inicio;

      // Interseção real de intervalos de datas [rowStart, rowEnd] ∩ [newStart, newEnd]
      const datesOverlap = rowStartDate <= newEndDate && rowEndDate >= newStartDate;
      if (!datesOverlap) return false;

      return overlaps(toMinutes(row.hora_inicio), toMinutes(row.hora_fim), startMinutes, endMinutes);
    });

    const result = await insertRow({
      ...nextReservation,
      conflito: String(hasConflict),
      sheet_type: 'Reservas',
    });

    if (!result?.success) {
      return {
        ok: false,
        status: 500,
        error: 'operation_failed',
        message: 'Failed to create reservation',
      };
    }

    return {
      ok: true,
      status: 201,
      data: {
        id: nextReservation.id,
        conflito: hasConflict,
        status: nextReservation.status,
        dataInicio: nextReservation.data_inicio,
        dataFim: nextReservation.data_fim,
        horaInicio: nextReservation.hora_inicio,
        horaFim: nextReservation.hora_fim,
      },
      warnings: hasConflict ? ['Reservation created with schedule conflict'] : undefined,
    };
  });
}
