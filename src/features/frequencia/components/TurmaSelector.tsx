import { Button } from '@/components/ui/button';
import type { Turma } from '@/types';

interface TurmaSelectorProps {
  turmas: Turma[];
  selectedId: string;
  onChange: (turmaId: string) => void;
}

export function TurmaSelector({ turmas, selectedId, onChange }: TurmaSelectorProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {turmas.map((turma) => (
        <Button
          key={turma.id}
          type="button"
          variant={selectedId === turma.id ? 'default' : 'secondary'}
          size="sm"
          className="min-h-9 shrink-0 text-xs"
          onClick={() => onChange(turma.id)}
        >
          {turma.nome}
        </Button>
      ))}
    </div>
  );
}
