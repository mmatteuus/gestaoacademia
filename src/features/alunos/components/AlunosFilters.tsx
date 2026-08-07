import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AlunoStatus } from '@/types';
import { ALUNO_STATUS_FILTERS } from '../alunos.constants';

interface AlunosFiltersProps {
  busca: string;
  filtroStatus: AlunoStatus | 'todos';
  onBuscaChange: (value: string) => void;
  onStatusChange: (value: AlunoStatus | 'todos') => void;
}

export function AlunosFilters({
  busca,
  filtroStatus,
  onBuscaChange,
  onStatusChange,
}: AlunosFiltersProps) {
  return (
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
        {ALUNO_STATUS_FILTERS.map((statusItem) => (
          <Button
            key={statusItem.value}
            type="button"
            variant={filtroStatus === statusItem.value ? 'default' : 'secondary'}
            size="sm"
            className="h-8 justify-center rounded-full px-3 text-[11px] sm:text-xs"
            onClick={() => onStatusChange(statusItem.value)}
          >
            {statusItem.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
