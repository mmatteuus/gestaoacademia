import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '@/components/shared/EmptyState';
import { CHART_COLORS, TOOLTIP_STYLE } from '../constants/chart.constants';
import { MetricList } from './MetricList';
import { RelatorioCard } from './RelatorioCard';

interface AlunosReportProps {
  data: { name: string; value: number }[];
}

export function AlunosReport({ data }: AlunosReportProps) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RelatorioCard title="Status dos alunos">
        {hasData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                  {data.map((item, index) => (
                    <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => `${value} aluno(s)`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Nenhum aluno disponível" />
        )}
      </RelatorioCard>

      <RelatorioCard title="Resumo de alunos">
        <MetricList items={data.map((item) => ({ label: item.name, value: item.value }))} />
      </RelatorioCard>
    </div>
  );
}
