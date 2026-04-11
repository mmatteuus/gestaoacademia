import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { KpiCard } from '@/components/shared/KpiCard';
import { cobrancas } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, AlertTriangle } from 'lucide-react';
import type { CobrancaStatus } from '@/types';

const statusTabs: { label: string; value: CobrancaStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Abertas', value: 'aberta' },
  { label: 'Vencidas', value: 'vencida' },
  { label: 'Pagas', value: 'paga' },
  { label: 'Parciais', value: 'parcial' },
];

export default function FinanceiroPage() {
  const [filtro, setFiltro] = useState<CobrancaStatus | 'todas'>('todas');
  const [busca, setBusca] = useState('');

  const filtered = cobrancas.filter(c => {
    const matchStatus = filtro === 'todas' || c.status === filtro;
    const matchBusca = c.nomeAluno.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const totalAberto = cobrancas.filter(c => c.status === 'aberta' || c.status === 'parcial').reduce((s, c) => s + (c.valor - c.valorPago), 0);
  const totalVencido = cobrancas.filter(c => c.status === 'vencida').reduce((s, c) => s + c.valor, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro Escolar" subtitle="Cobranças, mensalidades e pagamentos" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard label="Total em Aberto" valor={`R$ ${totalAberto.toLocaleString('pt-BR')}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Total Vencido" valor={`R$ ${totalVencido.toLocaleString('pt-BR')}`} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Cobranças" valor={cobrancas.length} />
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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Aluno</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Descrição</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Vencimento</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{c.nomeAluno}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{c.descricao}</td>
                  <td className="py-3 px-4">
                    <span className="text-foreground">R$ {c.valor.toFixed(2)}</span>
                    {c.valorPago > 0 && c.valorPago < c.valor && (
                      <p className="text-muted-foreground text-[10px]">Pago: R$ {c.valorPago.toFixed(2)}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{c.dataVencimento}</td>
                  <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
