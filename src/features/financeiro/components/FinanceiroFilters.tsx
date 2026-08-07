import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Aluno } from '@/types';
import type { FiltroCobranca } from '../types/financeiro.types';

const STATUS_FILTERS: { label: string; value: FiltroCobranca }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Abertas', value: 'aberta' },
  { label: 'Vencidas', value: 'vencida' },
  { label: 'Pagas', value: 'paga' },
  { label: 'Parciais', value: 'parcial' },
];

interface FinanceiroFiltersProps {
  busca: string;
  filtro: FiltroCobranca;
  alunoId: string;
  alunos: Aluno[];
  onBuscaChange: (value: string) => void;
  onFiltroChange: (value: FiltroCobranca) => void;
  onAlunoChange: (value: string) => void;
}

export function FinanceiroFilters({
  busca,
  filtro,
  alunoId,
  alunos,
  onBuscaChange,
  onFiltroChange,
  onAlunoChange,
}: FinanceiroFiltersProps) {
  return (
    <section className="flex flex-col gap-3 lg:flex-row" aria-label="Filtros financeiros">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por aluno ou descrição..."
          value={busca}
          onChange={(event) => onBuscaChange(event.target.value)}
          className="h-9 bg-secondary/50 pl-9 text-xs"
        />
      </div>

      <select
        value={alunoId}
        onChange={(event) => onAlunoChange(event.target.value)}
        className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground"
        aria-label="Filtrar por aluno"
      >
        <option value="todos">Todos os alunos</option>
        {alunos.map((aluno) => (
          <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
        ))}
      </select>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por status">
        {STATUS_FILTERS.map((status) => (
          <Button
            key={status.value}
            type="button"
            variant={filtro === status.value ? 'default' : 'secondary'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => onFiltroChange(status.value)}
          >
            {status.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
