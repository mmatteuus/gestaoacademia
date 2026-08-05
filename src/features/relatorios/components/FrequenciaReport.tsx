import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  AXIS_TICK,
  getHeatColor,
  TOOLTIP_STYLE,
  WEEK_DAYS,
} from '../constants/chart.constants';
import { RelatorioCard } from './RelatorioCard';

interface FrequenciaReportProps {
  mensal: { mes: string; presenca: number }[];
  heatmap: { dia: string; horario: string; presenca: number }[];
}

export function FrequenciaReport({ mensal, heatmap }: FrequenciaReportProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RelatorioCard title="Presença mensal">
        {mensal.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mensal}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => `${value}%`} />
                <Bar dataKey="presenca" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="Sem dados de frequência mensal" />
        )}
      </RelatorioCard>

      <RelatorioCard title="Heatmap de frequência">
        {heatmap.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="mb-2 grid grid-cols-7 gap-2 text-[10px] text-muted-foreground">
                {WEEK_DAYS.map((day) => <span key={day}>{day}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {heatmap.map((item, index) => (
                  <div
                    key={`${item.dia}-${item.horario}-${index}`}
                    className={`rounded-lg px-2 py-3 text-center text-[10px] ${getHeatColor(item.presenca)}`}
                  >
                    <div>{item.horario}</div>
                    <div className="font-semibold">{item.presenca}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="Sem dados para o heatmap" description="O heatmap será exibido quando as sessões tiverem horário e dia da semana." />
        )}
      </RelatorioCard>
    </div>
  );
}
