import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ContratoAluguel, PagamentoContratoAluguel } from '@/types';
import { formatCurrency } from '../utils/aluguel.utils';

interface ContratoCardProps {
  contrato: ContratoAluguel;
  pagamentos: PagamentoContratoAluguel[];
  onRegisterPayment: (contrato: ContratoAluguel) => void;
  onOpenReceipt: (contrato: ContratoAluguel, pagamento: PagamentoContratoAluguel) => void;
}

export function ContratoCard({
  contrato,
  pagamentos,
  onRegisterPayment,
  onOpenReceipt,
}: ContratoCardProps) {
  return (
    <article className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{contrato.locatario}</h3>
          <p className="text-xs text-muted-foreground">
            {contrato.espaco} • {contrato.dataInicio} a {contrato.dataFim}
          </p>
        </div>
        <StatusBadge status={contrato.status === 'ativo' ? 'ativo' : 'inativo'} />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Periodicidade: {contrato.periodicidade}</span>
        <span className="font-medium text-foreground">{formatCurrency(contrato.valor)}</span>
      </div>

      <Button type="button" size="sm" variant="secondary" onClick={() => onRegisterPayment(contrato)}>
        <Receipt className="mr-1 h-3.5 w-3.5" />
        Registrar pagamento
      </Button>

      <section className="rounded-lg border border-border bg-muted/20 p-3" aria-label="Histórico do contrato">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Histórico por contrato
        </p>

        {pagamentos.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum pagamento registrado para este contrato.</p>
        ) : (
          <div className="space-y-2">
            {pagamentos.map((pagamento) => (
              <div key={pagamento.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground">{pagamento.referencia || 'Pagamento registrado'}</p>
                  <p className="text-muted-foreground">{pagamento.dataPagamento} • {pagamento.formaPagamento}</p>
                </div>
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <span className="font-semibold text-foreground">{formatCurrency(pagamento.valor)}</span>
                  <Button type="button" size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => onOpenReceipt(contrato, pagamento)}>
                    Ver comprovante
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
