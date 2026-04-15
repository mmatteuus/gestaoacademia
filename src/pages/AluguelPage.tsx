import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { reservas as reservasMock, contratosAluguel } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AluguelPage() {
  const [reservas, setReservas] = useState(reservasMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locatario, setLocatario] = useState('');
  const [espaco, setEspaco] = useState('Tatame Principal');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    if (!locatario.trim() || !dataInicio || !horaInicio || !horaFim || !valor) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    setReservas(prev => [
      {
        id: `res${Date.now()}`,
        locatario,
        espaco,
        dataInicio: dataInicio.split('-').reverse().join('/'),
        dataFim: dataInicio.split('-').reverse().join('/'),
        horaInicio,
        horaFim,
        status: 'confirmada' as const,
        valor: parseFloat(valor) || 0,
        conflito: false
      },
      ...prev
    ]);
    toast.success('Reserva confirmada com sucesso!');
    setDialogOpen(false);
    setLocatario('');
    setDataInicio('');
    setHoraInicio('');
    setHoraFim('');
    setValor('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aluguel da Academia"
        subtitle="Reservas, contratos e agenda de espaços"
        actions={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Nova Reserva</Button>}
      />

      <Tabs defaultValue="reservas">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="reservas" className="text-xs">Reservas</TabsTrigger>
          <TabsTrigger value="contratos" className="text-xs">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="reservas" className="mt-4 space-y-3">
          {reservas.length === 0 ? (
            <EmptyState title="Nenhuma reserva" />
          ) : (
            reservas.map(r => (
              <div key={r.id} className={cn(
                "bg-card border rounded-lg p-4 hover:bg-accent/30 transition-colors",
                r.conflito ? "border-destructive/50" : "border-border"
              )}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="truncate">{r.locatario}</span>
                      {r.conflito && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
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
            ))
          )}
        </TabsContent>

        <TabsContent value="contratos" className="mt-4">
          {contratosAluguel.length === 0 ? (
            <EmptyState title="Nenhum contrato" />
          ) : (
            <>
              <div className="hidden sm:block bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[500px]">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Locatário</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Espaço</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Período</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                      {contratosAluguel.map(c => (
                        <tr key={c.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-foreground font-medium">{c.locatario}</td>
                          <td className="py-3 px-4 text-muted-foreground">{c.espaco}</td>
                          <td className="py-3 px-4 text-foreground">R$ {c.valor.toFixed(2)}/{c.periodicidade === 'mensal' ? 'mês' : c.periodicidade}</td>
                          <td className="py-3 px-4 text-muted-foreground">{c.dataInicio} a {c.dataFim}</td>
                          <td className="py-3 px-4"><StatusBadge status={c.status === 'ativo' ? 'ativo' : 'inativo'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="sm:hidden space-y-3">
                {contratosAluguel.map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-lg p-4 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.locatario}</p>
                        <p className="text-xs text-muted-foreground">{c.espaco}</p>
                      </div>
                      <StatusBadge status={c.status === 'ativo' ? 'ativo' : 'inativo'} />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{c.dataInicio} a {c.dataFim}</span>
                      <span className="text-foreground font-medium">R$ {c.valor.toFixed(2)}/mês</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Form nova reserva */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nova Reserva</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Locatário / Cliente *</label>
              <input
                type="text"
                value={locatario}
                onChange={e => setLocatario(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="Nome do cliente"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Espaço *</label>
              <select
                value={espaco}
                onChange={e => setEspaco(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
              >
                <option value="Tatame Principal">Tatame Principal</option>
                <option value="Área de Musculação">Área de Musculação</option>
                <option value="Sala Multiuso">Sala Multiuso</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Data *</label>
              <input
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hora Início *</label>
              <input
                type="time"
                value={horaInicio}
                onChange={e => setHoraInicio(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hora Fim *</label>
              <input
                type="time"
                value={horaFim}
                onChange={e => setHoraFim(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Valor Aluguel (R$) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={e => setValor(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="Ex. 150.00"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Confirmar Reserva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
