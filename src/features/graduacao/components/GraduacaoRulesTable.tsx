import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RegraGraduacao } from '@/types';

interface GraduacaoRulesTableProps {
  regras: RegraGraduacao[];
  onEdit: (regra: RegraGraduacao) => void;
}

const HEADERS = ['Modalidade', 'De', 'Para', 'Categoria', 'Aulas mín.', 'Meses mín.', 'Ação'];

export function GraduacaoRulesTable({ regras, onEdit }: GraduacaoRulesTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {HEADERS.map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regras.map((regra) => (
              <tr key={regra.id} className="border-b border-border/50 last:border-b-0">
                <td className="px-4 py-3 text-foreground">{regra.modalidade || 'Geral'}</td>
                <td className="px-4 py-3 text-foreground">{regra.faixaOrigem}</td>
                <td className="px-4 py-3 font-medium text-foreground">{regra.faixaDestino}</td>
                <td className="px-4 py-3 text-muted-foreground">{regra.categoria}</td>
                <td className="px-4 py-3 text-foreground">{regra.aulasMinimas}</td>
                <td className="px-4 py-3 text-foreground">{regra.mesesMinimos}</td>
                <td className="px-4 py-3">
                  <Button type="button" size="sm" variant="secondary" className="h-7 text-[10px]" onClick={() => onEdit(regra)}>
                    <Pencil className="mr-1 h-3 w-3" />Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
