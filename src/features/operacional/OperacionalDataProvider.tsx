import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  useCobrancas,
  useProdutos,
  useVendas,
  useReservas,
  useContratosAluguel,
  usePagamentosContrato,
} from '@/services/queries';
import { ApiError } from '@/services/api/client';
import { domainApi, type FinancePaymentPayload, type ReservationPayload, type SalePayload } from '@/services/api/domain';
import type {
  Cobranca,
  ContratoAluguel,
  PagamentoContratoAluguel,
  Produto,
  Reserva,
  Venda,
} from '@/types';

interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
  warnings?: string[];
}

interface OperacionalDataContextValue {
  cobrancasList: Cobranca[];
  produtosList: Produto[];
  vendasList: Venda[];
  reservasList: Reserva[];
  contratosList: ContratoAluguel[];
  pagamentosContratoList: PagamentoContratoAluguel[];
  isLoading: boolean;
  updateCobranca: (cobranca: Cobranca) => Promise<ActionResult<Cobranca>>;
  upsertProduto: (produto: Produto) => Promise<ActionResult<Produto>>;
  createVenda: (venda: SalePayload) => Promise<ActionResult<Record<string, unknown>>>;
  addReserva: (reserva: ReservationPayload) => Promise<ActionResult<Record<string, unknown>>>;
  addPagamentoContrato: (pagamento: PagamentoContratoAluguel) => Promise<ActionResult<PagamentoContratoAluguel>>;
  registrarPagamentoCobranca: (payload: FinancePaymentPayload) => Promise<ActionResult<Record<string, unknown>>>;
}

const OperacionalDataContext = createContext<OperacionalDataContextValue | undefined>(undefined);

function toActionError(error: unknown, fallback: string): ActionResult {
  if (error instanceof ApiError) {
    return { ok: false, message: error.message || fallback };
  }
  return { ok: false, message: fallback };
}

export function OperacionalDataProvider({ children }: { children: ReactNode }) {
  const cobrancas = useCobrancas();
  const produtos = useProdutos();
  const vendas = useVendas();
  const reservas = useReservas();
  const contratos = useContratosAluguel();
  const pagamentosContrato = usePagamentosContrato();

  const cobrancasList = cobrancas.list.data ?? [];
  const produtosList = produtos.list.data ?? [];
  const vendasList = vendas.list.data ?? [];
  const reservasList = reservas.list.data ?? [];
  const contratosList = contratos.list.data ?? [];
  const pagamentosContratoList = pagamentosContrato.list.data ?? [];

  const isLoading =
    cobrancas.list.isLoading ||
    produtos.list.isLoading ||
    vendas.list.isLoading ||
    reservas.list.isLoading ||
    contratos.list.isLoading;

  const updateCobranca = async (cobrancaAtualizada: Cobranca): Promise<ActionResult<Cobranca>> => {
    try {
      await cobrancas.updateAsync({ id: cobrancaAtualizada.id, data: cobrancaAtualizada });
      return { ok: true, data: cobrancaAtualizada };
    } catch (error) {
      return toActionError(error, 'Nao foi possivel atualizar a cobranca.');
    }
  };

  const upsertProduto = async (produto: Produto): Promise<ActionResult<Produto>> => {
    try {
      const exists = produtosList.some((item) => item.id === produto.id);
      if (exists) {
        await produtos.updateAsync({ id: produto.id, data: produto });
      } else {
        await produtos.createAsync(produto);
      }
      return { ok: true, data: produto };
    } catch (error) {
      return toActionError(error, 'Nao foi possivel salvar o produto.');
    }
  };

  const createVenda = async (venda: SalePayload): Promise<ActionResult<Record<string, unknown>>> => {
    try {
      const response = await domainApi.createSale(venda);
      await Promise.all([vendas.invalidate(), produtos.invalidate()]);
      return { ok: true, data: response.data, warnings: response.warnings };
    } catch (error) {
      return toActionError(error, 'Nao foi possivel concluir a venda.');
    }
  };

  const registrarPagamentoCobranca = async (
    payload: FinancePaymentPayload
  ): Promise<ActionResult<Record<string, unknown>>> => {
    try {
      const response = await domainApi.createFinancePayment(payload);
      await cobrancas.invalidate();
      return { ok: true, data: response.data, warnings: response.warnings };
    } catch (error) {
      return toActionError(error, 'Nao foi possivel registrar o pagamento.');
    }
  };

  const addReserva = async (reserva: ReservationPayload): Promise<ActionResult<Record<string, unknown>>> => {
    try {
      const response = await domainApi.createReservation(reserva);
      await reservas.invalidate();
      return { ok: true, data: response.data, warnings: response.warnings };
    } catch (error) {
      return toActionError(error, 'Nao foi possivel criar a reserva.');
    }
  };

  const addPagamentoContrato = async (
    pagamento: PagamentoContratoAluguel
  ): Promise<ActionResult<PagamentoContratoAluguel>> => {
    const contrato = contratosList.find((item) => item.id === pagamento.contratoId);
    if (!contrato) {
      return { ok: false, message: 'Contrato nao encontrado.' };
    }

    try {
      await pagamentosContrato.createAsync(pagamento);
      return { ok: true, data: pagamento };
    } catch (error) {
      return toActionError(error, 'Nao foi possivel registrar o pagamento do contrato.');
    }
  };

  const value = useMemo<OperacionalDataContextValue>(
    () => ({
      cobrancasList,
      produtosList,
      vendasList,
      reservasList,
      contratosList,
      pagamentosContratoList,
      isLoading,
      updateCobranca,
      upsertProduto,
      createVenda,
      addReserva,
      addPagamentoContrato,
      registrarPagamentoCobranca,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      cobrancasList,
      produtosList,
      vendasList,
      reservasList,
      contratosList,
      pagamentosContratoList,
      isLoading,
    ]
  );

  return <OperacionalDataContext.Provider value={value}>{children}</OperacionalDataContext.Provider>;
}

export function useOperacionalData() {
  const context = useContext(OperacionalDataContext);
  if (!context) {
    throw new Error('useOperacionalData deve ser usado dentro de OperacionalDataProvider');
  }
  return context;
}
