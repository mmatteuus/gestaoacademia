import { UserMinus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Aluno, Turma } from '@/types';

interface GerenciarAlunosDialogProps {
  open: boolean;
  turma: Turma | null;
  alunosDaTurma: Aluno[];
  alunosDisponiveis: Aluno[];
  onOpenChange: (open: boolean) => void;
  onAdd: (alunoId: string) => void;
  onRemove: (alunoId: string) => void;
}

interface AlunoRowProps {
  aluno: Aluno;
  actionLabel: string;
  actionVariant: 'ghost' | 'secondary';
  onAction: (alunoId: string) => void;
  actionIcon: 'add' | 'remove';
}

function AlunoRow({
  aluno,
  actionLabel,
  actionVariant,
  onAction,
  actionIcon,
}: AlunoRowProps) {
  const ActionIcon = actionIcon === 'add' ? UserPlus : UserMinus;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <div>
        <p className="text-sm font-medium text-foreground">{aluno.nome}</p>
        <p className="text-xs text-muted-foreground">
          {aluno.categoria} • {aluno.faixaAtual}
        </p>
      </div>
      <Button
        size="sm"
        variant={actionVariant}
        className="h-8 text-xs"
        onClick={() => onAction(aluno.id)}
      >
        <ActionIcon className="mr-1 h-3.5 w-3.5" />
        {actionLabel}
      </Button>
    </div>
  );
}

export function GerenciarAlunosDialog({
  open,
  turma,
  alunosDaTurma,
  alunosDisponiveis,
  onOpenChange,
  onAdd,
  onRemove,
}: GerenciarAlunosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Gerenciar alunos da turma {turma?.nome}
          </DialogTitle>
        </DialogHeader>

        {turma && (
          <div className="grid grid-cols-1 gap-4 py-2 lg:grid-cols-2">
            <section className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Alunos vinculados
                </p>
                <span className="text-xs text-foreground">
                  {turma.alunoIds.length}/{turma.capacidade}
                </span>
              </div>

              {alunosDaTurma.length > 0 ? (
                alunosDaTurma.map((aluno) => (
                  <AlunoRow
                    key={aluno.id}
                    aluno={aluno}
                    actionLabel="Remover"
                    actionVariant="ghost"
                    actionIcon="remove"
                    onAction={onRemove}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nenhum aluno vinculado ainda.
                </p>
              )}
            </section>

            <section className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Adicionar alunos
              </p>

              {alunosDisponiveis.length > 0 ? (
                alunosDisponiveis.map((aluno) => (
                  <AlunoRow
                    key={aluno.id}
                    aluno={aluno}
                    actionLabel="Adicionar"
                    actionVariant="secondary"
                    actionIcon="add"
                    onAction={onAdd}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  Todos os alunos já estão vinculados ou não há vagas disponíveis.
                </p>
              )}
            </section>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="text-xs">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
