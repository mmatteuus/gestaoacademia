import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Aluno, CobrancaStatus } from '@/types';
import { STATUS_TABS } from '../useFinanceiroPage';

interface Props {
  busca: string;
  filtro: CobrancaStatus | 'todas';
  alunoFiltroId: string;
  alunos: Aluno[];
  onBuscaChange: (value: string) => void;
  onFiltroChange: (value: CobrancaStatus | 'todas') => void;
  onAlunoChange: (value: string) => void;
}

export function FinanceiroFilters({ busca, filtro, alunoFiltroId, alunos, onBuscaChange, onFiltroChange, onAlunoChange }: Props) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por aluno..." value={busca} onChange={(event) => onBuscaChange(event.target.value)} className="h-9 bg-secondary/50 pl-9 text-xs" />
      </div>
      <select value={alunoFiltroId} onChange={(event) => onAlunoChange(event.target.value)} className="h-9 rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground" aria-label="Filtrar por aluno">
        <option value="todos">Todos os alunos</option>
        {alunos.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map((aluno) => (
          <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((status) => (
          <Button key={status.value} variant={filtro === status.value ? 'default' : 'secondary'} size="sm" className="h-8 text-xs" onClick={() => onFiltroChange(status.value)}>
            {status.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
