import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import { haptic } from '@/lib/haptics';
import type { Cobranca, CobrancaStatus, FormaPagamento } from '@/types';

export const STATUS_TABS: { label: string; value: CobrancaStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Abertas', value: 'aberta' },
  { label: 'Vencidas', value: 'vencida' },
  { label: 'Pagas', value: 'paga' },
  { label: 'Parciais', value: 'parcial' },
];

export const FORMAS_PAGAMENTO: FormaPagamento[] = ['PIX', 'Cartao', 'Dinheiro', 'Transferencia', 'Boleto'];

export function formatDate(dateIso: string) {
  if (!dateIso) return '-';
  const [year, month, day] = dateIso.split('-');
  return year && month && day ? `${day}/${month}/${year}` : dateIso;
}

export function useFinanceiroPage() {
  const { cobrancasList, registrarPagamentoCobranca } = useOperacionalData();
  const { alunosList, syncMensalidadesParaTodos } = useAcademiaData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtro, setFiltro] = useState<CobrancaStatus | 'todas'>('todas');
  const [busca, setBusca] = useState('');
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [cobrancaSel, setCobrancaSel] = useState<Cobranca | null>(null);
  const [valorPagamento, setValorPagamento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [comprovanteOpen, setComprovanteOpen] = useState(false);
  const [comprovanteFields, setComprovanteFields] = useState<{ label: string; value: string }[]>([]);
  const [comprovanteSubtitle, setComprovanteSubtitle] = useState('');
  const [comprovantePhone, setComprovantePhone] = useState('');
  const [comprovanteRecipient, setComprovanteRecipient] = useState('');
  const alunoFiltroId = searchParams.get('aluno') || 'todos';

  const filtered = cobrancasList.filter((cobranca) => {
    const matchStatus = filtro === 'todas' || cobranca.status === filtro;
    const matchBusca = cobranca.nomeAluno.toLowerCase().includes(busca.toLowerCase());
    const matchAluno = alunoFiltroId === 'todos' || cobranca.alunoId === alunoFiltroId;
    return matchStatus && matchBusca && matchAluno;
  });
  const totalAberto = cobrancasList
    .filter((cobranca) => cobranca.status === 'aberta' || cobranca.status === 'parcial')
    .reduce((soma, cobranca) => soma + (cobranca.valor - cobranca.valorPago), 0);
  const totalVencido = cobrancasList
    .filter((cobranca) => cobranca.status === 'vencida')
    .reduce((soma, cobranca) => soma + cobranca.valor, 0);
  const mensalidadesPendentes = cobrancasList.filter(
    (cobranca) => cobranca.tipo === 'mensalidade' && cobranca.status !== 'paga',
  ).length;

  const openReceipt = (cobranca: Cobranca) => {
    const aluno = alunosList.find((item) => item.id === cobranca.alunoId);
    setComprovanteSubtitle(`${cobranca.nomeAluno} • ${cobranca.descricao}`);
    setComprovanteFields([
      { label: 'Aluno', value: cobranca.nomeAluno },
      { label: 'Descrição', value: cobranca.descricao },
      { label: 'Valor total', value: `R$ ${cobranca.valor.toFixed(2)}` },
      { label: 'Valor pago', value: `R$ ${cobranca.valorPago.toFixed(2)}` },
      { label: 'Data do pagamento', value: cobranca.dataPagamento || 'Não registrado' },
      { label: 'Forma de pagamento', value: cobranca.formaPagamento || 'Não informada' },
      { label: 'Observações', value: cobranca.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: cobranca.comprovanteId || 'Não gerado' },
    ]);
    setComprovantePhone(aluno?.telefone || '');
    setComprovanteRecipient(aluno?.nome || cobranca.nomeAluno);
    setComprovanteOpen(true);
  };

  const openPayment = (cobranca: Cobranca) => {
    setCobrancaSel(cobranca);
    setValorPagamento((cobranca.valor - cobranca.valorPago).toFixed(2));
    setFormaPagamento(cobranca.formaPagamento || 'PIX');
    setObservacoes(cobranca.observacoes || '');
    setPagamentoOpen(true);
  };

  const confirmPayment = async () => {
    if (!cobrancaSel) return;
    const valor = parseFloat(valorPagamento);
    if (Number.isNaN(valor) || valor <= 0) return toast.error('Informe um valor válido.');
    const restante = cobrancaSel.valor - cobrancaSel.valorPago;
    if (valor > restante) return toast.error(`Valor máximo: R$ ${restante.toFixed(2)}`);

    const dataPagamento = new Date().toISOString().split('T')[0];
    const comprovanteId = `CP-${Date.now()}`;
    const result = await registrarPagamentoCobranca({
      cobrancaId: cobrancaSel.id,
      valorPagamento: valor,
      formaPagamento,
      observacoes,
      comprovanteId,
      dataPagamento,
    });
    if (!result.ok) return toast.error(result.message || 'Falha ao registrar pagamento.');

    const data = result.data as { valorPago?: number; status?: CobrancaStatus; formaPagamento?: FormaPagamento; dataPagamento?: string; comprovanteId?: string } | undefined;
    const atualizado: Cobranca = {
      ...cobrancaSel,
      valorPago: data?.valorPago ?? cobrancaSel.valorPago + valor,
      status: data?.status ?? (cobrancaSel.valorPago + valor >= cobrancaSel.valor ? 'paga' : 'parcial'),
      dataPagamento: data?.dataPagamento ?? dataPagamento,
      formaPagamento: data?.formaPagamento ?? formaPagamento,
      observacoes,
      comprovanteId: data?.comprovanteId ?? comprovanteId,
    };
    setPagamentoOpen(false);
    setCobrancaSel(null);
    toast.success(`Pagamento de R$ ${valor.toFixed(2)} registrado.`);
    haptic('success');
    openReceipt(atualizado);
  };

  const setAlunoFiltro = (alunoId: string) => {
    const next = new URLSearchParams(searchParams);
    if (alunoId === 'todos') next.delete('aluno');
    else next.set('aluno', alunoId);
    setSearchParams(next, { replace: true });
  };

  const gerarMensalidades = () => {
    const result = syncMensalidadesParaTodos();
    if (!result.ok) return toast.error(result.message || 'Falha ao gerar mensalidades.');
    const created = result.data?.created ?? 0;
    if (created === 0) return toast.info('Nenhuma nova mensalidade pendente para gerar.');
    toast.success(`${created} mensalidade(s) geradas com sucesso.`);
  };

  return {
    cobrancasList, alunosList, filtered, totalAberto, totalVencido, mensalidadesPendentes,
    filtro, setFiltro, busca, setBusca, alunoFiltroId, setAlunoFiltro, gerarMensalidades,
    pagamentoOpen, setPagamentoOpen, cobrancaSel, valorPagamento, setValorPagamento,
    formaPagamento, setFormaPagamento, observacoes, setObservacoes, openPayment, confirmPayment,
    comprovanteOpen, setComprovanteOpen, comprovanteFields, comprovanteSubtitle,
    comprovantePhone, comprovanteRecipient, openReceipt,
  };
}
