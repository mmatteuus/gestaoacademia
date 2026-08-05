import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { haptic } from '@/lib/haptics';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import type { Cobranca } from '@/types';
import type { PagamentoCobrancaValues } from '../schemas/pagamento-cobranca.schema';
import type {
  ComprovanteFinanceiroState,
  FiltroCobranca,
  PagamentoResponse,
} from '../types/financeiro.types';
import {
  buildFinanceiroReceipt,
  calculateFinanceiroMetrics,
  filterCobrancas,
} from '../utils/financeiro.utils';

const EMPTY_RECEIPT: ComprovanteFinanceiroState = {
  open: false,
  subtitle: '',
  fields: [],
  phone: '',
  recipient: '',
};

export function useFinanceiroPage() {
  const { cobrancasList, registrarPagamentoCobranca } = useOperacionalData();
  const { alunosList, syncMensalidadesParaTodos } = useAcademiaData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtro, setFiltro] = useState<FiltroCobranca>('todas');
  const [busca, setBusca] = useState('');
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<Cobranca | null>(null);
  const [comprovante, setComprovante] = useState<ComprovanteFinanceiroState>(EMPTY_RECEIPT);

  const alunoFiltroId = searchParams.get('aluno') || 'todos';
  const cobrancas = useMemo(
    () => filterCobrancas(cobrancasList, filtro, busca, alunoFiltroId),
    [alunoFiltroId, busca, cobrancasList, filtro],
  );
  const metrics = useMemo(() => calculateFinanceiroMetrics(cobrancasList), [cobrancasList]);
  const alunosOrdenados = useMemo(
    () => [...alunosList].sort((left, right) => left.nome.localeCompare(right.nome, 'pt-BR')),
    [alunosList],
  );

  const setAlunoFiltro = (alunoId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (alunoId === 'todos') nextParams.delete('aluno');
    else nextParams.set('aluno', alunoId);
    setSearchParams(nextParams, { replace: true });
  };

  const abrirPagamento = (cobranca: Cobranca) => {
    setCobrancaSelecionada(cobranca);
    setPagamentoOpen(true);
  };

  const abrirComprovante = (cobranca: Cobranca) => {
    const aluno = alunosList.find((item) => item.id === cobranca.alunoId);
    setComprovante(buildFinanceiroReceipt(cobranca, aluno));
  };

  const confirmarPagamento = async (values: PagamentoCobrancaValues) => {
    if (!cobrancaSelecionada) return false;

    const restante = cobrancaSelecionada.valor - cobrancaSelecionada.valorPago;
    if (values.valorPagamento > restante) {
      toast.error(`O valor máximo é ${restante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`);
      return false;
    }

    const dataPagamento = new Date().toISOString().split('T')[0];
    const comprovanteId = `CP-${Date.now()}`;
    const result = await registrarPagamentoCobranca({
      cobrancaId: cobrancaSelecionada.id,
      valorPagamento: values.valorPagamento,
      formaPagamento: values.formaPagamento,
      observacoes: values.observacoes,
      comprovanteId,
      dataPagamento,
    });

    if (!result.ok) {
      toast.error(result.message || 'Não foi possível registrar o pagamento.');
      return false;
    }

    const response = result.data as PagamentoResponse | undefined;
    const totalPago = response?.valorPago ?? cobrancaSelecionada.valorPago + values.valorPagamento;
    const cobrancaAtualizada: Cobranca = {
      ...cobrancaSelecionada,
      valorPago: totalPago,
      status: response?.status ?? (totalPago >= cobrancaSelecionada.valor ? 'paga' : 'parcial'),
      dataPagamento: response?.dataPagamento ?? dataPagamento,
      formaPagamento: response?.formaPagamento ?? values.formaPagamento,
      observacoes: values.observacoes,
      comprovanteId: response?.comprovanteId ?? comprovanteId,
    };

    setPagamentoOpen(false);
    setCobrancaSelecionada(null);
    toast.success(`Pagamento de ${values.valorPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} registrado.`);
    haptic('success');
    abrirComprovante(cobrancaAtualizada);
    return true;
  };

  const gerarMensalidades = () => {
    const result = syncMensalidadesParaTodos();
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível gerar as mensalidades.');
      return;
    }

    const created = result.data?.created ?? 0;
    if (created === 0) {
      toast.info('Nenhuma nova mensalidade pendente para gerar.');
      return;
    }

    toast.success(`${created} mensalidade(s) geradas com sucesso.`);
  };

  return {
    cobrancas,
    metrics,
    alunos: alunosOrdenados,
    filtro,
    busca,
    alunoFiltroId,
    pagamentoOpen,
    cobrancaSelecionada,
    comprovante,
    setFiltro,
    setBusca,
    setAlunoFiltro,
    setPagamentoOpen,
    abrirPagamento,
    abrirComprovante,
    confirmarPagamento,
    gerarMensalidades,
    setComprovanteOpen: (open: boolean) =>
      setComprovante((current) => ({ ...current, open })),
  };
}
