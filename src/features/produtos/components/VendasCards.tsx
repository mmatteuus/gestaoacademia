import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Venda } from '@/types';
import type { VendaDetalhada } from '../types/produtos.types';
import { formatCurrency } from '../utils/produtos.utils';

interface VendasCardsProps {
  vendas: Venda[];
  onOpenReceipt: (venda: Venda) => void;
}

export function VendasCards({ vendas, onOpenReceipt }: VendasCardsProps) {
  return (
    <div className="space-y-3 sm:hidden">
      {vendas.map((venda) => {
        const detalhada = venda as VendaDetalhada;
        return (
          <article key={venda.id} className="space-y-2 rounded-lg border border-border bg-card p-4">
            <div className="flex justify-between gap-3 text-xs">
              <span className="font-semibold text-foreground">{venda.compradorNome}</span>
              <span className="text-muted-foreground">{venda.data}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ')}
            </p>
            <div className="flex justify-between gap-3 text-xs">
              <div>
                <span className="font-medium text-foreground">{formatCurrency(venda.total)}</span>
                {(detalhada.desconto ?? 0) > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    Desconto: {formatCurrency(detalhada.desconto ?? 0)}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground">{venda.formaPagamento}</span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 w-full text-xs"
              onClick={() => onOpenReceipt(venda)}
            >
              <Receipt className="mr-1 h-3 w-3" />
              Ver comprovante
            </Button>
          </article>
        );
      })}
    </div>
  );
}
