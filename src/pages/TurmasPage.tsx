import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { turmas as turmasMock, alunos } from '@/services/mocks/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Users, Pencil } from 'lucide-react';
import { TurmaForm } from '@/components/forms/TurmaForm';
import { toast } from 'sonner';
import type { Turma } from '@/types';

export default function TurmasPage() {
  const [turmasList, setTurmasList] = useState<Turma[]>(turmasMock);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | undefined>(undefined);

  const handleCreate = () => {
    setEditingTurma(undefined);
    setFormOpen(true);
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingTurma) {
      setTurmasList(prev => prev.map(t => t.id === editingTurma.id ? { ...t, ...data } : t));
      toast.success('Turma atualizada com sucesso');
    } else {
      const newTurma: Turma = {
        ...data,
        id: `t${Date.now()}`,
        alunoIds: [],
      };
      setTurmasList(prev => [...prev, newTurma]);
      toast.success('Turma criada com sucesso');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Turmas"
        subtitle={`${turmasList.length} turmas ativas`}
        actions={<Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" />Nova Turma</Button>}
      />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {turmasList.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:bg-accent/30 transition-colors group relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleEdit(t)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-start justify-between pr-8">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{t.nome}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.modalidade} • {t.professor}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t.alunoIds.length}/{t.capacidade}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t.horario}</span>
                <span>•</span>
                <span>{t.diasSemana.join(', ')}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(t.alunoIds.length / t.capacidade) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {t.alunoIds.slice(0, 3).map(id => {
                const a = alunos.find(al => al.id === id);
                return a ? (
                  <span key={id} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{a.nome.split(' ')[0]}</span>
                ) : null;
              })}
              {t.alunoIds.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{t.alunoIds.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingTurma ? 'Editar Turma' : 'Nova Turma'}</DialogTitle>
          </DialogHeader>
          <TurmaForm turma={editingTurma} onSubmit={handleFormSubmit} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
