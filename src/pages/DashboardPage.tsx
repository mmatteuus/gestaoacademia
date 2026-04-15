import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KpiCard } from '@/components/shared/KpiCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/PageSkeleton';
import { alunos, alertas, atividadesRecentes, graduacoesAlunos, frequenciaMensal, receitaDespesaMensal, receitas, despesas, vendas } from '@/services/mocks/data';
import { Users, AlertTriangle, Award, DollarSign, TrendingDown, Package, Building2, CalendarCheck, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const quickActions = [
  { title: 'Novo aluno', description: 'Ir para o cadastro e gestão dos alunos.', href: '/alunos', icon: Users },
  { title: 'Lançar frequência', description: 'Acompanhar e registrar presença dos treinos.', href: '/frequencia', icon: CalendarCheck },
  { title: 'Mensalidades', description: 'Registrar pagamentos e abrir comprovantes.', href: '/financeiro', icon: DollarSign },
  { title: 'Campeonatos', description: 'Organizar eventos e adicionar atletas.', href: '/campeonatos', icon: Trophy },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const alunosAtivos = alunos.filter((aluno) => aluno.status === 'ativo').length;
  const inadimplentes = alunos.filter((aluno) => aluno.status === 'inadimplente').length;
  const aptosGraduacao = graduacoesAlunos.filter((graduacao) => graduacao.status === 'elegivel' || graduacao.status === 'aprovado').length;
  const receitaMes = receitas.reduce((sum, receita) => sum + receita.valor, 0);
  const despesaMes = despesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  const lucro = receitaMes - despesaMes;
  const vendasMes = vendas.reduce((sum, venda) => sum + venda.total, 0);
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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Ações rápidas</h2>
          <span className="text-xs text-muted-foreground">Atalhos para o uso diário</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href} className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/30">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{action.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard label="Alunos Ativos" valor={alunosAtivos} variacao={5} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Inadimplentes" valor={inadimplentes} variacao={-10} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Aptos p/ Graduação" valor={aptosGraduacao} icon={<Award className="h-4 w-4" />} />
        <KpiCard label="Ocupação" valor={`${ocupacao}%`} variacao={3} icon={<Building2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <KpiCard label="Receita do Mês" valor={`R$ ${receitaMes.toLocaleString('pt-BR')}`} variacao={8} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Despesas do Mês" valor={`R$ ${despesaMes.toLocaleString('pt-BR')}`} variacao={2} icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Lucro Estimado" valor={`R$ ${lucro.toLocaleString('pt-BR')}`} variacao={lucro > 0 ? 12 : -5} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Vendas do Mês" valor={`R$ ${vendasMes.toLocaleString('pt-BR')}`} variacao={15} icon={<Package className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 md:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Frequência Mensal (%)</h3>
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

        <div className="rounded-lg border border-border bg-card p-4 md:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Receita vs Despesa</h3>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 md:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Alertas Recentes</h3>
          <div className="space-y-3">
            {alertas.map((alerta) => (
              <div key={alerta.id} className="flex items-start gap-3 text-xs">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${alerta.tipo === 'urgente' ? 'bg-destructive' : alerta.tipo === 'aviso' ? 'bg-warning' : 'bg-info'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground">{alerta.mensagem}</p>
                  <p className="mt-0.5 text-muted-foreground">{alerta.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 md:p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Atividades Recentes</h3>
          <div className="space-y-3">
            {atividadesRecentes.map((atividade) => (
              <div key={atividade.id} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground">{atividade.descricao}</p>
                  <p className="mt-0.5 text-muted-foreground">{atividade.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
