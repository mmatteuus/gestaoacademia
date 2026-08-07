import { EmptyState } from '@/components/shared/EmptyState';
import type { ContratoAluguel, PagamentoContratoAluguel } from '@/types';
import { ContratoCard } from './ContratoCard';

interface ContratosListProps {
  contratos: ContratoAluguel[];
  pagamentosPorContrato: Record<string, PagamentoContratoAluguel[]>;
  onRegisterPayment: (contrato: ContratoAluguel) => void;
  onOpenReceipt: (contrato: ContratoAluguel, pagamento: PagamentoContratoAluguel) => void;
}

export function ContratosList({
  contratos,
  pagamentosPorContrato,
  onRegisterPayment,
  onOpenReceipt,
}: ContratosListProps) {
  if (contratos.length === 0) return <EmptyState title="Nenhum contrato" />;

  return (
    <div className="space-y-3">
      {contratos.map((contrato) => (
        <ContratoCard
          key={contrato.id}
          contrato={contrato}
          pagamentos={pagamentosPorContrato[contrato.id] ?? []}
          onRegisterPayment={onRegisterPayment}
          onOpenReceipt={onOpenReceipt}
        />
      ))}
    </div>
  );
}
