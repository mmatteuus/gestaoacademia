import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/EmptyState';
import type { CarrinhoVendaState } from '../hooks/useCarrinhoVenda';
import { CarrinhoItemRow } from './CarrinhoItemRow';
import { CarrinhoResumo } from './CarrinhoResumo';
import { VendaCheckoutFields } from './VendaCheckoutFields';

export function CarrinhoDialog({ cart }: { cart: CarrinhoVendaState }) {
  return (
    <Dialog open={cart.open} onOpenChange={cart.setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Carrinho de compras</DialogTitle>
        </DialogHeader>

        {cart.carrinho.length === 0 ? (
          <EmptyState
            title="Carrinho vazio"
            description="Adicione produtos do catálogo."
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {cart.carrinho.map((item) => (
              <CarrinhoItemRow
                key={item.produtoId}
                item={item}
                onUpdateQuantity={cart.updateQuantidade}
                onRemove={cart.removeProduto}
              />
            ))}
            <CarrinhoResumo
              descontoTipo={cart.descontoTipo}
              descontoInput={cart.descontoInput}
              subtotal={cart.subtotal}
              desconto={cart.desconto}
              total={cart.total}
              onTipoChange={cart.setDescontoTipo}
              onInputChange={cart.setDescontoInput}
            />
            <VendaCheckoutFields cart={cart} />
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button type="button" variant="ghost" onClick={() => cart.setOpen(false)} className="text-xs">
            Fechar
          </Button>
          {cart.carrinho.length > 0 && (
            <Button type="button" onClick={cart.finalizarVenda} className="text-xs">
              Finalizar venda
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
