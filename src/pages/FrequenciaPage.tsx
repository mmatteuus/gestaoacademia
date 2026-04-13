import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { sessoesAula as sessoesMock, turmas, alunos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, CalendarCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { SessaoAula } from '@/types';

export default function FrequenciaPage() {
  const [turmaSel, setTurmaSel] = useState(turmas[0].id);
  const [sessoesList, setSessoesList] = useState<SessaoAula[]>(sessoesMock);
  const [novaOpen, setNovaOpen] = useState(false);
  const [novaData, setNovaData] = useState(new Date().toISOString().split('T')[0]);
  const [novaPresencas, setNovaPresencas] = useState<Record<string, boolean>>({});

  const sessoes = sessoesList.filter(s => s.turmaId === turmaSel);
  const turma = turmas.find(t => t.id === turmaSel);

  const handleNovaFrequencia = () => {
    if (!turma) return;
    const presencas: Record<string, boolean> = {};
    turma.alunoIds.forEach(id => { presencas[id] = true; });
    setNovaPresencas(presencas);
    setNovaData(new Date().toISOString().split('T')[0]);
    setNovaOpen(true);
  };

  const handleSalvarFrequencia = () => {
    if (!turma) return;
    const novaSessao: SessaoAula = {
      id: `s${Date.now()}`,
      turmaId: turmaSel,
      data: novaData,
      professor: turma.professor,
      presencas: Object.entries(novaPresencas).map(([alunoId, presente]) => ({ alunoId, presente })),
    };
    setSessoesList(prev => [novaSessao, ...prev]);
    toast.success('Frequência registrada com sucesso');
    setNovaOpen(false);
  };

  const togglePresenca = (alunoId: string) => {
    setNovaPresencas(prev => ({ ...prev, [alunoId]: !prev[alunoId] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequência"
        subtitle="Lançamento e acompanhamento de presença"
        actions={
          <Button size="sm" onClick={handleNovaFrequencia}>
            <Plus className="h-4 w-4 mr-1" />Lançar Presença
          </Button>
        }
      />

      <div className="flex gap-2 flex-wrap">
        {turmas.map(t => (
          <Button key={t.id} variant={turmaSel === t.id ? 'default' : 'secondary'} size="sm" className="text-xs" onClick={() => setTurmaSel(t.id)}>
            {t.nome}
          </Button>
        ))}
      </div>

      {sessoes.length === 0 ? (
        <EmptyState title="Nenhuma sessão registrada" description="Clique em 'Lançar Presença' para registrar a primeira aula." />
      ) : (
        <div className="space-y-4">
          {sessoes.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{s.data}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">• {s.professor}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {s.presencas.filter(p => p.presente).length}/{s.presencas.length} presentes
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {s.presencas.map(p => {
                  const aluno = alunos.find(a => a.id === p.alunoId);
                  return (
                    <div key={p.alunoId} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md border ${p.presente ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
                      {p.presente ? <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                      <span className="text-foreground truncate">{aluno?.nome || p.alunoId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog lançar frequência */}
      <Dialog open={novaOpen} onOpenChange={setNovaOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Lançar Frequência — {turma?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Data da aula</label>
              <input
                type="date"
                value={novaData}
                onChange={e => setNovaData(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Marque os alunos presentes:</p>
              <div className="space-y-2">
                {turma?.alunoIds.map(id => {
                  const aluno = alunos.find(a => a.id === id);
                  const presente = novaPresencas[id] ?? false;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePresenca(id)}
                      className={`w-full flex items-center gap-3 text-xs px-4 py-3 rounded-lg border transition-colors ${presente ? 'bg-success/10 border-success/30 text-foreground' : 'bg-destructive/10 border-destructive/30 text-muted-foreground'}`}
                    >
                      {presente ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                      <span className="text-sm">{aluno?.nome || id}</span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider">{presente ? 'Presente' : 'Ausente'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setNovaOpen(false)} className="text-xs">Cancelar</Button>
            <Button onClick={handleSalvarFrequencia} className="text-xs">Salvar Frequência</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
