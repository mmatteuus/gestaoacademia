import { Percent } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { VendaCheckoutValues } from '../schemas/venda-checkout.schema';

export function CheckoutDiscountFields() {
  const { control, watch } = useFormContext<VendaCheckoutValues>();
  const descontoTipo = watch('descontoTipo');

  return (
    <section className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Percent className="h-3.5 w-3.5" />
        <span>Desconto opcional da venda</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[150px_1fr]">
        <FormField
          control={control}
          name="descontoTipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Tipo de desconto</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
                >
                  <option value="valor">Valor em reais</option>
                  <option value="percentual">Percentual</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="descontoInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Valor do desconto</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  max={descontoTipo === 'percentual' ? 100 : undefined}
                  step="0.01"
                  placeholder={descontoTipo === 'percentual' ? 'Ex.: 10' : 'Ex.: 15,00'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
