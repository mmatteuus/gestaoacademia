import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Cobranca } from '@/types';
import { CobrancaActions } from './CobrancaActions';
import { formatCurrency, formatDate } from '../utils/financeiro.utils';

interface CobrancasCardsProps {
  cobrancas: Cobranca[];
  onPay: (cobranca: Cobranca) => void;
  onOpenReceipt: (cobranca: Cobranca) => void;
}

export function CobrancasCards(props: CobrancasCardsProps) {
  const { cobrancas, onPay, onOpenReceipt } = props;

  return (
    <div className="space-y-3 sm:hidden">
      {cobrancas.map((cobranca) => (
        <article key={cobranca.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
          <header className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{cobranca.nomeAluno}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{cobranca.descricao}</p>
              <p className="text-[11px] text-muted-foreground">Tipo: {cobranca.tipo}</p>
            </div>
            <StatusBadge status={cobranca.status} />
          </header>

          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="space-x-2">
              <span className="font-medium text-foreground">{formatCurrency(cobranca.valor)}</span>
              {cobranca.valorPago > 0 && (
                <span className="text-muted-foreground">Recebido: {formatCurrency(cobranca.valorPago)}</span>
              )}
            </div>
            <span className="text-muted-foreground">{formatDate(cobranca.dataVencimento)}</span>
          </div>

          <CobrancaActions cobranca={cobranca} onPay={onPay} onOpenReceipt={onOpenReceipt} />
        </article>
      ))}
    </div>
  );
}
