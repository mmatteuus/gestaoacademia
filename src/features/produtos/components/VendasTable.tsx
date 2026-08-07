import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Venda } from '@/types';
import type { VendaDetalhada } from '../types/produtos.types';
import { formatCurrency } from '../utils/produtos.utils';

interface VendasTableProps {
  vendas: Venda[];
  onOpenReceipt: (venda: Venda) => void;
}

export function VendasTable({ vendas, onOpenReceipt }: VendasTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card sm:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs">
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
                <tr key={venda.id} className="border-b border-border/50 last:border-b-0">
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{venda.data}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{venda.compradorNome}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {venda.itens.map((item) => item.nomeProduto).join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                    {formatCurrency(venda.total)}
                    {(detalhada.desconto ?? 0) > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Desconto: {formatCurrency(detalhada.desconto ?? 0)}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {venda.formaPagamento}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[10px]"
                      onClick={() => onOpenReceipt(venda)}
                    >
                      <Receipt className="mr-1 h-3 w-3" />
                      Comprovante
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
