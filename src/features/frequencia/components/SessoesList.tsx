import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Aluno, SessaoAula } from '@/types';

interface SessoesListProps {
  sessoes: SessaoAula[];
  alunos: Aluno[];
}

export function SessoesList({ sessoes, alunos }: SessoesListProps) {
  if (sessoes.length === 0) {
    return (
      <EmptyState
        title="Nenhuma sessão registrada"
        description="Use Lançar presença para registrar a primeira aula."
      />
    );
  }

  const alunosById = new Map(alunos.map((aluno) => [aluno.id, aluno]));

  return (
    <div className="space-y-4">
      {sessoes.map((sessao) => {
        const presentes = sessao.presencas.filter((presenca) => presenca.presente).length;
        return (
          <article key={sessao.id} className="rounded-lg border border-border bg-card p-4">
            <header className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{sessao.data}</span>
                <span className="hidden text-xs text-muted-foreground sm:inline">• {sessao.professor}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {presentes}/{sessao.presencas.length} presentes
              </span>
            </header>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {sessao.presencas.map((presenca) => {
                const aluno = alunosById.get(presenca.alunoId);
                const statusClass = presenca.presente
                  ? 'border-success/20 bg-success/10'
                  : 'border-destructive/20 bg-destructive/10';
                return (
                  <div key={presenca.alunoId} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${statusClass}`}>
                    {presenca.presente ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                    )}
                    <span className="truncate text-foreground">{aluno?.nome || presenca.alunoId}</span>
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
}
