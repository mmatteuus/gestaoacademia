import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import type { ContratoAluguel, PagamentoContratoAluguel, Reserva } from '@/types';
import type { PagamentoContratoValues } from '../schemas/pagamento-contrato.schema';
import type { ReservaAluguelValues } from '../schemas/reserva-aluguel.schema';
import type {
  ComprovanteAluguelState,
  PagamentoContratoDetalhado,
  ReservaDetalhada,
} from '../types/aluguel.types';
import { buildComprovanteAluguel, groupPagamentosByContrato } from '../utils/aluguel.utils';

const EMPTY_RECEIPT: ComprovanteAluguelState = {
  open: false,
  subtitle: '',
  fields: [],
  phone: '',
  recipient: '',
};

export function useAluguelPage() {
  const {
    reservasList,
    contratosList,
    pagamentosContratoList,
    addReserva,
    addPagamentoContrato,
  } = useOperacionalData();
  const [reservaOpen, setReservaOpen] = useState(false);
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [contratoSelecionado, setContratoSelecionado] = useState<ContratoAluguel | null>(null);
  const [comprovante, setComprovante] = useState<ComprovanteAluguelState>(EMPTY_RECEIPT);

  const pagamentosPorContrato = useMemo(
    () => groupPagamentosByContrato(pagamentosContratoList),
    [pagamentosContratoList],
  );

  const criarReserva = async (values: ReservaAluguelValues) => {
    const timestamp = Date.now();
    const reserva: ReservaDetalhada = {
      id: `res${timestamp}`,
      locatario: values.locatario,
      locatarioTelefone: values.locatarioTelefone,
      espaco: values.espaco,
      dataInicio: values.dataInicio,
      dataFim: values.dataInicio,
      horaInicio: values.horaInicio,
      horaFim: values.horaFim,
      status: 'confirmada',
      valor: values.valor,
      conflito: false,
    };

    const result = await addReserva(reserva);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível criar a reserva.');
      return false;
    }

    if (result.warnings?.length) toast.warning(result.warnings.join(' | '));
    toast.success(result.message || 'Reserva confirmada com sucesso.');
    setReservaOpen(false);
    return true;
  };

  const abrirPagamento = (contrato: ContratoAluguel) => {
    setContratoSelecionado(contrato);
    setPagamentoOpen(true);
  };

  const abrirComprovante = (
    contrato: ContratoAluguel,
    pagamento: PagamentoContratoAluguel,
  ) => {
    setComprovante(buildComprovanteAluguel(contrato, pagamento));
  };

  const registrarPagamento = async (values: PagamentoContratoValues) => {
    if (!contratoSelecionado) return false;

    const timestamp = Date.now();
    const pagamento: PagamentoContratoDetalhado = {
      id: `pg${timestamp}`,
      contratoId: contratoSelecionado.id,
      dataPagamento: new Date().toISOString().split('T')[0],
      valor: values.valor,
      formaPagamento: values.formaPagamento,
      observacoes: values.observacoes,
      referencia: values.referencia,
      comprovanteId: `AL-${timestamp}`,
      recipientPhone: values.recipientPhone,
    };

    const result = await addPagamentoContrato(pagamento);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível registrar o pagamento.');
      return false;
    }

    setPagamentoOpen(false);
    toast.success('Pagamento do contrato registrado.');
    abrirComprovante(contratoSelecionado, pagamento);
    return true;
  };

  return {
    reservas: reservasList as Reserva[],
    contratos: contratosList,
    pagamentosPorContrato,
    reservaOpen,
    pagamentoOpen,
    contratoSelecionado,
    comprovante,
    setReservaOpen,
    setPagamentoOpen,
    abrirPagamento,
    abrirComprovante,
    criarReserva,
    registrarPagamento,
    setComprovanteOpen: (open: boolean) =>
      setComprovante((current) => ({ ...current, open })),
  };
}
