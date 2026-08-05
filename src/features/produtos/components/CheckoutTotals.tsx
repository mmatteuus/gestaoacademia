import { formatCurrency } from '../utils/produtos.utils';

interface CheckoutTotalsProps {
  subtotal: number;
  desconto: number;
}

export function CheckoutTotals({ subtotal, desconto }: CheckoutTotalsProps) {
  const total = Math.max(0, subtotal - desconto);

  return (
    <dl className="grid grid-cols-3 gap-2 text-xs">
      <div className="rounded-lg border border-border bg-card px-3 py-2">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="mt-1 font-semibold text-foreground">{formatCurrency(subtotal)}</dd>
      </div>
      <div className="rounded-lg border border-border bg-card px-3 py-2">
        <dt className="text-muted-foreground">Desconto</dt>
        <dd className="mt-1 font-semibold text-foreground">{formatCurrency(desconto)}</dd>
      </div>
      <div className="rounded-lg border border-border bg-card px-3 py-2">
        <dt className="text-muted-foreground">Total</dt>
        <dd className="mt-1 font-semibold text-foreground">{formatCurrency(total)}</dd>
      </div>
    </dl>
  );
}
