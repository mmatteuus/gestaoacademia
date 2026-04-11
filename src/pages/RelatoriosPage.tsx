import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { alunos, cobrancas, graduacoesAlunos, ranking, vendas, frequenciaMensal, receitaDespesaMensal } from '@/mocks/data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--muted-foreground))'];

export default function RelatoriosPage() {
  const statusData = [
    { name: 'Ativo', value: alunos.filter(a => a.status === 'ativo').length },
    { name: 'Inadimplente', value: alunos.filter(a => a.status === 'inadimplente').length },
    { name: 'Trancado', value: alunos.filter(a => a.status === 'trancado').length },
    { name: 'Inativo', value: alunos.filter(a => a.status === 'inativo').length },
    { name: 'Pré-cadastro', value: alunos.filter(a => a.status === 'pre-cadastro').length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" subtitle="Visualizações analíticas" />

      <Tabs defaultValue="alunos">
        <TabsList className="bg-muted/50 flex-wrap h-auto">
          <TabsTrigger value="alunos" className="text-xs">Alunos</TabsTrigger>
          <TabsTrigger value="frequencia" className="text-xs">Frequência</TabsTrigger>
          <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
          <TabsTrigger value="graduacao" className="text-xs">Graduação</TabsTrigger>
        </TabsList>

        <TabsContent value="alunos" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição por Status</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frequencia" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Frequência Mensal (%)</h3>
            <div className="h-64">
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
        </TabsContent>

        <TabsContent value="financeiro" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Receita vs Despesa</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={receitaDespesaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12, color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="receita" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesa" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="graduacao" className="mt-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Alunos por Status de Graduação</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {(['nao-elegivel', 'elegivel', 'aprovado', 'graduado'] as const).map(status => (
                <div key={status} className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{graduacoesAlunos.filter(g => g.status === status).length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                    {status === 'nao-elegivel' ? 'Não Elegível' : status === 'elegivel' ? 'Elegível' : status === 'aprovado' ? 'Aprovado' : 'Graduado'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
