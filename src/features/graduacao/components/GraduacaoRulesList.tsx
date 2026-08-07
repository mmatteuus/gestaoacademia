import { EmptyState } from '@/components/shared/EmptyState';
import type { RegraGraduacao } from '@/types';
import { GraduacaoRulesCards } from './GraduacaoRulesCards';
import { GraduacaoRulesTable } from './GraduacaoRulesTable';

interface GraduacaoRulesListProps {
  regras: RegraGraduacao[];
  onEdit: (regra: RegraGraduacao) => void;
}

export function GraduacaoRulesList({ regras, onEdit }: GraduacaoRulesListProps) {
  if (regras.length === 0) {
    return <EmptyState title="Nenhuma regra de graduação cadastrada" />;
  }

  return (
    <div className="space-y-4">
      <GraduacaoRulesTable regras={regras} onEdit={onEdit} />
      <GraduacaoRulesCards regras={regras} onEdit={onEdit} />
      <aside className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Nota:</strong> as regras podem variar por modalidade e categoria.
        </p>
      </aside>
    </div>
  );
}
