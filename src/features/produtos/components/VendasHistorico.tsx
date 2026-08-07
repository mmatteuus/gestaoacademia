import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Venda } from '@/types';
import type { VendaDetalhada } from '../produtos.types';

interface VendasHistoricoProps {
  vendas: Venda[];
  onComprovante: (venda: VendaDetalhada) => void;
}

export function VendasHistorico({ vendas, onComprovante }: VendasHistoricoProps) {
  if (vendas.length === 0) return <EmptyState title="Nenhuma venda registrada" />;

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Data', 'Comprador', 'Itens', 'Total', 'Pagamento', 'Ações'].map((label) => (
                  <th key={label} className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => {
                const detalhada = venda as VendaDetalhada;
                return (
                  <tr key={venda.id} className="border-b border-border/50">
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{venda.data}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{venda.compradorNome}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {venda.itens.map((item) => item.nomeProduto).join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      R$ {venda.total.toFixed(2)}
                      {(detalhada.desconto ?? 0) > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                          Desc.: R$ {(detalhada.desconto ?? 0).toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {venda.formaPagamento}
                    </td>
                    <td className="px-4 py-3">
                      <ReceiptButton onClick={() => onComprovante(detalhada)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 sm:hidden">
        {vendas.map((venda) => {
          const detalhada = venda as VendaDetalhada;
          return (
            <div key={venda.id} className="space-y-2 rounded-lg border border-border bg-card p-4">
              <div className="flex justify-between gap-3 text-xs">
                <span className="font-semibold text-foreground">{venda.compradorNome}</span>
                <span className="text-muted-foreground">{venda.data}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ')}
              </p>
              <div className="flex justify-between gap-3 text-xs">
                <div>
                  <span className="font-medium text-foreground">R$ {venda.total.toFixed(2)}</span>
                  {(detalhada.desconto ?? 0) > 0 && (
                    <span className="ml-2 text-muted-foreground">
                      Desc.: R$ {(detalhada.desconto ?? 0).toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground">{venda.formaPagamento}</span>
              </div>
              <ReceiptButton onClick={() => onComprovante(detalhada)} fullWidth />
            </div>
          );
        })}
      </div>
    </>
  );
}

function ReceiptButton({ onClick, fullWidth = false }: { onClick: () => void; fullWidth?: boolean }) {
  return (
    <Button
      type="button"
      size="sm"
      variant={fullWidth ? 'secondary' : 'ghost'}
      className={`${fullWidth ? 'w-full' : ''} h-8 text-[10px]`}
      onClick={onClick}
    >
      <Receipt className="mr-1 h-3 w-3" />
      {fullWidth ? 'Ver comprovante' : 'Comprovante'}
    </Button>
  );
}
