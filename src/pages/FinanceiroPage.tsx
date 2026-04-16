import { useMemo, useState } from 'react';
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
import { Search, DollarSign, AlertTriangle, CreditCard, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import type { Cobranca, CobrancaStatus, FormaPagamento } from '@/types';

const statusTabs: { label: string; value: CobrancaStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Abertas', value: 'aberta' },
  { label: 'Vencidas', value: 'vencida' },
  { label: 'Pagas', value: 'paga' },
  { label: 'Parciais', value: 'parcial' },
];

const formasPagamento: FormaPagamento[] = ['PIX', 'Cartão', 'Dinheiro', 'Transferência', 'Boleto'];

export default function FinanceiroPage() {
  const { cobrancasList, updateCobranca } = useOperacionalData();
  const { alunosList } = useAcademiaData();
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

  const filtered = cobrancasList.filter((cobranca) => {
    const matchStatus = filtro === 'todas' || cobranca.status === filtro;
    const matchBusca = cobranca.nomeAluno.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const totalAberto = cobrancasList
    .filter((cobranca) => cobranca.status === 'aberta' || cobranca.status === 'parcial')
    .reduce((soma, cobranca) => soma + (cobranca.valor - cobranca.valorPago), 0);

  const totalVencido = cobrancasList
    .filter((cobranca) => cobranca.status === 'vencida')
    .reduce((soma, cobranca) => soma + cobranca.valor, 0);

  const abrirComprovante = (cobranca: Cobranca) => {
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

  const handleRegistrarPagamento = (cobranca: Cobranca) => {
    setCobrancaSel(cobranca);
    setValorPagamento((cobranca.valor - cobranca.valorPago).toFixed(2));
    setFormaPagamento(cobranca.formaPagamento || 'PIX');
    setObservacoes(cobranca.observacoes || '');
    setPagamentoOpen(true);
  };

  const handleConfirmarPagamento = () => {
    if (!cobrancaSel) return;

    const valor = parseFloat(valorPagamento);
    if (Number.isNaN(valor) || valor <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    const restante = cobrancaSel.valor - cobrancaSel.valorPago;
    if (valor > restante) {
      toast.error(`Valor máximo: R$ ${restante.toFixed(2)}`);
      return;
    }

    const dataPagamento = new Date().toISOString().split('T')[0];
    const comprovanteId = `CP-${Date.now()}`;
    const atualizado: Cobranca = {
      ...cobrancaSel,
      valorPago: cobrancaSel.valorPago + valor,
      status: cobrancaSel.valorPago + valor >= cobrancaSel.valor ? 'paga' : 'parcial',
      dataPagamento,
      formaPagamento,
      observacoes,
      comprovanteId,
    };

    updateCobranca(atualizado);
    setPagamentoOpen(false);
    setCobrancaSel(null);
    toast.success(`Pagamento de R$ ${valor.toFixed(2)} registrado`);
    abrirComprovante(atualizado);
  };

  const comprovanteTitle = useMemo(() => 'Comprovante de Pagamento', []);

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro Escolar" subtitle="Cobranças, mensalidades e pagamentos" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard label="Total em Aberto" valor={`R$ ${totalAberto.toLocaleString('pt-BR')}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Total Vencido" valor={`R$ ${totalVencido.toLocaleString('pt-BR')}`} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Cobranças" valor={cobrancasList.length} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Buscar por aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9 h-9 text-xs bg-secondary/50" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusTabs.map((status) => (
            <Button key={status.value} variant={filtro === status.value ? 'default' : 'secondary'} size="sm" className="text-xs h-8" onClick={() => setFiltro(status.value)}>
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhuma cobrança encontrada" description="Tente ajustar os filtros de busca." />
      ) : (
        <>
          <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[720px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Aluno</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Vencimento</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cobranca) => (
                    <tr key={cobranca.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{cobranca.nomeAluno}</td>
                      <td className="py-3 px-4 text-muted-foreground">{cobranca.descricao}</td>
                      <td className="py-3 px-4 text-foreground">
                        R$ {cobranca.valor.toFixed(2)}
                        {cobranca.valorPago > 0 && <p className="text-[10px] text-muted-foreground">Pago: R$ {cobranca.valorPago.toFixed(2)}</p>}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{cobranca.dataVencimento}</td>
                      <td className="py-3 px-4"><StatusBadge status={cobranca.status} /></td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          {(cobranca.status === 'aberta' || cobranca.status === 'parcial' || cobranca.status === 'vencida') && (
                            <Button size="sm" variant="secondary" className="text-[10px] h-7" onClick={() => handleRegistrarPagamento(cobranca)}>
                              <CreditCard className="h-3 w-3 mr-1" />Pagar
                            </Button>
                          )}
                          {cobranca.valorPago > 0 && (
                            <Button size="sm" variant="ghost" className="text-[10px] h-7" onClick={() => abrirComprovante(cobranca)}>
                              <Receipt className="h-3 w-3 mr-1" />Comprovante
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

          <div className="sm:hidden space-y-3">
            {filtered.map((cobranca) => (
              <div key={cobranca.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{cobranca.nomeAluno}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cobranca.descricao}</p>
                  </div>
                  <StatusBadge status={cobranca.status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-foreground font-medium">R$ {cobranca.valor.toFixed(2)}</span>
                    {cobranca.valorPago > 0 && <span className="text-muted-foreground ml-2">Pago: R$ {cobranca.valorPago.toFixed(2)}</span>}
                  </div>
                  <span className="text-muted-foreground">{cobranca.dataVencimento}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {(cobranca.status === 'aberta' || cobranca.status === 'parcial' || cobranca.status === 'vencida') && (
                    <Button size="sm" className="w-full text-xs h-8" onClick={() => handleRegistrarPagamento(cobranca)}>
                      <CreditCard className="h-3 w-3 mr-1" />Registrar Pagamento
                    </Button>
                  )}
                  {cobranca.valorPago > 0 && (
                    <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => abrirComprovante(cobranca)}>
                      <Receipt className="h-3 w-3 mr-1" />Ver Comprovante
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={pagamentoOpen} onOpenChange={setPagamentoOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Registrar Pagamento</DialogTitle>
          </DialogHeader>
          {cobrancaSel && (
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground">Aluno: <span className="text-foreground font-medium">{cobrancaSel.nomeAluno}</span></p>
                <p className="text-muted-foreground">Cobrança: <span className="text-foreground">{cobrancaSel.descricao}</span></p>
                <p className="text-muted-foreground">Valor total: <span className="text-foreground">R$ {cobrancaSel.valor.toFixed(2)}</span></p>
                <p className="text-muted-foreground">Já pago: <span className="text-foreground">R$ {cobrancaSel.valorPago.toFixed(2)}</span></p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Valor do pagamento (R$)</label>
                <Input type="number" step="0.01" value={valorPagamento} onChange={(e) => setValorPagamento(e.target.value)} className="h-9 text-sm bg-secondary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Forma de pagamento</label>
                <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground">
                  {formasPagamento.map((forma) => <option key={forma} value={forma}>{forma}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground resize-none" placeholder="Ex.: pagamento referente ao mês atual" />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
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
