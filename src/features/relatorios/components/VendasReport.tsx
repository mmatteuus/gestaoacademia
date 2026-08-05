import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '@/components/shared/EmptyState';
import { CHART_COLORS, TOOLTIP_STYLE } from '../constants/chart.constants';
import { MetricList } from './MetricList';
import { RelatorioCard } from './RelatorioCard';

interface VendasReportProps {
  resumo: {
    quantidade: number;
    total: number;
  };
  distribuicao: { categoria: string; total: number }[];
}

export function VendasReport({ resumo, distribuicao }: VendasReportProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RelatorioCard title="Resumo de vendas">
        <MetricList
          items={[
            { label: 'Vendas registradas', value: resumo.quantidade },
            {
              label: 'Total vendido',
              value: resumo.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            },
          ]}
        />
      </RelatorioCard>

      <RelatorioCard title="Distribuição de vendas">
        {distribuicao.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicao}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="categoria"
                >
                  {distribuicao.map((item, index) => (
                    <Cell key={item.categoria} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Sem vendas por categoria" />
        )}
      </RelatorioCard>
    </div>
  );
}
