import { useState, useEffect } from 'react';
import { KpiCard } from '@/components/shared/KpiCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/PageSkeleton';
import { alunos, cobrancas, alertas, atividadesRecentes, graduacoesAlunos, frequenciaMensal, receitaDespesaMensal, receitas, despesas, vendas } from '@/services/mocks/data';
import { Users, AlertTriangle, Award, DollarSign, TrendingDown, Package, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const alunosAtivos = alunos.filter(a => a.status === 'ativo').length;
  const inadimplentes = alunos.filter(a => a.status === 'inadimplente').length;
  const aptosGraduacao = graduacoesAlunos.filter(g => g.status === 'elegivel' || g.status === 'aprovado').length;
  const receitaMes = receitas.reduce((s, r) => s + r.valor, 0);
  const despesaMes = despesas.reduce((s, d) => s + d.valor, 0);
  const lucro = receitaMes - despesaMes;
  const vendasMes = vendas.reduce((s, v) => s + v.total, 0);
  const ocupacao = Math.round((alunosAtivos / 60) * 100);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" subtitle="Visão geral da academia" />
        <KpiSkeleton count={4} />
        <KpiSkeleton count={4} />
        <div className="grid md:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Visão geral da academia" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard label="Alunos Ativos" valor={alunosAtivos} variacao={5} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Inadimplentes" valor={inadimplentes} variacao={-10} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Aptos p/ Graduação" valor={aptosGraduacao} icon={<Award className="h-4 w-4" />} />
        <KpiCard label="Ocupação" valor={`${ocupacao}%`} variacao={3} icon={<Building2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard label="Receita do Mês" valor={`R$ ${receitaMes.toLocaleString('pt-BR')}`} variacao={8} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Despesas do Mês" valor={`R$ ${despesaMes.toLocaleString('pt-BR')}`} variacao={2} icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Lucro Estimado" valor={`R$ ${lucro.toLocaleString('pt-BR')}`} variacao={lucro > 0 ? 12 : -5} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Vendas do Mês" valor={`R$ ${vendasMes.toLocaleString('pt-BR')}`} variacao={15} icon={<Package className="h-4 w-4" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Frequência Mensal (%)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequenciaMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="presenca" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Receita vs Despesa</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={receitaDespesaMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="receita" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="despesa" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Alertas Recentes</h3>
          <div className="space-y-3">
            {alertas.map(a => (
              <div key={a.id} className="flex items-start gap-3 text-xs">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${a.tipo === 'urgente' ? 'bg-destructive' : a.tipo === 'aviso' ? 'bg-warning' : 'bg-info'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground">{a.mensagem}</p>
                  <p className="text-muted-foreground mt-0.5">{a.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            {atividadesRecentes.map(at => (
              <div key={at.id} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground">{at.descricao}</p>
                  <p className="text-muted-foreground mt-0.5">{at.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
