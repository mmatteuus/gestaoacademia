import { beforeEach, describe, expect, it, vi } from 'vitest';

const listRowsMock = vi.fn();
const getRowByIdMock = vi.fn();
const insertRowMock = vi.fn();
const updateRowMock = vi.fn();

vi.mock('./backend/src/repositories/sheets.repository.js', () => ({
  listRows: listRowsMock,
  getRowById: getRowByIdMock,
  insertRow: insertRowMock,
  updateRow: updateRowMock,
}));

const { executeSale, registerFinancePayment, createRentalReservation } = await import('./backend/src/services/domain.service.js');

describe('Domain services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects sale when stock is insufficient', async () => {
    listRowsMock.mockResolvedValue([
      { id: 'p1', nome: 'Kimono', estoque: '1', preco: '150' },
    ]);

    const result = await executeSale({
      compradorNome: 'Cliente',
      formaPagamento: 'PIX',
      itens: [{ produtoId: 'p1', quantidade: 2 }],
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(409);
    expect(insertRowMock).not.toHaveBeenCalled();
  });

  it('creates sale and updates stock when data is valid', async () => {
    listRowsMock.mockResolvedValue([
      { id: 'p1', nome: 'Kimono', estoque: '5', preco: '100' },
    ]);
    updateRowMock.mockResolvedValue({ success: true });
    insertRowMock.mockResolvedValue({ success: true });

    const result = await executeSale({
      id: 'v1',
      compradorNome: 'Cliente',
      formaPagamento: 'Cartao',
      itens: [{ produtoId: 'p1', quantidade: 2 }],
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(201);
    expect(updateRowMock).toHaveBeenCalledWith('p1', { estoque: 3 }, 'Produtos');
    expect(insertRowMock).toHaveBeenCalled();
  });

  it('updates payment status based on amount paid', async () => {
    getRowByIdMock.mockResolvedValue({
      id: 'c1',
      valor: '100',
      valor_pago: '20',
      data_vencimento: '2099-12-31',
      observacoes: '',
    });
    updateRowMock.mockResolvedValue({ success: true });

    const result = await registerFinancePayment({
      cobrancaId: 'c1',
      valorPagamento: 30,
      formaPagamento: 'PIX',
    });

    expect(result.ok).toBe(true);
    expect(result.data.status).toBe('parcial');
    expect(updateRowMock).toHaveBeenCalled();
  });

  it('flags reservation conflicts deterministically', async () => {
    listRowsMock.mockResolvedValue([
      {
        id: 'r1',
        espaco: 'Tatame Principal',
        data_inicio: '2026-01-10',
        data_fim: '2026-01-10',
        hora_inicio: '18:00',
        hora_fim: '20:00',
      },
    ]);
    insertRowMock.mockResolvedValue({ success: true });

    const result = await createRentalReservation({
      espaco: 'Tatame Principal',
      locatario: 'Cliente B',
      dataInicio: '2026-01-10',
      horaInicio: '19:00',
      horaFim: '21:00',
      valor: 300,
    });

    expect(result.ok).toBe(true);
    expect(result.data.conflito).toBe(true);
    expect(insertRowMock).toHaveBeenCalled();
  });
});
