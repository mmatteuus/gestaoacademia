import { ChevronLeft, ChevronRight, Pencil, Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Aluno, AlunoStatus } from '@/types';
import { STATUS_FILTERS } from '../alunos-page.utils';

interface Props {
  alunos: Aluno[];
  busca: string;
  filtroStatus: AlunoStatus | 'todos';
  page: number;
  totalPages: number;
  onBuscaChange: (value: string) => void;
  onStatusChange: (value: AlunoStatus | 'todos') => void;
  onPageChange: (page: number) => void;
  onSelect: (aluno: Aluno) => void;
  onEdit: (aluno: Aluno) => void;
  onCreate: () => void;
}

export function AlunosListPanel({
  alunos,
  busca,
  filtroStatus,
  page,
  totalPages,
  onBuscaChange,
  onStatusChange,
  onPageChange,
  onSelect,
  onEdit,
  onCreate,
}: Props) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={busca}
            onChange={(event) => onBuscaChange(event.target.value)}
            className="h-9 bg-secondary/50 pl-9 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status.value}
              variant={filtroStatus === status.value ? 'default' : 'secondary'}
              size="sm"
              className="h-8 justify-center rounded-full px-3 text-[11px] sm:text-xs"
              onClick={() => onStatusChange(status.value)}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {alunos.length === 0 ? (
        <EmptyState
          title="Nenhum aluno encontrado"
          description="Ajuste os filtros ou cadastre um novo aluno."
          action={{ label: 'Cadastrar aluno', onClick: onCreate }}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(aluno)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(aluno);
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
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" size="sm" className="h-8" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">Página {page} de {totalPages}</span>
        <Button variant="secondary" size="sm" className="h-8" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
