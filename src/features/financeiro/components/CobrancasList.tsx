import { CreditCard, Receipt } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { Cobranca } from '@/types';
import { formatDate } from '../useFinanceiroPage';

interface Props {
  cobrancas: Cobranca[];
  onPayment: (cobranca: Cobranca) => void;
  onReceipt: (cobranca: Cobranca) => void;
}

function canPay(cobranca: Cobranca) {
  return cobranca.status === 'aberta' || cobranca.status === 'parcial' || cobranca.status === 'vencida';
}

export function CobrancasList({ cobrancas, onPayment, onReceipt }: Props) {
  if (cobrancas.length === 0) {
    return <EmptyState title="Nenhuma cobrança encontrada" description="Tente ajustar os filtros de busca." />;
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-xs">
            <thead><tr className="border-b border-border bg-muted/30">{['Aluno', 'Tipo', 'Descrição', 'Valor', 'Vencimento', 'Status', 'Ações'].map((label) => <th key={label} className="px-4 py-3 text-left font-semibold text-muted-foreground">{label}</th>)}</tr></thead>
            <tbody>
              {cobrancas.map((cobranca) => (
                <tr key={cobranca.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                  <td className="px-4 py-3 font-medium text-foreground">{cobranca.nomeAluno}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cobranca.tipo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cobranca.descricao}</td>
                  <td className="px-4 py-3 text-foreground">R$ {cobranca.valor.toFixed(2)}{cobranca.valorPago > 0 && <p className="text-[10px] text-muted-foreground">Pago: R$ {cobranca.valorPago.toFixed(2)}</p>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(cobranca.dataVencimento)}</td>
                  <td className="px-4 py-3"><StatusBadge status={cobranca.status} /></td>
                  <td className="px-4 py-3"><Actions cobranca={cobranca} onPayment={onPayment} onReceipt={onReceipt} compact /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 sm:hidden">
        {cobrancas.map((cobranca) => (
          <div key={cobranca.id} className="space-y-2 rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{cobranca.nomeAluno}</p><p className="mt-0.5 text-xs text-muted-foreground">{cobranca.descricao}</p><p className="text-[11px] text-muted-foreground">Tipo: {cobranca.tipo}</p></div>
              <StatusBadge status={cobranca.status} />
            </div>
            <div className="flex items-center justify-between text-xs"><div><span className="font-medium text-foreground">R$ {cobranca.valor.toFixed(2)}</span>{cobranca.valorPago > 0 && <span className="ml-2 text-muted-foreground">Pago: R$ {cobranca.valorPago.toFixed(2)}</span>}</div><span className="text-muted-foreground">{formatDate(cobranca.dataVencimento)}</span></div>
            <Actions cobranca={cobranca} onPayment={onPayment} onReceipt={onReceipt} />
          </div>
        ))}
      </div>
    </>
  );
}

interface ActionProps {
  cobranca: Cobranca;
  onPayment: (cobranca: Cobranca) => void;
  onReceipt: (cobranca: Cobranca) => void;
  compact?: boolean;
}

function Actions({ cobranca, onPayment, onReceipt, compact }: ActionProps) {
  const className = compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-1 gap-2 pt-1';
  return (
    <div className={className}>
      {canPay(cobranca) && <Button size="sm" variant={compact ? 'secondary' : 'default'} className={compact ? 'h-7 text-[10px]' : 'h-8 w-full text-xs'} onClick={() => onPayment(cobranca)}><CreditCard className="mr-1 h-3 w-3" />{compact ? 'Pagar' : 'Registrar pagamento'}</Button>}
      {cobranca.valorPago > 0 && <Button size="sm" variant={compact ? 'ghost' : 'secondary'} className={compact ? 'h-7 text-[10px]' : 'h-8 w-full text-xs'} onClick={() => onReceipt(cobranca)}><Receipt className="mr-1 h-3 w-3" />{compact ? 'Comprovante' : 'Ver comprovante'}</Button>}
    </div>
  );
}
