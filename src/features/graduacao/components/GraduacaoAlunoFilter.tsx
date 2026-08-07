import type { Aluno } from '@/types';

interface GraduacaoAlunoFilterProps {
  alunoId: string;
  alunos: Aluno[];
  onChange: (alunoId: string) => void;
}

export function GraduacaoAlunoFilter({ alunoId, alunos, onChange }: GraduacaoAlunoFilterProps) {
  return (
    <div className="max-w-sm">
      <label htmlFor="graduacao-aluno-filtro" className="mb-1 block text-xs text-muted-foreground">
        Filtrar por aluno
      </label>
      <select
        id="graduacao-aluno-filtro"
        value={alunoId}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground"
      >
        <option value="todos">Todos os alunos</option>
        {alunos.map((aluno) => (
          <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
        ))}
      </select>
    </div>
  );
}
