import { EmptyState } from '@/components/shared/EmptyState';
import type { Cobranca } from '@/types';
import { CobrancasCards } from './CobrancasCards';
import { CobrancasTable } from './CobrancasTable';

interface CobrancasListProps {
  cobrancas: Cobranca[];
  onPay: (cobranca: Cobranca) => void;
  onOpenReceipt: (cobranca: Cobranca) => void;
}

export function CobrancasList({ cobrancas, onPay, onOpenReceipt }: CobrancasListProps) {
  if (cobrancas.length === 0) {
    return (
      <EmptyState
        title="Nenhuma cobrança encontrada"
        description="Tente ajustar os filtros de busca."
      />
    );
  }

  return (
    <>
      <CobrancasTable cobrancas={cobrancas} onPay={onPay} onOpenReceipt={onOpenReceipt} />
      <CobrancasCards cobrancas={cobrancas} onPay={onPay} onOpenReceipt={onOpenReceipt} />
    </>
  );
}
