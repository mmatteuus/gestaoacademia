import { Receipt } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { ContratoAluguel, PagamentoContratoAluguel } from '@/types';
import type { PagamentoContratoDetalhado } from '../useAluguelPage';

interface Props {
  contratos: ContratoAluguel[];
  pagamentosPorContrato: Record<string, PagamentoContratoDetalhado[]>;
  onPayment: (contrato: ContratoAluguel) => void;
  onReceipt: (contrato: ContratoAluguel, pagamento: PagamentoContratoAluguel) => void;
}

export function ContratosList({ contratos, pagamentosPorContrato, onPayment, onReceipt }: Props) {
  if (contratos.length === 0) return <EmptyState title="Nenhum contrato" />;

  return (
    <div className="space-y-3">
      {contratos.map((contrato) => (
        <div key={contrato.id} className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{contrato.locatario}</p>
              <p className="text-xs text-muted-foreground">{contrato.espaco} • {contrato.dataInicio} a {contrato.dataFim}</p>
            </div>
            <StatusBadge status={contrato.status === 'ativo' ? 'ativo' : 'inativo'} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Periodicidade: {contrato.periodicidade}</span><span>•</span>
            <span className="font-medium text-foreground">R$ {contrato.valor.toFixed(2)}</span>
          </div>
          <Button size="sm" variant="secondary" className="text-xs" onClick={() => onPayment(contrato)}>
            <Receipt className="mr-1 h-3.5 w-3.5" />Registrar pagamento
          </Button>
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Histórico por contrato</p>
            {(pagamentosPorContrato[contrato.id] || []).length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum pagamento registrado para este contrato.</p>
            ) : (
              <div className="space-y-2">
                {pagamentosPorContrato[contrato.id].map((pagamento) => (
                  <div key={pagamento.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-xs">
                    <div>
                      <p className="font-medium text-foreground">{pagamento.referencia || 'Pagamento registrado'}</p>
                      <p className="text-muted-foreground">{pagamento.dataPagamento} • {pagamento.formaPagamento}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">R$ {pagamento.valor.toFixed(2)}</span>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => onReceipt(contrato, pagamento)}>
                        Ver comprovante
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
