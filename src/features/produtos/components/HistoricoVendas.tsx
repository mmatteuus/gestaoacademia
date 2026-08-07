import { Receipt } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import type { Venda } from '@/types';
import type { VendaDetalhada } from '../useProdutosPage';

interface Props {
  vendas: Venda[];
  onReceipt: (venda: Venda) => void;
}

export function HistoricoVendas({ vendas, onReceipt }: Props) {
  if (vendas.length === 0) return <EmptyState title="Nenhuma venda registrada" />;

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Data', 'Comprador', 'Itens', 'Total', 'Pagamento', 'Ações'].map((label) => (
                  <th key={label} className="px-4 py-3 text-left font-semibold text-muted-foreground">{label}</th>
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
                    <td className="px-4 py-3 text-muted-foreground">{venda.itens.map((item) => item.nomeProduto).join(', ')}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      R$ {venda.total.toFixed(2)}
                      {(detalhada.desconto ?? 0) > 0 && (
                        <p className="text-[10px] text-muted-foreground">Desc.: R$ {(detalhada.desconto ?? 0).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{venda.formaPagamento}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => onReceipt(venda)}>
                        <Receipt className="mr-1 h-3 w-3" />Comprovante
                      </Button>
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
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">{venda.compradorNome}</span>
                <span className="text-muted-foreground">{venda.data}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {venda.itens.map((item) => `${item.nomeProduto} x${item.quantidade}`).join(', ')}
              </p>
              <div className="flex justify-between text-xs">
                <div>
                  <span className="font-medium text-foreground">R$ {venda.total.toFixed(2)}</span>
                  {(detalhada.desconto ?? 0) > 0 && (
                    <span className="ml-2 text-muted-foreground">Desc.: R$ {(detalhada.desconto ?? 0).toFixed(2)}</span>
                  )}
                </div>
                <span className="text-muted-foreground">{venda.formaPagamento}</span>
              </div>
              <Button size="sm" variant="secondary" className="h-8 w-full text-xs" onClick={() => onReceipt(venda)}>
                <Receipt className="mr-1 h-3 w-3" />Ver comprovante
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
