import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { despesas, receitas, receitaDespesaMensal } from '@/mocks/data';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FinanceiroGerencialPage() {
  const totalReceitas = receitas.reduce((s, r) => s + r.valor, 0);
  const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  const lucro = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro Gerencial" subtitle="Fluxo de caixa e visão consolidada" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Receitas" valor={`R$ ${totalReceitas.toLocaleString('pt-BR')}`} variacao={8} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Despesas" valor={`R$ ${totalDespesas.toLocaleString('pt-BR')}`} variacao={2} icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Lucro" valor={`R$ ${lucro.toLocaleString('pt-BR')}`} icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Fluxo de Caixa" valor={lucro > 0 ? 'Positivo' : 'Negativo'} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Receita vs Despesa por Mês</h3>
        <div className="h-56">
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

      <Tabs defaultValue="receitas">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="receitas" className="text-xs">Receitas</TabsTrigger>
          <TabsTrigger value="despesas" className="text-xs">Despesas</TabsTrigger>
        </TabsList>
        <TabsContent value="receitas" className="mt-4">
          {receitas.length === 0 ? <EmptyState title="Nenhuma receita" /> : (
            <>
              <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[450px]">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Descrição</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Categoria</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Data</th>
                    </tr></thead>
                    <tbody>
                      {receitas.map(r => (
                        <tr key={r.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-foreground">{r.descricao}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.categoria}</td>
                          <td className="py-3 px-4 text-success font-medium">R$ {r.valor.toLocaleString('pt-BR')}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="sm:hidden space-y-3">
                {receitas.map(r => (
                  <div key={r.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.descricao}</p>
                      <p className="text-xs text-muted-foreground">{r.categoria} • {r.data}</p>
                    </div>
                    <span className="text-sm text-success font-semibold whitespace-nowrap">R$ {r.valor.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="despesas" className="mt-4">
          {despesas.length === 0 ? <EmptyState title="Nenhuma despesa" /> : (
            <>
              <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[450px]">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Descrição</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Categoria</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                      {despesas.map(d => (
                        <tr key={d.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-foreground">{d.descricao}</td>
                          <td className="py-3 px-4 text-muted-foreground">{d.categoria}</td>
                          <td className="py-3 px-4 text-destructive font-medium">R$ {d.valor.toLocaleString('pt-BR')}</td>
                          <td className="py-3 px-4"><StatusBadge status={d.status === 'paga' ? 'paga' : 'aberta'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="sm:hidden space-y-3">
                {despesas.map(d => (
                  <div key={d.id} className="bg-card border border-border rounded-lg p-4 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{d.descricao}</p>
                      <StatusBadge status={d.status === 'paga' ? 'paga' : 'aberta'} />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{d.categoria}</span>
                      <span className="text-destructive font-medium">R$ {d.valor.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
