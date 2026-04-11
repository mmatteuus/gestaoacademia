import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { alunos, cobrancas, graduacoesAlunos, ranking, vendas, frequenciaMensal, receitaDespesaMensal, frequenciaHeatmap, rankingEvolucao, vendasPorCategoria } from '@/mocks/data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend, FunnelChart, Funnel, LabelList
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--muted-foreground))'];
const RANKING_COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--muted-foreground))'];
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
  const statusData = [
    { name: 'Ativo', value: alunos.filter(a => a.status === 'ativo').length },
    { name: 'Inadimplente', value: alunos.filter(a => a.status === 'inadimplente').length },
    { name: 'Trancado', value: alunos.filter(a => a.status === 'trancado').length },
    { name: 'Inativo', value: alunos.filter(a => a.status === 'inativo').length },
    { name: 'Pré-cadastro', value: alunos.filter(a => a.status === 'pre-cadastro').length },
  ];

  const funilGraduacao = [
    { name: 'Não Elegível', value: graduacoesAlunos.filter(g => g.status === 'nao-elegivel').length, fill: 'hsl(var(--muted-foreground))' },
    { name: 'Elegível', value: graduacoesAlunos.filter(g => g.status === 'elegivel').length, fill: 'hsl(var(--warning))' },
    { name: 'Aprovado', value: graduacoesAlunos.filter(g => g.status === 'aprovado').length, fill: 'hsl(var(--info))' },
    { name: 'Graduado', value: graduacoesAlunos.filter(g => g.status === 'graduado').length, fill: 'hsl(var(--success))' },
  ];

  const inadimplenciaData = [
    { name: 'Paga', value: cobrancas.filter(c => c.status === 'paga').length },
    { name: 'Aberta', value: cobrancas.filter(c => c.status === 'aberta').length },
    { name: 'Parcial', value: cobrancas.filter(c => c.status === 'parcial').length },
    { name: 'Vencida', value: cobrancas.filter(c => c.status === 'vencida').length },
    { name: 'Cancelada', value: cobrancas.filter(c => c.status === 'cancelada').length },
  ];

  const rankingAdulto = rankingEvolucao.map(r => ({
    mes: r.mes,
    'Thiago Ribeiro': r['Thiago Ribeiro'],
    'Ana Costa': r['Ana Costa'],
    'Marina Silva': r['Marina Silva'],
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

        {/* === ALUNOS === */}
        <TabsContent value="alunos" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição por Status</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Inadimplência por Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inadimplenciaData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* === FREQUÊNCIA com HEATMAP === */}
        <TabsContent value="frequencia" className="mt-4 space-y-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Frequência Mensal (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequenciaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="presenca" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Heatmap de Frequência — Semana × Dia (%)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-muted-foreground font-medium py-2 pr-3">Semana</th>
                    {DIAS.map(d => (
                      <th key={d} className="text-center text-muted-foreground font-medium py-2 px-2 min-w-[52px]">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {frequenciaHeatmap.map(row => (
                    <tr key={row.semana}>
                      <td className="text-foreground font-medium py-1.5 pr-3 whitespace-nowrap">{row.semana}</td>
                      {DIAS.map(dia => {
                        const val = row[dia as keyof typeof row] as number;
                        return (
                          <td key={dia} className="py-1.5 px-1">
                            <div className={`rounded-md text-center py-2 font-semibold text-xs transition-colors ${getHeatColor(val)}`}>
                              {val}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
              <span>Baixo</span>
              <div className="flex gap-0.5">
                <div className="w-5 h-3 rounded-sm bg-muted/40" />
                <div className="w-5 h-3 rounded-sm bg-primary/20" />
                <div className="w-5 h-3 rounded-sm bg-primary/35" />
                <div className="w-5 h-3 rounded-sm bg-primary/60" />
                <div className="w-5 h-3 rounded-sm bg-primary/90" />
              </div>
              <span>Alto</span>
            </div>
          </div>
        </TabsContent>

        {/* === FINANCEIRO === */}
        <TabsContent value="financeiro" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Receita vs Despesa</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={receitaDespesaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="receita" name="Receita" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesa" name="Despesa" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* === GRADUAÇÃO com FUNIL === */}
        <TabsContent value="graduacao" className="mt-4 space-y-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Funil de Graduação</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {funilGraduacao.map((item, i) => {
                const maxVal = Math.max(...funilGraduacao.map(f => f.value), 1);
                const widthPct = Math.max((item.value / maxVal) * 100, 20);
                return (
                  <div key={item.name} className="flex flex-col items-center">
                    <div
                      className="rounded-lg flex items-center justify-center font-bold text-lg text-foreground transition-all duration-300"
                      style={{
                        width: `${widthPct}%`,
                        minWidth: 48,
                        height: 56,
                        backgroundColor: item.fill,
                        opacity: 0.85 + i * 0.05,
                      }}
                    >
                      {item.value}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-2 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-1 mt-4">
              {funilGraduacao.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span>{item.name}</span>
                  {i < funilGraduacao.length - 1 && <span className="mx-1 text-border">→</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Progresso Individual de Graduação</h3>
            <div className="space-y-3">
              {graduacoesAlunos.filter(g => g.aulasNecessarias > 0).map(g => {
                const aluno = alunos.find(a => a.id === g.alunoId);
                const pct = Math.min((g.aulasRealizadas / g.aulasNecessarias) * 100, 100);
                return (
                  <div key={g.alunoId} className="flex items-center gap-3">
                    <span className="text-xs text-foreground w-32 truncate">{aluno?.nome}</span>
                    <div className="flex-1 bg-muted/30 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 100 ? 'hsl(var(--success))' : 'hsl(var(--primary))',
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-20 text-right">
                      {g.aulasRealizadas}/{g.aulasNecessarias} aulas
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* === RANKING EVOLUÇÃO === */}
        <TabsContent value="ranking" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Evolução do Ranking — Adulto</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankingAdulto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis reversed domain={[1, 3]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} label={{ value: 'Posição', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))', fontSize: 10 } }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Thiago Ribeiro" stroke={RANKING_COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Ana Costa" stroke={RANKING_COLORS[1]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Marina Silva" stroke={RANKING_COLORS[2]} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">* Posição menor = melhor colocação</p>
          </div>
        </TabsContent>

        {/* === VENDAS === */}
        <TabsContent value="vendas" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Vendas por Categoria (R$)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendasPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="categoria" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição de Vendas</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={vendasPorCategoria} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3} dataKey="total" nameKey="categoria" label={({ categoria, total }) => `${categoria}: R$${total}`}>
                      {vendasPorCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
