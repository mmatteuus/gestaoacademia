import { CreditCard, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Cobranca } from '@/types';
import { isCobrancaPayable } from '../utils/financeiro.utils';

interface CobrancaActionsProps {
  cobranca: Cobranca;
  compact?: boolean;
  onPay: (cobranca: Cobranca) => void;
  onOpenReceipt: (cobranca: Cobranca) => void;
}

export function CobrancaActions({
  cobranca,
  compact = false,
  onPay,
  onOpenReceipt,
}: CobrancaActionsProps) {
  const buttonClass = compact ? 'h-7 text-[10px]' : 'h-8 w-full text-xs';

  return (
    <div className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-1 gap-2'}>
      {isCobrancaPayable(cobranca) && (
        <Button
          type="button"
          size="sm"
          variant={compact ? 'secondary' : 'default'}
          className={buttonClass}
          onClick={() => onPay(cobranca)}
        >
          <CreditCard className="mr-1 h-3 w-3" />
          {compact ? 'Pagar' : 'Registrar pagamento'}
        </Button>
      )}
      {cobranca.valorPago > 0 && (
        <Button
          type="button"
          size="sm"
          variant={compact ? 'ghost' : 'secondary'}
          className={buttonClass}
          onClick={() => onOpenReceipt(cobranca)}
        >
          <Receipt className="mr-1 h-3 w-3" />
          {compact ? 'Comprovante' : 'Ver comprovante'}
        </Button>
      )}
    </div>
  );
}
