import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '@/components/shared/EmptyState';
import type { RankingEntry } from '@/types';
import { AXIS_TICK, CHART_COLORS, TOOLTIP_STYLE } from '../constants/chart.constants';
import { MetricList } from './MetricList';
import { RelatorioCard } from './RelatorioCard';

interface RankingReportProps {
  ranking: RankingEntry[];
  series: string[];
  timeline: Record<string, string | number>[];
}

export function RankingReport({ ranking, series, timeline }: RankingReportProps) {
  const topRanking = ranking.slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RelatorioCard title="Top ranking atual">
        {topRanking.length > 0 ? (
          <MetricList
            items={topRanking.map((item) => ({
              label: `#${item.posicao} ${item.nomeAluno}`,
              detail: item.categoria,
              value: `${item.pontuacao} pts`,
            }))}
          />
        ) : (
          <EmptyState title="Sem dados de ranking" />
        )}
      </RelatorioCard>

      <RelatorioCard title="Evolução do ranking">
        {timeline.length > 0 && series.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend />
                {series.map((name, index) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="Sem histórico de ranking"
            description="A evolução será exibida quando houver registros mensais."
          />
        )}
      </RelatorioCard>
    </div>
  );
}
