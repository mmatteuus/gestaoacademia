import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Progress } from '@/components/ui/progress';
import type { Aluno, GraduacaoAluno } from '@/types';

interface GraduacaoProgressListProps {
  alunos: Aluno[];
  graduacoes: GraduacaoAluno[];
}

export function GraduacaoProgressList({ alunos, graduacoes }: GraduacaoProgressListProps) {
  if (graduacoes.length === 0) {
    return <EmptyState title="Nenhum aluno em processo de graduação" />;
  }

  const alunosById = new Map(alunos.map((aluno) => [aluno.id, aluno]));

  return (
    <div className="space-y-3">
      {graduacoes.map((graduacao) => {
        const aluno = alunosById.get(graduacao.alunoId);
        const progresso = graduacao.aulasNecessarias > 0
          ? Math.min(100, Math.round((graduacao.aulasRealizadas / graduacao.aulasNecessarias) * 100))
          : 100;

        return (
          <article key={graduacao.alunoId} className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">{aluno?.nome || 'Aluno não encontrado'}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {graduacao.faixaAtual} → {graduacao.proximaFaixa}
                </p>
              </div>
              <StatusBadge status={graduacao.status} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{graduacao.aulasRealizadas}/{graduacao.aulasNecessarias} aulas</span>
                <span>{progresso}%</span>
              </div>
              <Progress value={progresso} className="h-2 bg-muted" />
            </div>
          </article>
        );
      })}
    </div>
  );
}
