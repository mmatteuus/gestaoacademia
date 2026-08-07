import type {
  FinancePaymentPayload,
  ReservationPayload,
  SalePayload,
} from '@/services/api/domain';
import type {
  Cobranca,
  ContratoAluguel,
  PagamentoContratoAluguel,
  Produto,
  Reserva,
  Venda,
} from '@/types';

export interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
  warnings?: string[];
}

export interface OperacionalDataContextValue {
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
  addPagamentoContrato: (
    pagamento: PagamentoContratoAluguel,
  ) => Promise<ActionResult<PagamentoContratoAluguel>>;
  registrarPagamentoCobranca: (
    payload: FinancePaymentPayload,
  ) => Promise<ActionResult<Record<string, unknown>>>;
}
