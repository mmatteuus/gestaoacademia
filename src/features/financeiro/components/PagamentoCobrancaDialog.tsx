import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Cobranca } from '@/types';
import {
  pagamentoCobrancaSchema,
  type PagamentoCobrancaValues,
} from '../schemas/pagamento-cobranca.schema';
import { formatCurrency } from '../utils/financeiro.utils';

interface PagamentoCobrancaDialogProps {
  open: boolean;
  cobranca: Cobranca | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PagamentoCobrancaValues) => Promise<boolean>;
}

function getDefaultValues(cobranca: Cobranca | null): PagamentoCobrancaValues {
  return {
    valorPagamento: cobranca ? cobranca.valor - cobranca.valorPago : 0,
    formaPagamento: cobranca?.formaPagamento || 'PIX',
    observacoes: cobranca?.observacoes || '',
  };
}

export function PagamentoCobrancaDialog({
  open,
  cobranca,
  onOpenChange,
  onSubmit,
}: PagamentoCobrancaDialogProps) {
  const form = useForm<PagamentoCobrancaValues>({
    resolver: zodResolver(pagamentoCobrancaSchema),
    defaultValues: getDefaultValues(cobranca),
  });

  useEffect(() => {
    if (open) form.reset(getDefaultValues(cobranca));
  }, [cobranca, form, open]);

  if (!cobranca) return null;

  const restante = cobranca.valor - cobranca.valorPago;
  const handleSubmit = async (values: PagamentoCobrancaValues) => {
    const saved = await onSubmit(values);
    if (saved) form.reset(getDefaultValues(null));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pagamento</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs">
          <p className="font-medium text-foreground">{cobranca.nomeAluno}</p>
          <p className="text-muted-foreground">{cobranca.descricao}</p>
          <p className="mt-1 text-foreground">Saldo: {formatCurrency(restante)}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="valorPagamento" render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do pagamento</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} max={restante} step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="formaPagamento" render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento</FormLabel>
                <FormControl>
                  <select {...field} className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm">
                    {['PIX', 'Cartao', 'Dinheiro', 'Transferencia', 'Boleto'].map((forma) => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="observacoes" render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} className="resize-none" placeholder="Ex.: pagamento referente ao mês atual" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Confirmar pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
