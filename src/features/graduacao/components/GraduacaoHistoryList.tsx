import { EmptyState } from '@/components/shared/EmptyState';
import type { Aluno, HistoricoGraduacao } from '@/types';

interface GraduacaoHistoryListProps {
  alunos: Aluno[];
  historico: HistoricoGraduacao[];
}

export function GraduacaoHistoryList({ alunos, historico }: GraduacaoHistoryListProps) {
  if (historico.length === 0) {
    return <EmptyState title="Nenhuma graduação registrada" />;
  }

  const alunosById = new Map(alunos.map((aluno) => [aluno.id, aluno]));

  return (
    <div className="space-y-3">
      {historico.map((item) => (
        <article key={item.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <span className="text-xs font-bold text-primary">G</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-foreground">
              {alunosById.get(item.alunoId)?.nome || 'Aluno não encontrado'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {item.faixaDe} → {item.faixaPara} • {item.data}
            </p>
          </div>
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
            {item.aprovadoPor}
          </span>
        </article>
      ))}
    </div>
  );
}
