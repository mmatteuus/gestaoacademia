import {
  getRowById,
  insertRow,
  listRows,
  updateRow,
} from '../../repositories/sheets.repository.js';
import {
  normalizePaymentMethod,
  nowDateIso,
  parseNumber,
} from '../../lib/normalizers.js';
import { withLocks } from '../../lib/locks.js';

function computeSaleItems(items, productById) {
  return items.map((item) => {
    const product = productById.get(item.produtoId);
    if (!product) return { ...item, status: 'missing_product' };

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
}

function calculateTotals(items, payload) {
  const subtotal = items.reduce(
    (total, item) => total + item.precoUnitario * item.quantidade,
    0,
  );
  const descontoTipo = payload.descontoTipo || 'valor';
  const descontoValorBruto = parseNumber(payload.descontoValor, 0);
  const descontoValor = descontoTipo === 'percentual'
    ? Math.min(subtotal, subtotal * (descontoValorBruto / 100))
    : Math.min(subtotal, descontoValorBruto);

  return {
    subtotal,
    descontoTipo,
    descontoValor,
    total: Math.max(0, subtotal - descontoValor),
  };
}

function toStoredItems(items) {
  return items.map((item) => ({
    produtoId: item.produtoId,
    nomeProduto: item.nomeProduto,
    quantidade: item.quantidade,
    precoUnitario: item.precoUnitario,
  }));
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

    const productRows = await listRows('Produtos');
    const productById = new Map(productRows.map((row) => [row.id, row]));
    const computedItems = computeSaleItems(payload.itens, productById);
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
        if (!updated) throw new Error(`Failed to update product stock: ${item.produtoId}`);
        stockUpdates.push(item);
      }

      const totals = calculateTotals(computedItems, payload);
      const insertResult = await insertRow({
        id: saleId,
        sheet_type: 'Vendas',
        data: payload.data || nowDateIso(),
        comprador_nome: payload.compradorNome,
        comprador_telefone: payload.compradorTelefone || '',
        itens: JSON.stringify(toStoredItems(computedItems)),
        subtotal: totals.subtotal,
        desconto_tipo: totals.descontoTipo,
        desconto_valor: totals.descontoValor,
        total: totals.total,
        forma_pagamento: normalizePaymentMethod(payload.formaPagamento),
        parcelado: String(Boolean(payload.parcelado)),
        quantidade_parcelas: payload.parcelado ? Number(payload.quantidadeParcelas || 2) : '',
        observacoes: payload.observacoes || '',
        comprovante_id: payload.comprovanteId || `CV-${Date.now()}`,
      });

      if (!insertResult?.success) throw new Error('Failed to persist sale');

      return {
        ok: true,
        status: 201,
        data: {
          id: saleId,
          total: totals.total,
          subtotal: totals.subtotal,
          descontoValor: totals.descontoValor,
          descontoTipo: totals.descontoTipo,
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
        details: { reason: error?.message || 'unknown_error' },
        warnings,
      };
    }
  });
}
