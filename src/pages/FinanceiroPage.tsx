import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { haptic } from '@/lib/haptics';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { KpiCard } from '@/components/shared/KpiCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, DollarSign, AlertTriangle, CreditCard, Receipt, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { Cobranca, CobrancaStatus, FormaPagamento } from '@/types';

const statusTabs: { label: string; value: CobrancaStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Abertas', value: 'aberta' },
  { label: 'Vencidas', value: 'vencida' },
  { label: 'Pagas', value: 'paga' },
  { label: 'Parciais', value: 'parcial' },
];

const formasPagamento = ['PIX', 'Cartao', 'Dinheiro', 'Transferencia', 'Boleto'];

function formatDate(dateIso: string) {
  if (!dateIso) return '-';
  const [year, month, day] = dateIso.split('-');
  if (!year || !month || !day) return dateIso;
  return `${day}/${month}/${year}`;
}

export default function FinanceiroPage() {
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
    (cobranca) => cobranca.tipo === 'mensalidade' && cobranca.status !== 'paga'
  ).length;

  const abrirComprovante = (cobranca: Cobranca) => {
    const aluno = alunosList.find((item) => item.id === cobranca.alunoId);
    setComprovanteSubtitle(`${cobranca.nomeAluno} • ${cobranca.descricao}`);
    setComprovanteFields([
      { label: 'Aluno', value: cobranca.nomeAluno },
      { label: 'Descricao', value: cobranca.descricao },
      { label: 'Valor total', value: `R$ ${cobranca.valor.toFixed(2)}` },
      { label: 'Valor pago', value: `R$ ${cobranca.valorPago.toFixed(2)}` },
      { label: 'Data do pagamento', value: cobranca.dataPagamento || 'Nao registrado' },
      { label: 'Forma de pagamento', value: cobranca.formaPagamento || 'Nao informada' },
      { label: 'Observacoes', value: cobranca.observacoes || 'Sem observacoes' },
      { label: 'Comprovante', value: cobranca.comprovanteId || 'Nao gerado' },
    ]);
    setComprovantePhone(aluno?.telefone || '');
    setComprovanteRecipient(aluno?.nome || cobranca.nomeAluno);
    setComprovanteOpen(true);
  };

  const handleRegistrarPagamento = (cobranca: Cobranca) => {
    setCobrancaSel(cobranca);
    setValorPagamento((cobranca.valor - cobranca.valorPago).toFixed(2));
    setFormaPagamento(cobranca.formaPagamento || 'PIX');
    setObservacoes(cobranca.observacoes || '');
    setPagamentoOpen(true);
  };

  const handleConfirmarPagamento = async () => {
    if (!cobrancaSel) return;

    const valor = parseFloat(valorPagamento);
    if (Number.isNaN(valor) || valor <= 0) {
      toast.error('Informe um valor valido.');
      return;
    }

    const restante = cobrancaSel.valor - cobrancaSel.valorPago;
    if (valor > restante) {
      toast.error(`Valor maximo: R$ ${restante.toFixed(2)}`);
      return;
    }

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
    if (!result.ok) {
      toast.error(result.message || 'Falha ao registrar pagamento.');
      return;
    }

    const paymentData = result.data as
      | {
          valorPago?: number;
          status?: CobrancaStatus;
          formaPagamento?: FormaPagamento;
          dataPagamento?: string;
          comprovanteId?: string;
        }
      | undefined;

    const atualizado: Cobranca = {
      ...cobrancaSel,
      valorPago: paymentData?.valorPago ?? cobrancaSel.valorPago + valor,
      status: paymentData?.status ?? (cobrancaSel.valorPago + valor >= cobrancaSel.valor ? 'paga' : 'parcial'),
      dataPagamento: paymentData?.dataPagamento ?? dataPagamento,
      formaPagamento: paymentData?.formaPagamento ?? formaPagamento,
      observacoes,
      comprovanteId: paymentData?.comprovanteId ?? comprovanteId,
    };

    setPagamentoOpen(false);
    setCobrancaSel(null);
    toast.success(`Pagamento de R$ ${valor.toFixed(2)} registrado.`);
    haptic('success');
    abrirComprovante(atualizado);
  };

  const handleFiltroAlunoChange = (alunoId: string) => {
    const next = new URLSearchParams(searchParams);
    if (alunoId === 'todos') {
      next.delete('aluno');
    } else {
      next.set('aluno', alunoId);
    }
    setSearchParams(next, { replace: true });
  };

  const handleGerarMensalidades = () => {
    const result = syncMensalidadesParaTodos();
    if (!result.ok) {
      toast.error(result.message || 'Falha ao gerar mensalidades.');
      return;
    }

    const created = result.data?.created ?? 0;
    if (created === 0) {
      toast.info('Nenhuma nova mensalidade pendente para gerar.');
      return;
    }

    toast.success(`${created} mensalidade(s) geradas com sucesso.`);
  };

  const comprovanteTitle = useMemo(() => 'Comprovante de Pagamento', []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro Escolar"
        subtitle="Cobranças vinculadas ao aluno"
        actions={
          <Button size="sm" variant="secondary" onClick={handleGerarMensalidades}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Gerar mensalidades pendentes
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total em Aberto" valor={`R$ ${totalAberto.toLocaleString('pt-BR')}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Total Vencido" valor={`R$ ${totalVencido.toLocaleString('pt-BR')}`} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Mensalidades Pendentes" valor={mensalidadesPendentes} />
        <KpiCard label="Cobrancas" valor={cobrancasList.length} />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} className="h-9 bg-secondary/50 pl-9 text-xs" />
        </div>
        <select
          value={alunoFiltroId}
          onChange={(e) => handleFiltroAlunoChange(e.target.value)}
          className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground"
          aria-label="Filtrar por aluno"
        >
          <option value="todos">Todos os alunos</option>
          {alunosList
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
        </select>
        <div className="flex flex-wrap gap-1.5">
          {statusTabs.map((status) => (
            <Button key={status.value} variant={filtro === status.value ? 'default' : 'secondary'} size="sm" className="h-8 text-xs" onClick={() => setFiltro(status.value)}>
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhuma cobranca encontrada" description="Tente ajustar os filtros de busca." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Aluno</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Descricao</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Valor</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Vencimento</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cobranca) => (
                    <tr key={cobranca.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                      <td className="px-4 py-3 font-medium text-foreground">{cobranca.nomeAluno}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cobranca.tipo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cobranca.descricao}</td>
                      <td className="px-4 py-3 text-foreground">
                        R$ {cobranca.valor.toFixed(2)}
                        {cobranca.valorPago > 0 && <p className="text-[10px] text-muted-foreground">Pago: R$ {cobranca.valorPago.toFixed(2)}</p>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(cobranca.dataVencimento)}</td>
                      <td className="px-4 py-3"><StatusBadge status={cobranca.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {(cobranca.status === 'aberta' || cobranca.status === 'parcial' || cobranca.status === 'vencida') && (
                            <Button size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => handleRegistrarPagamento(cobranca)}>
                              <CreditCard className="mr-1 h-3 w-3" />Pagar
                            </Button>
                          )}
                          {cobranca.valorPago > 0 && (
                            <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => abrirComprovante(cobranca)}>
                              <Receipt className="mr-1 h-3 w-3" />Comprovante
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 sm:hidden">
            {filtered.map((cobranca) => (
              <div key={cobranca.id} className="space-y-2 rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{cobranca.nomeAluno}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{cobranca.descricao}</p>
                    <p className="text-[11px] text-muted-foreground">Tipo: {cobranca.tipo}</p>
                  </div>
                  <StatusBadge status={cobranca.status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-foreground">R$ {cobranca.valor.toFixed(2)}</span>
                    {cobranca.valorPago > 0 && <span className="ml-2 text-muted-foreground">Pago: R$ {cobranca.valorPago.toFixed(2)}</span>}
                  </div>
                  <span className="text-muted-foreground">{formatDate(cobranca.dataVencimento)}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {(cobranca.status === 'aberta' || cobranca.status === 'parcial' || cobranca.status === 'vencida') && (
                    <Button size="sm" className="h-8 w-full text-xs" onClick={() => handleRegistrarPagamento(cobranca)}>
                      <CreditCard className="mr-1 h-3 w-3" />Registrar Pagamento
                    </Button>
                  )}
                  {cobranca.valorPago > 0 && (
                    <Button size="sm" variant="secondary" className="h-8 w-full text-xs" onClick={() => abrirComprovante(cobranca)}>
                      <Receipt className="mr-1 h-3 w-3" />Ver Comprovante
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={pagamentoOpen} onOpenChange={setPagamentoOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Registrar Pagamento</DialogTitle>
          </DialogHeader>
          {cobrancaSel && (
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground">Aluno: <span className="font-medium text-foreground">{cobrancaSel.nomeAluno}</span></p>
                <p className="text-muted-foreground">Cobranca: <span className="text-foreground">{cobrancaSel.descricao}</span></p>
                <p className="text-muted-foreground">Valor total: <span className="text-foreground">R$ {cobrancaSel.valor.toFixed(2)}</span></p>
                <p className="text-muted-foreground">Ja pago: <span className="text-foreground">R$ {cobrancaSel.valorPago.toFixed(2)}</span></p>
              </div>
              <div>
                <label htmlFor="valor-pagamento" className="mb-1 block text-xs text-muted-foreground">Valor do pagamento (R$)</label>
                <Input id="valor-pagamento" type="number" step="0.01" value={valorPagamento} onChange={(e) => setValorPagamento(e.target.value)} className="h-9 bg-secondary/50 text-sm" />
              </div>
              <div>
                <label htmlFor="forma-pagamento" className="mb-1 block text-xs text-muted-foreground">Forma de pagamento</label>
                <select id="forma-pagamento" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                  {formasPagamento.map((forma) => <option key={forma} value={forma}>{forma}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="observacoes-pagamento" className="mb-1 block text-xs text-muted-foreground">Observacoes</label>
                <textarea id="observacoes-pagamento" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground" placeholder="Ex.: pagamento referente ao mes atual" />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => setPagamentoOpen(false)} className="text-xs">Cancelar</Button>
            <Button onClick={handleConfirmarPagamento} className="text-xs">Confirmar Pagamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ComprovanteDialog
        open={comprovanteOpen}
        onOpenChange={setComprovanteOpen}
        title={comprovanteTitle}
        subtitle={comprovanteSubtitle}
        fields={comprovanteFields}
        recipientPhone={comprovantePhone}
        recipientName={comprovanteRecipient}
      />
    </div>
  );
}
