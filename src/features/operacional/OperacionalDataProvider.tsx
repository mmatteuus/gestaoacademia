import type { ReactNode } from 'react';
import { domainApi, type FinancePaymentPayload, type ReservationPayload, type SalePayload } from '@/services/api/domain';
import {
  useCobrancas,
  useContratosAluguel,
  usePagamentosContrato,
  useProdutos,
  useReservas,
  useVendas,
} from '@/services/queries';
import type { Cobranca, PagamentoContratoAluguel, Produto } from '@/types';
import { OperacionalDataContext } from './operacional.context';
import type { ActionResult, OperacionalDataContextValue } from './operacional.types';
import { toActionError } from './operacional.utils';

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
  const isLoading = [cobrancas, produtos, vendas, reservas, contratos, pagamentosContrato]
    .some((query) => query.list.isLoading);

  const updateCobranca = async (cobranca: Cobranca): Promise<ActionResult<Cobranca>> => {
    try {
      await cobrancas.updateAsync({ id: cobranca.id, data: cobranca });
      return { ok: true, data: cobranca };
    } catch (error) {
      return toActionError(error, 'Não foi possível atualizar a cobrança.');
    }
  };

  const upsertProduto = async (produto: Produto): Promise<ActionResult<Produto>> => {
    try {
      const exists = produtosList.some((item) => item.id === produto.id);
      if (exists) await produtos.updateAsync({ id: produto.id, data: produto });
      else await produtos.createAsync(produto);
      return { ok: true, data: produto };
    } catch (error) {
      return toActionError(error, 'Não foi possível salvar o produto.');
    }
  };

  const createVenda = async (venda: SalePayload) => {
    try {
      const response = await domainApi.createSale(venda);
      await Promise.all([vendas.invalidate(), produtos.invalidate()]);
      return { ok: true, data: response.data, warnings: response.warnings };
    } catch (error) {
      return toActionError(error, 'Não foi possível concluir a venda.');
    }
  };

  const registrarPagamentoCobranca = async (payload: FinancePaymentPayload) => {
    try {
      const response = await domainApi.createFinancePayment(payload);
      await cobrancas.invalidate();
      return { ok: true, data: response.data, warnings: response.warnings };
    } catch (error) {
      return toActionError(error, 'Não foi possível registrar o pagamento.');
    }
  };

  const addReserva = async (reserva: ReservationPayload) => {
    try {
      const response = await domainApi.createReservation(reserva);
      await reservas.invalidate();
      return { ok: true, data: response.data, warnings: response.warnings };
    } catch (error) {
      return toActionError(error, 'Não foi possível criar a reserva.');
    }
  };

  const addPagamentoContrato = async (pagamento: PagamentoContratoAluguel) => {
    const contrato = contratosList.find((item) => item.id === pagamento.contratoId);
    if (!contrato) return { ok: false, message: 'Contrato não encontrado.' };

    try {
      await pagamentosContrato.createAsync(pagamento);
      return { ok: true, data: pagamento };
    } catch (error) {
      return toActionError(error, 'Não foi possível registrar o pagamento do contrato.');
    }
  };

  const value: OperacionalDataContextValue = {
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
  };

  return <OperacionalDataContext.Provider value={value}>{children}</OperacionalDataContext.Provider>;
}

export { useOperacionalData } from './operacional.context';
