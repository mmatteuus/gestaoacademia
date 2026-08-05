import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '@/components/shared/EmptyState';
import { AXIS_TICK, CHART_COLORS, TOOLTIP_STYLE } from '../constants/chart.constants';
import { RelatorioCard } from './RelatorioCard';

interface FinanceiroReportProps {
  mensal: { mes: string; receita: number; despesa: number }[];
  cobrancas: { name: string; value: number }[];
}

export function FinanceiroReport({ mensal, cobrancas }: FinanceiroReportProps) {
  const hasCobrancas = cobrancas.some((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RelatorioCard title="Receita x despesa">
        {mensal.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mensal}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="despesa" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Sem dados financeiros mensais" />
        )}
      </RelatorioCard>

      <RelatorioCard title="Situação das cobranças">
        {hasCobrancas ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cobrancas} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={3}>
                  {cobrancas.map((item, index) => (
                    <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => `${value} cobrança(s)`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Nenhuma cobrança disponível" />
        )}
      </RelatorioCard>
    </div>
  );
}
