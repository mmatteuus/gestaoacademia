import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ContratoAluguel } from '@/types';
import {
  pagamentoContratoSchema,
  type PagamentoContratoValues,
} from '../schemas/pagamento-contrato.schema';
import { formatCurrency } from '../utils/aluguel.utils';

interface PagamentoContratoDialogProps {
  open: boolean;
  contrato: ContratoAluguel | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PagamentoContratoValues) => Promise<boolean>;
}

function defaultValues(contrato: ContratoAluguel | null): PagamentoContratoValues {
  return {
    recipientPhone: '',
    valor: contrato?.valor ?? 0,
    formaPagamento: 'PIX',
    referencia: 'Mensalidade atual',
    observacoes: '',
  };
}

export function PagamentoContratoDialog({
  open,
  contrato,
  onOpenChange,
  onSubmit,
}: PagamentoContratoDialogProps) {
  const form = useForm<PagamentoContratoValues>({
    resolver: zodResolver(pagamentoContratoSchema),
    defaultValues: defaultValues(contrato),
  });

  useEffect(() => {
    if (open) form.reset(defaultValues(contrato));
  }, [contrato, form, open]);

  if (!contrato) return null;

  const handleSubmit = async (values: PagamentoContratoValues) => {
    const saved = await onSubmit(values);
    if (saved) form.reset(defaultValues(null));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pagamento do contrato</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs">
          <p className="font-medium text-foreground">{contrato.locatario}</p>
          <p className="text-muted-foreground">{contrato.espaco}</p>
          <p className="mt-1 text-foreground">Valor do contrato: {formatCurrency(contrato.valor)}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="recipientPhone" render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone para o comprovante</FormLabel>
                <FormControl><Input {...field} type="tel" autoComplete="tel" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valor" render={({ field }) => (
              <FormItem>
                <FormLabel>Valor pago</FormLabel>
                <FormControl><Input {...field} type="number" min={0} step="0.01" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="formaPagamento" render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de pagamento</FormLabel>
                <FormControl>
                  <select {...field} className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm">
                    {['PIX', 'Cartao', 'Dinheiro', 'Transferencia'].map((forma) => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="referencia" render={({ field }) => (
              <FormItem>
                <FormLabel>Referência</FormLabel>
                <FormControl><Input {...field} placeholder="Ex.: Abril/2026" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="observacoes" render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl><Textarea {...field} rows={3} className="resize-none" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
