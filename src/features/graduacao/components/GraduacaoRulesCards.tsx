import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RegraGraduacao } from '@/types';

interface GraduacaoRulesCardsProps {
  regras: RegraGraduacao[];
  onEdit: (regra: RegraGraduacao) => void;
}

export function GraduacaoRulesCards({ regras, onEdit }: GraduacaoRulesCardsProps) {
  return (
    <div className="space-y-3 sm:hidden">
      {regras.map((regra) => (
        <article key={regra.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{regra.modalidade || 'Geral'} • {regra.categoria}</p>
              <p className="mt-1 text-sm text-foreground">
                {regra.faixaOrigem} <span className="text-muted-foreground">→</span>{' '}
                <strong>{regra.faixaDestino}</strong>
              </p>
            </div>
            <Button type="button" size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => onEdit(regra)}>
              <Pencil className="mr-1 h-3 w-3" />Editar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {regra.aulasMinimas} aulas • {regra.mesesMinimos} meses
          </p>
        </article>
      ))}
    </div>
  );
}
