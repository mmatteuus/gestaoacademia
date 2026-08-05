import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Aluno } from '@/types';

interface SelecionarAlunosDialogProps {
  open: boolean;
  title?: string;
  alunos: Aluno[];
  selectedIds: string[];
  onOpenChange: (open: boolean) => void;
  onToggle: (alunoId: string) => void;
  onConfirm: () => void;
}

export function SelecionarAlunosDialog({
  open,
  title,
  alunos,
  selectedIds,
  onOpenChange,
  onToggle,
  onConfirm,
}: SelecionarAlunosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {title ? `Adicionar alunos — ${title}` : 'Adicionar alunos ao campeonato'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {alunos.length === 0 ? (
            <EmptyState title="Todos os alunos já estão neste campeonato" className="py-6" />
          ) : (
            alunos.map((aluno) => {
              const selected = selectedIds.includes(aluno.id);
              const stateClass = selected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:bg-accent/30';
              const badgeClass = selected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground';

              return (
                <button
                  key={aluno.id}
                  type="button"
                  onClick={() => onToggle(aluno.id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${stateClass}`}
                  aria-pressed={selected}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{aluno.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {aluno.categoria} • {aluno.faixaAtual}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] ${badgeClass}`}>
                      {selected ? 'Selecionado' : 'Selecionar'}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Adicionar selecionados</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
