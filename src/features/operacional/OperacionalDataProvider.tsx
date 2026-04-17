import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  useCobrancas,
  useProdutos,
  useVendas,
  useReservas,
  useContratosAluguel,
  usePagamentosContrato,
} from '@/services/queries';
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
}

interface OperacionalDataContextValue {
  cobrancasList: Cobranca[];
  produtosList: Produto[];
  vendasList: Venda[];
  reservasList: Reserva[];
  contratosList: ContratoAluguel[];
  pagamentosContratoList: PagamentoContratoAluguel[];
  isLoading: boolean;
  updateCobranca: (cobranca: Cobranca) => void;
  upsertProduto: (produto: Produto) => void;
  createVenda: (venda: Venda) => ActionResult;
  addReserva: (reserva: Reserva) => ActionResult<Reserva>;
  addPagamentoContrato: (pagamento: PagamentoContratoAluguel) => ActionResult;
}

const OperacionalDataContext = createContext<OperacionalDataContextValue | undefined>(undefined);

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
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

  const updateCobranca = (cobrancaAtualizada: Cobranca) => {
    cobrancas.update.mutate({ id: cobrancaAtualizada.id, data: cobrancaAtualizada });
  };

  const upsertProduto = (produto: Produto) => {
    const exists = produtosList.some((item) => item.id === produto.id);
    if (exists) {
      produtos.update.mutate({ id: produto.id, data: produto });
    } else {
      produtos.create.mutate(produto);
    }
  };

  const createVenda = (venda: Venda): ActionResult => {
    for (const item of venda.itens) {
      const produto = produtosList.find((product) => product.id === item.produtoId);
      if (!produto) {
        return { ok: false, message: `Produto ${item.nomeProduto} não encontrado.` };
      }
      if (item.quantidade > produto.estoque) {
        return { ok: false, message: `Estoque insuficiente para ${produto.nome}.` };
      }
    }

    vendas.create.mutate(venda);

    for (const item of venda.itens) {
      const produto = produtosList.find((p) => p.id === item.produtoId);
      if (produto) {
        produtos.update.mutate({
          id: produto.id,
          data: { estoque: produto.estoque - item.quantidade },
        });
      }
    }
    return { ok: true };
  };

  const addReserva = (reserva: Reserva): ActionResult<Reserva> => {
    const hasConflict = reservasList.some((current) => {
      if (current.espaco !== reserva.espaco || current.dataInicio !== reserva.dataInicio) return false;
      const startA = timeToMinutes(current.horaInicio);
      const endA = timeToMinutes(current.horaFim);
      const startB = timeToMinutes(reserva.horaInicio);
      const endB = timeToMinutes(reserva.horaFim);
      return startB < endA && endB > startA;
    });

    const reservaFinal = { ...reserva, conflito: hasConflict };
    reservas.create.mutate(reservaFinal);

    return {
      ok: true,
      data: reservaFinal,
      message: hasConflict ? 'Reserva criada com alerta de conflito de horário.' : 'Reserva criada com sucesso.',
    };
  };

  const addPagamentoContrato = (pagamento: PagamentoContratoAluguel): ActionResult => {
    const contrato = contratosList.find((item) => item.id === pagamento.contratoId);
    if (!contrato) {
      return { ok: false, message: 'Contrato não encontrado.' };
    }
    pagamentosContrato.create.mutate(pagamento);
    return { ok: true };
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cobrancasList, produtosList, vendasList, reservasList, contratosList, pagamentosContratoList, isLoading]
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
