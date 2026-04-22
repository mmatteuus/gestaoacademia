import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, XCircle, CalendarCheck, Plus } from 'lucide-react';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { toast } from 'sonner';
import type { SessaoAula } from '@/types';

export default function FrequenciaPage() {
  const { turmasList, alunosList, sessoesList, addSessao } = useAcademiaData();
  const [turmaSel, setTurmaSel] = useState('');
  const [novaOpen, setNovaOpen] = useState(false);
  const [novaData, setNovaData] = useState(new Date().toISOString().split('T')[0]);
  const [novaPresencas, setNovaPresencas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!turmaSel && turmasList.length > 0) {
      setTurmaSel(turmasList[0].id);
    }
  }, [turmaSel, turmasList]);

  const sessoes = sessoesList.filter((sessao) => sessao.turmaId === turmaSel);
  const turma = turmasList.find((item) => item.id === turmaSel);

  const handleNovaFrequencia = () => {
    if (!turma) return;
    if (turma.alunoIds.length === 0) {
      toast.error('Esta turma ainda não possui alunos vinculados.');
      return;
    }
    const presencas: Record<string, boolean> = {};
    turma.alunoIds.forEach((id) => {
      presencas[id] = true;
    });
    setNovaPresencas(presencas);
    setNovaData(new Date().toISOString().split('T')[0]);
    setNovaOpen(true);
  };

  const handleSalvarFrequencia = async () => {
    if (!turma) return;
    const novaSessao: SessaoAula = {
      id: `s${Date.now()}`,
      turmaId: turmaSel,
      data: novaData,
      professor: turma.professor,
      presencas: Object.entries(novaPresencas).map(([alunoId, presente]) => ({ alunoId, presente })),
    };

    const result = await addSessao(novaSessao);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível salvar a frequência.');
      return;
    }

    toast.success('Frequência registrada com sucesso');
    setNovaOpen(false);
  };

  const togglePresenca = (alunoId: string) => {
    setNovaPresencas((prev) => ({ ...prev, [alunoId]: !prev[alunoId] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequência"
        subtitle="Lançamento e acompanhamento de presença"
        actions={
          <Button size="sm" onClick={handleNovaFrequencia} disabled={!turma}>
            <Plus className="h-4 w-4 mr-1" />Lançar Presença
          </Button>
        }
      />

      {turmasList.length === 0 ? (
        <EmptyState title="Nenhuma turma cadastrada" description="Crie uma turma primeiro para lançar frequência." />
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {turmasList.map((item) => (
              <Button key={item.id} variant={turmaSel === item.id ? 'default' : 'secondary'} size="sm" className="text-xs" onClick={() => setTurmaSel(item.id)}>
                {item.nome}
              </Button>
            ))}
          </div>

          {sessoes.length === 0 ? (
            <EmptyState title="Nenhuma sessão registrada" description="Clique em 'Lançar Presença' para registrar a primeira aula." />
          ) : (
            <div className="space-y-4">
              {sessoes.map((sessao) => (
                <div key={sessao.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{sessao.data}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">• {sessao.professor}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {sessao.presencas.filter((presenca) => presenca.presente).length}/{sessao.presencas.length} presentes
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {sessao.presencas.map((presenca) => {
                      const aluno = alunosList.find((item) => item.id === presenca.alunoId);
                      return (
                        <div key={presenca.alunoId} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md border ${presenca.presente ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
                          {presenca.presente ? <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                          <span className="text-foreground truncate">{aluno?.nome || presenca.alunoId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={novaOpen} onOpenChange={setNovaOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Lançar Frequência — {turma?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="data-aula" className="text-xs text-muted-foreground mb-1 block">Data da aula</label>
              <input id="data-aula" type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Marque os alunos presentes:</p>
              <div className="space-y-2">
                {turma?.alunoIds.map((id) => {
                  const aluno = alunosList.find((item) => item.id === id);
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
