import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  vendaCheckoutSchema,
  type VendaCheckoutValues,
} from '../schemas/venda-checkout.schema';
import type { CarrinhoItem } from '../types/produtos.types';
import { calcularDesconto } from '../utils/produtos.utils';
import { CarrinhoItems } from './CarrinhoItems';
import { CheckoutBuyerFields } from './CheckoutBuyerFields';
import { CheckoutDiscountFields } from './CheckoutDiscountFields';
import { CheckoutTotals } from './CheckoutTotals';

interface CarrinhoDialogProps {
  open: boolean;
  items: CarrinhoItem[];
  subtotal: number;
  onOpenChange: (open: boolean) => void;
  onUpdateQuantity: (produtoId: string, delta: number) => void;
  onRemove: (produtoId: string) => void;
  onSubmit: (values: VendaCheckoutValues) => Promise<boolean>;
}

const DEFAULT_VALUES: VendaCheckoutValues = {
  compradorNome: '',
  compradorTelefone: '',
  formaPagamento: 'PIX',
  observacoes: '',
  parcelado: false,
  parcelas: 2,
  descontoTipo: 'valor',
  descontoInput: 0,
};

export function CarrinhoDialog({
  open,
  items,
  subtotal,
  onOpenChange,
  onUpdateQuantity,
  onRemove,
  onSubmit,
}: CarrinhoDialogProps) {
  const form = useForm<VendaCheckoutValues>({
    resolver: zodResolver(vendaCheckoutSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const descontoTipo = form.watch('descontoTipo');
  const descontoInput = Number(form.watch('descontoInput') || 0);
  const desconto = calcularDesconto(subtotal, descontoTipo, descontoInput);

  const handleSubmit = async (values: VendaCheckoutValues) => {
    const completed = await onSubmit(values);
    if (completed) form.reset(DEFAULT_VALUES);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && items.length === 0) form.reset(DEFAULT_VALUES);
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Carrinho de compras</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <EmptyState title="Carrinho vazio" description="Adicione produtos do catálogo." className="py-8" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <CarrinhoItems
                items={items}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
              <CheckoutDiscountFields />
              <CheckoutTotals subtotal={subtotal} desconto={desconto} />
              <CheckoutBuyerFields />

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                  Continuar comprando
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Finalizando...' : 'Finalizar venda'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
