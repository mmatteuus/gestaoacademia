import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  cobrancas as cobrancasMock,
  produtos as produtosMock,
  vendas as vendasMock,
  reservas as reservasMock,
  contratosAluguel as contratosMock,
} from '@/services/mocks/data';
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
  const [cobrancasList, setCobrancasList] = useState<Cobranca[]>(cobrancasMock);
  const [produtosList, setProdutosList] = useState<Produto[]>(produtosMock);
  const [vendasList, setVendasList] = useState<Venda[]>(vendasMock);
  const [reservasList, setReservasList] = useState<Reserva[]>(reservasMock);
  const [contratosList] = useState<ContratoAluguel[]>(contratosMock);
  const [pagamentosContratoList, setPagamentosContratoList] = useState<PagamentoContratoAluguel[]>([]);

  const updateCobranca = (cobrancaAtualizada: Cobranca) => {
    setCobrancasList((prev) => prev.map((cobranca) => (cobranca.id === cobrancaAtualizada.id ? cobrancaAtualizada : cobranca)));
  };

  const upsertProduto = (produto: Produto) => {
    setProdutosList((prev) => {
      const exists = prev.some((item) => item.id === produto.id);
      if (exists) {
        return prev.map((item) => (item.id === produto.id ? produto : item));
      }
      return [...prev, produto];
    });
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

    setProdutosList((prev) =>
      prev.map((produto) => {
        const item = venda.itens.find((entry) => entry.produtoId === produto.id);
        return item ? { ...produto, estoque: produto.estoque - item.quantidade } : produto;
      })
    );
    setVendasList((prev) => [venda, ...prev]);
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
    setReservasList((prev) => [reservaFinal, ...prev]);

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
    setPagamentosContratoList((prev) => [pagamento, ...prev]);
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
      updateCobranca,
      upsertProduto,
      createVenda,
      addReserva,
      addPagamentoContrato,
    }),
    [cobrancasList, produtosList, vendasList, reservasList, contratosList, pagamentosContratoList]
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
