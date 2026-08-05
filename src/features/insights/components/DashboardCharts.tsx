import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface FrequenciaMensalItem {
  mes: string;
  presenca: number;
}

interface ReceitaDespesaItem {
  mes: string;
  receita: number;
  despesa: number;
}

interface DashboardChartsProps {
  frequenciaMensal: FrequenciaMensalItem[];
  receitaDespesaMensal: ReceitaDespesaItem[];
}

const axisTick = {
  fontSize: 11,
  fill: 'hsl(var(--muted-foreground))',
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
  color: 'hsl(var(--foreground))',
};

export function DashboardCharts({
  frequenciaMensal,
  receitaDespesaMensal,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-lg border border-border bg-card p-4 md:p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Presença Mensal</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequenciaMensal}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="mes"
                tick={axisTick}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="presenca"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4 md:p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Receitas x Despesas
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={receitaDespesaMensal}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="mes"
                tick={axisTick}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="despesa"
                stroke="hsl(var(--destructive))"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
