import { AlertTriangle, DollarSign } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';
import type { FinanceiroMetrics } from '../types/financeiro.types';
import { formatCurrency } from '../utils/financeiro.utils';

interface FinanceiroKpisProps {
  metrics: FinanceiroMetrics;
}

export function FinanceiroKpis({ metrics }: FinanceiroKpisProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <KpiCard
        label="Total em aberto"
        valor={formatCurrency(metrics.totalAberto)}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KpiCard
        label="Total vencido"
        valor={formatCurrency(metrics.totalVencido)}
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      <KpiCard label="Mensalidades pendentes" valor={metrics.mensalidadesPendentes} />
      <KpiCard label="Cobranças" valor={metrics.totalCobrancas} />
    </div>
  );
}
