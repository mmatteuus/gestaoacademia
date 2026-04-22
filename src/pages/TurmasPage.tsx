import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Users, Pencil, UserPlus, UserMinus } from 'lucide-react';
import { TurmaForm } from '@/components/forms/TurmaForm';
import { useAcademiaData } from '@/features/academia/AcademiaDataProvider';
import { toast } from 'sonner';
import type { Turma } from '@/types';
import type { TurmaFormValues } from '@/features/turmas/types/turma.types';

export default function TurmasPage() {
  const { turmasList, alunosList, addTurma, updateTurma, addAlunoToTurma, removeAlunoFromTurma } = useAcademiaData();
  const [formOpen, setFormOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [editingTurmaId, setEditingTurmaId] = useState<string | null>(null);
  const [manageTurmaId, setManageTurmaId] = useState<string | null>(null);

  const editingTurma = editingTurmaId ? turmasList.find((turma) => turma.id === editingTurmaId) : undefined;
  const manageTurma = manageTurmaId ? turmasList.find((turma) => turma.id === manageTurmaId) ?? null : null;

  const alunosDaTurma = useMemo(() => {
    if (!manageTurma) return [];
    return alunosList.filter((aluno) => manageTurma.alunoIds.includes(aluno.id));
  }, [manageTurma, alunosList]);

  const alunosDisponiveis = useMemo(() => {
    if (!manageTurma) return [];
    return alunosList.filter((aluno) => !manageTurma.alunoIds.includes(aluno.id));
  }, [manageTurma, alunosList]);

  const handleCreate = () => {
    setEditingTurmaId(null);
    setFormOpen(true);
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurmaId(turma.id);
    setFormOpen(true);
  };

  const handleManage = (turma: Turma) => {
    setManageTurmaId(turma.id);
    setManageOpen(true);
  };

  const handleFormSubmit = async (data: TurmaFormValues) => {
    if (editingTurma) {
      const result = await updateTurma({ ...editingTurma, ...data });
      if (!result.ok) {
        toast.error(result.message || 'Não foi possível atualizar a turma.');
        return;
      }
      toast.success('Turma atualizada com sucesso');
    } else {
      const newTurma: Turma = {
        ...data,
        id: `t${Date.now()}`,
        alunoIds: [],
      };
      const result = await addTurma(newTurma);
      if (!result.ok) {
        toast.error(result.message || 'Falha ao criar turma.');
        return;
      }
      toast.success('Turma criada com sucesso');
    }
    setFormOpen(false);
  };

  const handleAdicionarAluno = (alunoId: string) => {
    if (!manageTurma) return;
    const result = addAlunoToTurma(alunoId, manageTurma.id);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível adicionar o aluno.');
      return;
    }
    const aluno = alunosList.find((item) => item.id === alunoId);
    toast.success(`${aluno?.nome || 'Aluno'} adicionado à turma.`);
  };

  const handleRemoverAluno = (alunoId: string) => {
    if (!manageTurma) return;
    const result = removeAlunoFromTurma(alunoId, manageTurma.id);
    if (!result.ok) {
      toast.error(result.message || 'Não foi possível remover o aluno.');
      return;
    }
    const aluno = alunosList.find((item) => item.id === alunoId);
    toast.success(`${aluno?.nome || 'Aluno'} removido da turma.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Turmas"
        subtitle={`${turmasList.length} turmas ativas`}
        actions={<Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" />Nova Turma</Button>}
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {turmasList.map((turma) => (
          <div key={turma.id} className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:bg-accent/30 transition-colors group relative">
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-7 sm:w-7" onClick={() => handleManage(turma)} aria-label={`Gerenciar alunos de ${turma.nome}`}>
                <Users className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-7 sm:w-7" onClick={() => handleEdit(turma)} aria-label={`Editar ${turma.nome}`}>
                <Pencil className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>

            <div className="flex items-start justify-between pr-16">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{turma.nome}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{turma.modalidade} • {turma.professor}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{turma.alunoIds.length}/{turma.capacidade}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{turma.horario}</span>
                <span>•</span>
                <span>{turma.diasSemana.join(', ')}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(turma.alunoIds.length / turma.capacidade) * 100}%` }} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {turma.alunoIds.slice(0, 3).map((id) => {
                const aluno = alunosList.find((item) => item.id === id);
                return aluno ? (
                  <span key={id} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{aluno.nome.split(' ')[0]}</span>
                ) : null;
              })}
              {turma.alunoIds.length > 3 && <span className="text-[10px] text-muted-foreground">+{turma.alunoIds.length - 3}</span>}
            </div>

            <div className="mt-4">
              <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => handleManage(turma)}>
                Gerenciar alunos
              </Button>
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

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Gerenciar alunos da turma {manageTurma?.nome}</DialogTitle>
          </DialogHeader>

          {manageTurma && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2">
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Alunos vinculados</p>
                  <span className="text-xs text-foreground">{manageTurma.alunoIds.length}/{manageTurma.capacidade}</span>
                </div>
                {alunosDaTurma.length > 0 ? (
                  alunosDaTurma.map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{aluno.nome}</p>
                        <p className="text-xs text-muted-foreground">{aluno.categoria} • {aluno.faixaAtual}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs h-8" onClick={() => handleRemoverAluno(aluno.id)}>
                        <UserMinus className="h-3.5 w-3.5 mr-1" />Remover
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum aluno vinculado ainda.</p>
                )}
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Adicionar alunos</p>
                {alunosDisponiveis.length > 0 ? (
                  alunosDisponiveis.map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{aluno.nome}</p>
                        <p className="text-xs text-muted-foreground">{aluno.categoria} • {aluno.faixaAtual}</p>
                      </div>
                      <Button size="sm" variant="secondary" className="text-xs h-8" onClick={() => handleAdicionarAluno(aluno.id)}>
                        <UserPlus className="h-3.5 w-3.5 mr-1" />Adicionar
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Todos os alunos já estão vinculados ou não há vagas disponíveis.</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setManageOpen(false)} className="text-xs">Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
