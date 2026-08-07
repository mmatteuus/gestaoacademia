import { EmptyState } from '@/components/shared/EmptyState';
import type { Venda } from '@/types';
import { VendasCards } from './VendasCards';
import { VendasTable } from './VendasTable';

interface VendasHistoricoProps {
  vendas: Venda[];
  onOpenReceipt: (venda: Venda) => void;
}

export function VendasHistorico({ vendas, onOpenReceipt }: VendasHistoricoProps) {
  if (vendas.length === 0) {
    return <EmptyState title="Nenhuma venda registrada" />;
  }

  return (
    <>
      <VendasTable vendas={vendas} onOpenReceipt={onOpenReceipt} />
      <VendasCards vendas={vendas} onOpenReceipt={onOpenReceipt} />
    </>
  );
}
