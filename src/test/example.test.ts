import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { domainApi } from '@/services/api/domain';
import { ApiError } from '@/services/api/client';

describe('domainApi critical flows', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('calls /api/sales and returns successful payload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => JSON.stringify({ ok: true, data: { id: 'v1' } }),
    } as unknown as Response);

    const response = await domainApi.createSale({
      compradorNome: 'Cliente',
      formaPagamento: 'PIX',
      itens: [{ produtoId: 'p1', quantidade: 1 }],
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/sales'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(response.ok).toBe(true);
    expect(response.data).toEqual({ id: 'v1' });
  });

  it('throws ApiError when finance payment endpoint fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      text: async () => JSON.stringify({ error: 'operation_failed', message: 'conflict' }),
    } as unknown as Response);

    await expect(
      domainApi.createFinancePayment({
        cobrancaId: 'c1',
        valorPagamento: 10,
        formaPagamento: 'PIX',
      })
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('calls reservation endpoint with ISO dates', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => JSON.stringify({ ok: true, data: { id: 'r1', conflito: false } }),
    } as unknown as Response);

    const response = await domainApi.createReservation({
      espaco: 'Tatame Principal',
      locatario: 'Cliente',
      dataInicio: '2026-04-01',
      horaInicio: '18:00',
      horaFim: '19:00',
      valor: 100,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/rentals/reservations'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(response.data).toEqual({ id: 'r1', conflito: false });
  });
});
