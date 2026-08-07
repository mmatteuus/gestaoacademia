import { Pencil, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Aluno, Turma } from '@/types';

interface TurmaCardProps {
  turma: Turma;
  alunos: Aluno[];
  onEdit: (turma: Turma) => void;
  onManage: (turma: Turma) => void;
}

export function TurmaCard({ turma, alunos, onEdit, onManage }: TurmaCardProps) {
  const ocupacao = (turma.alunoIds.length / turma.capacidade) * 100;

  return (
    <article className="group relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30 sm:p-5">
      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-7 sm:w-7"
          onClick={() => onManage(turma)}
          aria-label={`Gerenciar alunos de ${turma.nome}`}
        >
          <Users className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-7 sm:w-7"
          onClick={() => onEdit(turma)}
          aria-label={`Editar ${turma.nome}`}
        >
          <Pencil className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>

      <div className="flex items-start justify-between pr-16">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{turma.nome}</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {turma.modalidade} • {turma.professor}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {turma.alunoIds.length}/{turma.capacidade}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{turma.horario}</span>
          <span>•</span>
          <span>{turma.diasSemana.join(', ')}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${ocupacao}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {turma.alunoIds.slice(0, 3).map((alunoId) => {
          const aluno = alunos.find((item) => item.id === alunoId);

          return aluno ? (
            <span
              key={alunoId}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {aluno.nome.split(' ')[0]}
            </span>
          ) : null;
        })}
        {turma.alunoIds.length > 3 && (
          <span className="text-[10px] text-muted-foreground">
            +{turma.alunoIds.length - 3}
          </span>
        )}
      </div>

      <div className="mt-4">
        <Button
          size="sm"
          variant="secondary"
          className="h-8 w-full text-xs"
          onClick={() => onManage(turma)}
        >
          Gerenciar alunos
        </Button>
      </div>
    </article>
  );
}
