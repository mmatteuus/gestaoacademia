import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Cobranca } from '@/types';
import { CobrancaActions } from './CobrancaActions';
import { formatCurrency, formatDate } from '../utils/financeiro.utils';

interface CobrancasTableProps {
  cobrancas: Cobranca[];
  onPay: (cobranca: Cobranca) => void;
  onOpenReceipt: (cobranca: Cobranca) => void;
}

const HEADERS = ['Aluno', 'Tipo', 'Descrição', 'Valor', 'Vencimento', 'Status', 'Ações'];

export function CobrancasTable({ cobrancas, onPay, onOpenReceipt }: CobrancasTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-xs">
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
            {cobrancas.map((cobranca) => (
              <tr key={cobranca.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                <td className="px-4 py-3 font-medium text-foreground">{cobranca.nomeAluno}</td>
                <td className="px-4 py-3 text-muted-foreground">{cobranca.tipo}</td>
                <td className="px-4 py-3 text-muted-foreground">{cobranca.descricao}</td>
                <td className="px-4 py-3 text-foreground">
                  {formatCurrency(cobranca.valor)}
                  {cobranca.valorPago > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      Pago: {formatCurrency(cobranca.valorPago)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(cobranca.dataVencimento)}</td>
                <td className="px-4 py-3"><StatusBadge status={cobranca.status} /></td>
                <td className="px-4 py-3">
                  <CobrancaActions
                    cobranca={cobranca}
                    compact
                    onPay={onPay}
                    onOpenReceipt={onOpenReceipt}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
