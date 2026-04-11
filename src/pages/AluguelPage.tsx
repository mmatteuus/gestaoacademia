import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { reservas, contratosAluguel } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function AluguelPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Aluguel da Academia"
        subtitle="Reservas, contratos e agenda de espaços"
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Nova Reserva</Button>}
      />

      <Tabs defaultValue="reservas">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="reservas" className="text-xs">Reservas</TabsTrigger>
          <TabsTrigger value="contratos" className="text-xs">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="reservas" className="mt-4 space-y-3">
          {reservas.map(r => (
            <div key={r.id} className={cn(
              "bg-card border rounded-lg p-4 hover:bg-accent/30 transition-colors",
              r.conflito ? "border-destructive/50" : "border-border"
            )}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {r.locatario}
                    {r.conflito && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.espaco}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                <span>{r.dataInicio}</span>
                <span>{r.horaInicio} - {r.horaFim}</span>
                <span className="text-foreground font-medium">R$ {r.valor.toFixed(2)}</span>
              </div>
              {r.conflito && (
                <div className="mt-2 text-[10px] text-destructive bg-destructive/10 rounded px-2 py-1">
                  ⚠ Conflito de horário detectado neste espaço
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="contratos" className="mt-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Locatário</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Espaço</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Período</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {contratosAluguel.map(c => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground font-medium">{c.locatario}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{c.espaco}</td>
                    <td className="py-3 px-4 text-foreground">R$ {c.valor.toFixed(2)}/{c.periodicidade === 'mensal' ? 'mês' : c.periodicidade}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{c.dataInicio} a {c.dataFim}</td>
                    <td className="py-3 px-4"><StatusBadge status={c.status === 'ativo' ? 'ativo' : 'inativo'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
