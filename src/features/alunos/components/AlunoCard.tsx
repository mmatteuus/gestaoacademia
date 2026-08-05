import { Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { Aluno } from '@/types';

interface AlunoCardProps {
  aluno: Aluno;
  onOpen: (alunoId: string) => void;
  onEdit: (aluno: Aluno) => void;
}

export function AlunoCard({ aluno, onOpen, onEdit }: AlunoCardProps) {
  const open = () => onOpen(aluno.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      aria-label={`Abrir ficha de ${aluno.nome}`}
      className="cursor-pointer rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{aluno.nome}</p>
          <p className="text-xs text-muted-foreground">
            {aluno.categoria || 'Sem categoria'} • {aluno.faixaAtual || 'Sem faixa'}
          </p>
        </div>
        <StatusBadge status={aluno.status} />
      </div>

      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <p>{aluno.telefone || 'Sem telefone'}</p>
        <p>{aluno.email || 'Sem e-mail'}</p>
        <p>{aluno.turmaIds.length} turma(s)</p>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(aluno);
          }}
        >
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Editar
        </Button>
      </div>
    </div>
  );
}
