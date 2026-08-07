import { Phone } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { VendaCheckoutValues } from '../schemas/venda-checkout.schema';

const FORMAS_PAGAMENTO = ['PIX', 'Cartao', 'Dinheiro', 'Transferencia'] as const;

export function CheckoutBuyerFields() {
  const { control, watch } = useFormContext<VendaCheckoutValues>();
  const parcelado = watch('parcelado');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="compradorNome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do comprador</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="name" placeholder="Ex.: Lucas Mendes" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="compradorTelefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone do comprador</FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input {...field} type="tel" autoComplete="tel" className="pl-9" placeholder="(63) 99999-9999" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="formaPagamento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Forma de pagamento</FormLabel>
            <FormControl>
              <select
                {...field}
                className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground"
              >
                {FORMAS_PAGAMENTO.map((forma) => (
                  <option key={forma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="parcelado"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl>
              <input
                id="venda-parcelada"
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4 rounded border-border"
              />
            </FormControl>
            <FormLabel htmlFor="venda-parcelada">Compra parcelada</FormLabel>
          </FormItem>
        )}
      />

      {parcelado && (
        <FormField
          control={control}
          name="parcelas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de parcelas</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="observacoes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} className="resize-none" placeholder="Ex.: primeira parcela paga no ato" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
