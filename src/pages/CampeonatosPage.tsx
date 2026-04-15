import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { campeonatos as campeonatosMock } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const medalIcons: Record<string, string> = { ouro: '🥇', prata: '🥈', bronze: '🥉' };

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState(campeonatosMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');

  const handleSalvar = () => {
    if (!nome.trim() || !data.trim()) {
      toast.error('Preencha os campos obrigatórios (Nome e Data)');
      return;
    }
    
    setCampeonatos(prev => [
      {
        id: `c${Date.now()}`,
        nome,
        data,
        local: local || 'A definir',
        status: 'planejado' as const,
        modalidade: 'Geral', // mocked
        participantes: [],
      },
      ...prev
    ]);
    toast.success('Campeonato agendado com sucesso!');
    setDialogOpen(false);
    setNome('');
    setData('');
    setLocal('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campeonatos"
        subtitle={`${campeonatos.length} campeonatos registrados`}
        actions={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Novo Campeonato</Button>}
      />

      {campeonatos.length === 0 ? (
        <EmptyState title="Nenhum campeonato registrado" />
      ) : (
        <div className="space-y-4">
          {campeonatos.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:bg-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{c.nome}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.data} • {c.local} • {c.modalidade}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Participantes ({c.participantes.length})</p>
                {c.participantes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {c.participantes.map(p => (
                      <div key={p.alunoId} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2 text-xs">
                        <span className="text-foreground truncate">{p.nomeAluno}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {p.medalha && <span>{medalIcons[p.medalha]}</span>}
                          {p.pontuacao !== undefined && <span className="text-primary font-semibold">{p.pontuacao}pts</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum participante confirmado ainda.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form novo campeonato */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Novo Campeonato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome do Evento *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="Ex. Copa de Jiu-Jitsu"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Data *</label>
              <input
                type="date"
                value={data}
                onChange={e => setData(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Local</label>
              <input
                type="text"
                value={local}
                onChange={e => setLocal(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="Ex. Ginásio Municipal"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>Agendar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
