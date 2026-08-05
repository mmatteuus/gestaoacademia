import { Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '@/components/shared/EmptyState';
import { TOOLTIP_STYLE } from '../constants/chart.constants';
import { MetricList } from './MetricList';
import { RelatorioCard } from './RelatorioCard';

interface GraduacaoReportProps {
  data: { name: string; value: number; fill: string }[];
}

export function GraduacaoReport({ data }: GraduacaoReportProps) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RelatorioCard title="Funil da graduação">
        {hasData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => `${value} aluno(s)`} />
                <Funnel dataKey="value" data={data} isAnimationActive>
                  <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Sem dados de graduação" />
        )}
      </RelatorioCard>

      <RelatorioCard title="Status de graduação">
        <MetricList items={data.map((item) => ({ label: item.name, value: item.value }))} />
      </RelatorioCard>
    </div>
  );
}
