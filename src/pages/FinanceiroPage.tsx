import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { KpiCard } from '@/components/shared/KpiCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { cobrancas as cobrancasMock } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, DollarSign, AlertTriangle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import type { Cobranca, CobrancaStatus } from '@/types';

const statusTabs: { label: string; value: CobrancaStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Abertas', value: 'aberta' },
  { label: 'Vencidas', value: 'vencida' },
  { label: 'Pagas', value: 'paga' },
  { label: 'Parciais', value: 'parcial' },
];

export default function FinanceiroPage() {
  const [cobrancasList, setCobrancasList] = useState<Cobranca[]>(cobrancasMock);
  const [filtro, setFiltro] = useState<CobrancaStatus | 'todas'>('todas');
  const [busca, setBusca] = useState('');
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [cobrancaSel, setCobrancaSel] = useState<Cobranca | null>(null);
  const [valorPagamento, setValorPagamento] = useState('');

  const filtered = cobrancasList.filter(c => {
    const matchStatus = filtro === 'todas' || c.status === filtro;
    const matchBusca = c.nomeAluno.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const totalAberto = cobrancasList.filter(c => c.status === 'aberta' || c.status === 'parcial').reduce((s, c) => s + (c.valor - c.valorPago), 0);
  const totalVencido = cobrancasList.filter(c => c.status === 'vencida').reduce((s, c) => s + c.valor, 0);

  const handleRegistrarPagamento = (cobranca: Cobranca) => {
    setCobrancaSel(cobranca);
    setValorPagamento((cobranca.valor - cobranca.valorPago).toFixed(2));
    setPagamentoOpen(true);
  };

  const handleConfirmarPagamento = () => {
    if (!cobrancaSel) return;
    const valor = parseFloat(valorPagamento);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Informe um valor válido');
      return;
    }
    const restante = cobrancaSel.valor - cobrancaSel.valorPago;
    if (valor > restante) {
      toast.error(`Valor máximo: R$ ${restante.toFixed(2)}`);
      return;
    }
    setCobrancasList(prev => prev.map(c => {
      if (c.id !== cobrancaSel.id) return c;
      const novoPago = c.valorPago + valor;
      const novoStatus: CobrancaStatus = novoPago >= c.valor ? 'paga' : 'parcial';
      return {
        ...c,
        valorPago: novoPago,
        status: novoStatus,
        dataPagamento: novoStatus === 'paga' ? new Date().toISOString().split('T')[0] : c.dataPagamento,
      };
    }));
    toast.success(`Pagamento de R$ ${valor.toFixed(2)} registrado`);
    setPagamentoOpen(false);
    setCobrancaSel(null);
  };

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
          <Input placeholder="Buscar por aluno..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9 h-9 text-xs bg-secondary/50" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusTabs.map(s => (
            <Button key={s.value} variant={filtro === s.value ? 'default' : 'secondary'} size="sm" className="text-xs h-8" onClick={() => setFiltro(s.value)}>{s.label}</Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhuma cobrança encontrada" description="Tente ajustar os filtros de busca." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Aluno</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Vencimento</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{c.nomeAluno}</td>
                      <td className="py-3 px-4 text-muted-foreground">{c.descricao}</td>
                      <td className="py-3 px-4">
                        <span className="text-foreground">R$ {c.valor.toFixed(2)}</span>
                        {c.valorPago > 0 && c.valorPago < c.valor && (
                          <p className="text-muted-foreground text-[10px]">Pago: R$ {c.valorPago.toFixed(2)}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{c.dataVencimento}</td>
                      <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                      <td className="py-3 px-4">
                        {(c.status === 'aberta' || c.status === 'parcial' || c.status === 'vencida') && (
                          <Button size="sm" variant="secondary" className="text-[10px] h-7" onClick={() => handleRegistrarPagamento(c)}>
                            <CreditCard className="h-3 w-3 mr-1" />Pagar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.nomeAluno}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.descricao}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-foreground font-medium">R$ {c.valor.toFixed(2)}</span>
                    {c.valorPago > 0 && c.valorPago < c.valor && (
                      <span className="text-muted-foreground ml-2">Pago: R$ {c.valorPago.toFixed(2)}</span>
                    )}
                  </div>
                  <span className="text-muted-foreground">{c.dataVencimento}</span>
                </div>
                {(c.status === 'aberta' || c.status === 'parcial' || c.status === 'vencida') && (
                  <Button size="sm" className="w-full text-xs h-8 mt-1" onClick={() => handleRegistrarPagamento(c)}>
                    <CreditCard className="h-3 w-3 mr-1" />Registrar Pagamento
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dialog de pagamento */}
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
                <p className="text-muted-foreground">Restante: <span className="text-primary font-semibold">R$ {(cobrancaSel.valor - cobrancaSel.valorPago).toFixed(2)}</span></p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Valor do pagamento (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={valorPagamento}
                  onChange={e => setValorPagamento(e.target.value)}
                  className="h-9 text-sm bg-secondary/50"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setPagamentoOpen(false)} className="text-xs">Cancelar</Button>
            <Button onClick={handleConfirmarPagamento} className="text-xs">Confirmar Pagamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
