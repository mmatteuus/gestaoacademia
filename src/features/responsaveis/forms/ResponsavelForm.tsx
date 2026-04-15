import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { responsavelSchema } from '../schemas/responsavel.schema';
import type { ResponsavelFormValues } from '../types/responsavel.types';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ResponsavelFormProps {
  defaultValues?: Partial<ResponsavelFormValues>;
  onSubmit: (values: ResponsavelFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ResponsavelForm({ defaultValues, onSubmit, onCancel, submitLabel }: ResponsavelFormProps) {
  const form = useForm<ResponsavelFormValues>({
    resolver: zodResolver(responsavelSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      telefone: defaultValues?.telefone ?? '',
      email: defaultValues?.email ?? '',
      observacoes: defaultValues?.observacoes ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Nome Completo *</FormLabel>
            <FormControl><Input {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="telefone" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Telefone *</FormLabel>
            <FormControl><Input {...field} placeholder="(00) 00000-0000" className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Email (opcional)</FormLabel>
            <FormControl><Input type="email" {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="observacoes" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Observações (opcional)</FormLabel>
            <FormControl><Textarea {...field} rows={3} className="text-base md:text-sm bg-secondary/50 resize-none" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">Cancelar</Button>
          <Button type="submit" className="text-xs">{submitLabel ?? 'Salvar'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
