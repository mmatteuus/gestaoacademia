import { EmptyState } from '@/components/shared/EmptyState';
import type { Aluno } from '@/types';
import { AlunoCard } from './AlunoCard';

interface AlunosGridProps {
  alunos: Aluno[];
  onCreate: () => void;
  onOpen: (alunoId: string) => void;
  onEdit: (aluno: Aluno) => void;
}

export function AlunosGrid({ alunos, onCreate, onOpen, onEdit }: AlunosGridProps) {
  if (alunos.length === 0) {
    return (
      <EmptyState
        title="Nenhum aluno encontrado"
        description="Ajuste os filtros ou cadastre um novo aluno."
        action={{ label: 'Cadastrar aluno', onClick: onCreate }}
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {alunos.map((aluno) => (
        <AlunoCard key={aluno.id} aluno={aluno} onOpen={onOpen} onEdit={onEdit} />
      ))}
    </div>
  );
}
