import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { useOperacionalData } from '@/features/operacional/OperacionalDataProvider';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend, FunnelChart, Funnel, LabelList
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--muted-foreground))'];
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
  color: 'hsl(var(--foreground))',
};

function getHeatColor(value: number) {
  if (value >= 90) return 'bg-primary/90 text-primary-foreground';
  if (value >= 80) return 'bg-primary/60 text-primary-foreground';
  if (value >= 70) return 'bg-primary/35 text-foreground';
  if (value >= 50) return 'bg-primary/20 text-foreground';
  return 'bg-muted/40 text-muted-foreground';
}

export default function RelatoriosPage() {
  const { alunosList } = useAcademiaData();
  const { cobrancasList, vendasList } = useOperacionalData();
  const {
    graduacoesAlunos,
    ranking,
    frequenciaMensal,
    receitaDespesaMensal,
    frequenciaHeatmap,
    rankingEvolucao,
    vendasPorCategoria,
  } = useInsightsData();

  const statusData = [
    { name: 'Ativo', value: alunosList.filter((item) => item.status === 'ativo').length },
    { name: 'Inadimplente', value: alunosList.filter((item) => item.status === 'inadimplente').length },
    { name: 'Trancado', value: alunosList.filter((item) => item.status === 'trancado').length },
    { name: 'Inativo', value: alunosList.filter((item) => item.status === 'inativo').length },
    { name: 'Pré-cadastro', value: alunosList.filter((item) => item.status === 'pre-cadastro').length },
  ];

  const funilGraduacao = [
    { name: 'Não Elegível', value: graduacoesAlunos.filter((item) => item.status === 'nao-elegivel').length, fill: 'hsl(var(--muted-foreground))' },
    { name: 'Elegível', value: graduacoesAlunos.filter((item) => item.status === 'elegivel').length, fill: 'hsl(var(--warning))' },
    { name: 'Aprovado', value: graduacoesAlunos.filter((item) => item.status === 'aprovado').length, fill: 'hsl(var(--info))' },
    { name: 'Graduado', value: graduacoesAlunos.filter((item) => item.status === 'graduado').length, fill: 'hsl(var(--success))' },
  ];

  const inadimplenciaData = [
    { name: 'Paga', value: cobrancasList.filter((item) => item.status === 'paga').length },
    { name: 'Aberta', value: cobrancasList.filter((item) => item.status === 'aberta').length },
    { name: 'Parcial', value: cobrancasList.filter((item) => item.status === 'parcial').length },
    { name: 'Vencida', value: cobrancasList.filter((item) => item.status === 'vencida').length },
    { name: 'Cancelada', value: cobrancasList.filter((item) => item.status === 'cancelada').length },
  ];

  const rankingAdulto = rankingEvolucao.map((item) => ({
    mes: String(item.mes),
    'Thiago Ribeiro': Number(item['Thiago Ribeiro'] || 0),
    'Ana Costa': Number(item['Ana Costa'] || 0),
    'Marina Silva': Number(item['Marina Silva'] || 0),
  }));

  const vendasDistribuicao = vendasPorCategoria.map((item) => ({
    categoria: String(item.categoria),
    total: Number((item as { total?: number; valor?: number }).total ?? (item as { total?: number; valor?: number }).valor ?? 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" subtitle="Visualizações analíticas avançadas" />

      <Tabs defaultValue="alunos">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="alunos" className="text-xs">Alunos</TabsTrigger>
          <TabsTrigger value="frequencia" className="text-xs">Frequência</TabsTrigger>
          <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
          <TabsTrigger value="graduacao" className="text-xs">Graduação</TabsTrigger>
          <TabsTrigger value="ranking" className="text-xs">Ranking</TabsTrigger>
          <TabsTrigger value="vendas" className="text-xs">Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="alunos" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Status dos Alunos</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                      {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value} aluno(s)`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Resumo de Alunos</h3>
              <div className="space-y-3">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frequencia" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Presença Mensal</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequenciaMensal}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}%`} />
                    <Bar dataKey="presenca" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Heatmap de Frequência</h3>
              <div className="overflow-x-auto">
                <div className="min-w-[420px]">
                  <div className="grid grid-cols-7 gap-2 text-[10px] text-muted-foreground mb-2">
                    {DIAS.map((dia) => <span key={dia}>{dia}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {frequenciaHeatmap.map((item, index) => (
                      <div key={`${item.dia}-${item.horario}-${index}`} className={`rounded-lg px-2 py-3 text-center text-[10px] ${getHeatColor(item.presenca)}`}>
                        <div>{item.horario}</div>
                        <div className="font-semibold">{item.presenca}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financeiro" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Receita x Despesa</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={receitaDespesaMensal}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="despesa" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Situação das Cobranças</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={inadimplenciaData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={3}>
                      {inadimplenciaData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value} cobrança(s)`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="graduacao" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Funil da Graduação</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value} aluno(s)`} />
                    <Funnel dataKey="value" data={funilGraduacao} isAnimationActive>
                      <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Status de Graduação</h3>
              <div className="space-y-3">
                {funilGraduacao.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Top Ranking Atual</h3>
              <div className="space-y-3">
                {ranking.slice(0, 5).map((item) => (
                  <div key={item.alunoId} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-foreground">#{item.posicao} {item.nomeAluno}</p>
                      <p className="text-xs text-muted-foreground">{item.categoria}</p>
                    </div>
                    <span className="font-semibold text-foreground">{item.pontuacao} pts</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Evolução do Ranking</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rankingAdulto}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="Thiago Ribeiro" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="Ana Costa" stroke="hsl(var(--success))" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="Marina Silva" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vendas" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Resumo de Vendas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Vendas registradas</span>
                  <span className="font-semibold text-foreground">{vendasList.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Total vendido</span>
                  <span className="font-semibold text-foreground">R$ {vendasList.reduce((soma, item) => soma + item.total, 0).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição de Vendas</h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={vendasDistribuicao} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3} dataKey="total" nameKey="categoria" label={({ categoria, total }) => `${categoria}: R$${total}`}>
                      {vendasDistribuicao.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
