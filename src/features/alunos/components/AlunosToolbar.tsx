import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AlunoStatus } from '@/types';

const STATUS_OPTIONS: { label: string; value: AlunoStatus | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
];

interface AlunosToolbarProps {
  search: string;
  status: AlunoStatus | 'todos';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AlunoStatus | 'todos') => void;
}

export function AlunosToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: AlunosToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar aluno..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-9 bg-secondary/50 pl-9 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-1.5">
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={status === option.value ? 'default' : 'secondary'}
            size="sm"
            className="h-8 justify-center rounded-full px-3 text-[11px] sm:text-xs"
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
