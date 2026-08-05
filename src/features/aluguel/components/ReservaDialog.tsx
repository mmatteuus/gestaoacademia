import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  reservaAluguelSchema,
  type ReservaAluguelValues,
} from '../schemas/reserva-aluguel.schema';

interface ReservaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ReservaAluguelValues) => Promise<boolean>;
}

const DEFAULT_VALUES: ReservaAluguelValues = {
  locatario: '',
  locatarioTelefone: '',
  espaco: 'Tatame Principal',
  dataInicio: '',
  horaInicio: '',
  horaFim: '',
  valor: 0,
};

export function ReservaDialog({ open, onOpenChange, onSubmit }: ReservaDialogProps) {
  const form = useForm<ReservaAluguelValues>({
    resolver: zodResolver(reservaAluguelSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleSubmit = async (values: ReservaAluguelValues) => {
    const saved = await onSubmit(values);
    if (saved) form.reset(DEFAULT_VALUES);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova reserva</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="locatario" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Locatário</FormLabel>
                <FormControl><Input {...field} autoComplete="name" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="locatarioTelefone" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input {...field} type="tel" autoComplete="tel" placeholder="(63) 99999-9999" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="espaco" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Espaço</FormLabel>
                <FormControl>
                  <select {...field} className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm">
                    <option>Tatame Principal</option>
                    <option>Área de Musculação</option>
                    <option>Sala Multiuso</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dataInicio" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Data</FormLabel>
                <FormControl><Input {...field} type="date" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="horaInicio" render={({ field }) => (
              <FormItem>
                <FormLabel>Hora inicial</FormLabel>
                <FormControl><Input {...field} type="time" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="horaFim" render={({ field }) => (
              <FormItem>
                <FormLabel>Hora final</FormLabel>
                <FormControl><Input {...field} type="time" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valor" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Valor do aluguel</FormLabel>
                <FormControl><Input {...field} type="number" min={0} step="0.01" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="sm:col-span-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Confirmar reserva'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
