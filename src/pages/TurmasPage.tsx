import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TurmaForm } from '@/components/forms/TurmaForm';
import { GerenciarAlunosDialog } from '@/features/turmas/components/GerenciarAlunosDialog';
import { TurmaCard } from '@/features/turmas/components/TurmaCard';
import { useTurmasPage } from '@/features/turmas/hooks/useTurmasPage';

export default function TurmasPage() {
  const {
    turmasList,
    alunosList,
    formOpen,
    setFormOpen,
    manageOpen,
    setManageOpen,
    editingTurma,
    manageTurma,
    alunosDaTurma,
    alunosDisponiveis,
    openCreateForm,
    openEditForm,
    openManageDialog,
    submitTurma,
    addAluno,
    removeAluno,
  } = useTurmasPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Turmas"
        subtitle={`${turmasList.length} turmas ativas`}
        actions={(
          <Button size="sm" onClick={openCreateForm}>
            <Plus className="mr-1 h-4 w-4" />
            Nova Turma
          </Button>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {turmasList.map((turma) => (
          <TurmaCard
            key={turma.id}
            turma={turma}
            alunos={alunosList}
            onEdit={openEditForm}
            onManage={openManageDialog}
          />
        ))}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingTurma ? 'Editar Turma' : 'Nova Turma'}
            </DialogTitle>
          </DialogHeader>
          <TurmaForm
            turma={editingTurma}
            onSubmit={submitTurma}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <GerenciarAlunosDialog
        open={manageOpen}
        turma={manageTurma}
        alunosDaTurma={alunosDaTurma}
        alunosDisponiveis={alunosDisponiveis}
        onOpenChange={setManageOpen}
        onAdd={addAluno}
        onRemove={removeAluno}
      />
    </div>
  );
}
