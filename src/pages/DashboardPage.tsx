import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { KpiCard } from '@/components/shared/KpiCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/PageSkeleton';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import { Users, AlertTriangle, Award, DollarSign, TrendingDown, Package, Building2, CalendarCheck, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const quickActions = [
  { label: 'Novo aluno', to: '/alunos', icon: Users },
  { label: 'Lançar frequência', to: '/frequencia', icon: CalendarCheck },
  { label: 'Novo campeonato', to: '/campeonatos', icon: Trophy },
  { label: 'Registrar venda', to: '/produtos', icon: Package },
];

export default function DashboardPage() {
  const { alunosList } = useAcademiaData();
  const { cobrancasList, vendasList } = useOperacionalData();
  const {
    alertas,
    atividadesRecentes,
    graduacoesAlunos,
    frequenciaMensal,
    receitaDespesaMensal,
    receitas,
    despesas,
  } = useInsightsData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const alunosAtivos = useMemo(
    () => alunosList.filter((aluno) => aluno.status === 'ativo').length,
    [alunosList]
  );
  const inadimplentes = useMemo(
    () => alunosList.filter((aluno) => aluno.status === 'inadimplente').length,
    [alunosList]
  );
  const aptosGraduacao = useMemo(
    () => graduacoesAlunos.filter((item) => item.status === 'elegivel' || item.status === 'aprovado').length,
    [graduacoesAlunos]
  );
  const receitaMes = useMemo(() => receitas.reduce((soma, item) => soma + item.valor, 0), [receitas]);
  const despesaMes = useMemo(() => despesas.reduce((soma, item) => soma + item.valor, 0), [despesas]);
  const lucro = receitaMes - despesaMes;
  const vendasMes = useMemo(() => vendasList.reduce((soma, item) => soma + item.total, 0), [vendasList]);
  const ocupacao = Math.round((alunosAtivos / 60) * 100);
  const cobrancasEmAberto = useMemo(
    () => cobrancasList.filter((item) => item.status === 'aberta' || item.status === 'parcial' || item.status === 'vencida').length,
    [cobrancasList]
  );

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

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Ações rápidas</h3>
            <p className="text-xs text-muted-foreground">Atalhos para o uso diário da academia</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map((action) => (
            <Button key={action.to} asChild variant="secondary" className="h-11 justify-between rounded-xl px-3 text-xs">
              <Link to={action.to}>
                <span className="flex items-center gap-2">
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ))}
        </div>
      </div>

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
        <KpiCard label="Vendas do Mês" valor={`R$ ${vendasMes.toLocaleString('pt-BR')}`} variacao={6} icon={<Package className="h-4 w-4" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Presença Mensal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequenciaMensal}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="presenca" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Receitas x Despesas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={receitaDespesaMensal}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="despesa" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Alertas</h3>
            <span className="text-xs text-muted-foreground">{cobrancasEmAberto} pendência(s)</span>
          </div>
          <div className="space-y-3">
            {alertas.map((alerta) => (
              <div key={alerta.id} className="flex items-start gap-3 text-xs">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${alerta.tipo === 'urgente' ? 'bg-destructive' : alerta.tipo === 'aviso' ? 'bg-warning' : 'bg-info'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground">{alerta.mensagem}</p>
                  <p className="text-muted-foreground mt-0.5">{alerta.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            {atividadesRecentes.map((atividade) => (
              <div key={atividade.id} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground">{atividade.descricao}</p>
                  <p className="text-muted-foreground mt-0.5">{atividade.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
