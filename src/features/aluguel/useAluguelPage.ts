import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import type { ContratoAluguel, FormaPagamento, PagamentoContratoAluguel, Reserva } from '@/types';

export type PagamentoContratoDetalhado = PagamentoContratoAluguel & { recipientPhone?: string };
export type ReservaDetalhada = Reserva & { locatarioTelefone?: string };
export const FORMAS_PAGAMENTO: Exclude<FormaPagamento, 'Boleto'>[] = ['PIX', 'Cartao', 'Dinheiro', 'Transferencia'];

export function useAluguelPage() {
  const { reservasList, contratosList, pagamentosContratoList, addReserva, addPagamentoContrato } = useOperacionalData();
  const [reservaOpen, setReservaOpen] = useState(false);
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [comprovanteOpen, setComprovanteOpen] = useState(false);
  const [locatario, setLocatario] = useState('');
  const [locatarioTelefone, setLocatarioTelefone] = useState('');
  const [espaco, setEspaco] = useState('Tatame Principal');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [valor, setValor] = useState('');
  const [contratoSel, setContratoSel] = useState<ContratoAluguel | null>(null);
  const [valorPagamento, setValorPagamento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<Exclude<FormaPagamento, 'Boleto'>>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [referencia, setReferencia] = useState('');
  const [pagamentoTelefone, setPagamentoTelefone] = useState('');
  const [comprovanteFields, setComprovanteFields] = useState<{ label: string; value: string }[]>([]);
  const [comprovanteSubtitle, setComprovanteSubtitle] = useState('');
  const [comprovantePhone, setComprovantePhone] = useState('');
  const [comprovanteRecipient, setComprovanteRecipient] = useState('');

  const pagamentosPorContrato = useMemo(() => pagamentosContratoList.reduce<Record<string, PagamentoContratoDetalhado[]>>((acc, pagamento) => {
    acc[pagamento.contratoId] = [...(acc[pagamento.contratoId] || []), pagamento as PagamentoContratoDetalhado];
    return acc;
  }, {}), [pagamentosContratoList]);

  const salvarReserva = async () => {
    if (!locatario.trim() || !dataInicio || !horaInicio || !horaFim || !valor) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    const reserva: ReservaDetalhada = {
      id: `res${Date.now()}`,
      locatario: locatario.trim(),
      locatarioTelefone: locatarioTelefone.trim(),
      espaco,
      dataInicio,
      dataFim: dataInicio,
      horaInicio,
      horaFim,
      status: 'confirmada',
      valor: parseFloat(valor) || 0,
      conflito: false,
    };
    const result = await addReserva(reserva);
    if (!result.ok) return toast.error(result.message || 'Não foi possível criar a reserva.');
    if (result.warnings?.length) toast.warning(result.warnings.join(' | '));
    toast.success(result.message || 'Reserva confirmada com sucesso!');
    setReservaOpen(false);
    setLocatario(''); setLocatarioTelefone(''); setDataInicio(''); setHoraInicio(''); setHoraFim(''); setValor('');
  };

  const abrirPagamento = (contrato: ContratoAluguel) => {
    setContratoSel(contrato);
    setValorPagamento(contrato.valor.toFixed(2));
    setFormaPagamento('PIX');
    setObservacoes('');
    setReferencia('Mensalidade atual');
    setPagamentoTelefone('');
    setPagamentoOpen(true);
  };

  const abrirComprovante = (contrato: ContratoAluguel, pagamento: PagamentoContratoAluguel) => {
    const detalhado = pagamento as PagamentoContratoDetalhado;
    setComprovanteSubtitle(`${contrato.locatario} • ${contrato.espaco}`);
    setComprovanteFields([
      { label: 'Locatário', value: contrato.locatario },
      { label: 'Telefone', value: detalhado.recipientPhone || 'Não informado' },
      { label: 'Espaço', value: contrato.espaco },
      { label: 'Período do contrato', value: `${contrato.dataInicio} a ${contrato.dataFim}` },
      { label: 'Valor pago', value: `R$ ${pagamento.valor.toFixed(2)}` },
      { label: 'Data do pagamento', value: pagamento.dataPagamento },
      { label: 'Forma de pagamento', value: pagamento.formaPagamento },
      { label: 'Referência', value: pagamento.referencia || 'Sem referência' },
      { label: 'Observações', value: pagamento.observacoes || 'Sem observações' },
      { label: 'Comprovante', value: pagamento.comprovanteId || 'Não gerado' },
    ]);
    setComprovantePhone(detalhado.recipientPhone || '');
    setComprovanteRecipient(contrato.locatario);
    setComprovanteOpen(true);
  };

  const salvarPagamento = async () => {
    if (!contratoSel) return;
    const valorNumerico = parseFloat(valorPagamento);
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) return toast.error('Informe um valor válido.');
    const pagamento: PagamentoContratoDetalhado = {
      id: `pg${Date.now()}`,
      contratoId: contratoSel.id,
      dataPagamento: new Date().toISOString().split('T')[0],
      valor: valorNumerico,
      formaPagamento,
      observacoes,
      referencia,
      comprovanteId: `AL-${Date.now()}`,
      recipientPhone: pagamentoTelefone.trim(),
    };
    const result = await addPagamentoContrato(pagamento);
    if (!result.ok) return toast.error(result.message || 'Não foi possível registrar o pagamento.');
    setPagamentoOpen(false);
    toast.success('Pagamento do contrato registrado.');
    abrirComprovante(contratoSel, pagamento);
  };

  return {
    reservasList, contratosList, pagamentosPorContrato,
    reservaOpen, setReservaOpen, locatario, setLocatario, locatarioTelefone, setLocatarioTelefone,
    espaco, setEspaco, dataInicio, setDataInicio, horaInicio, setHoraInicio, horaFim, setHoraFim, valor, setValor, salvarReserva,
    pagamentoOpen, setPagamentoOpen, contratoSel, abrirPagamento, valorPagamento, setValorPagamento,
    formaPagamento, setFormaPagamento, observacoes, setObservacoes, referencia, setReferencia,
    pagamentoTelefone, setPagamentoTelefone, salvarPagamento, abrirComprovante,
    comprovanteOpen, setComprovanteOpen, comprovanteFields, comprovanteSubtitle, comprovantePhone, comprovanteRecipient,
  };
}
