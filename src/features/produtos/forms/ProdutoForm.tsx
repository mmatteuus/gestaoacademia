import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { produtoSchema } from '../schemas/produto.schema';
import type { ProdutoFormValues } from '../types/produto.types';
import type { Produto } from '@/types';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';

interface ProdutoFormProps {
  produto?: Produto;
  onSubmit: (data: ProdutoFormValues) => void;
  onCancel: () => void;
}

const categorias = ['Vestimenta', 'Faixas', 'Proteção', 'Acessórios', 'Suplementos'] as const;

export function ProdutoForm({ produto, onSubmit, onCancel }: ProdutoFormProps) {
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: produto?.nome ?? '',
      descricao: produto?.descricao ?? '',
      preco: produto?.preco ?? 0,
      estoque: produto?.estoque ?? 0,
      estoqueMinimo: produto?.estoqueMinimo ?? 5,
      categoria: produto?.categoria ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel className="text-xs">Nome do Produto</FormLabel>
              <FormControl><Input {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="categoria" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-base md:text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="preco" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Preço (R$)</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="estoque" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Estoque Atual</FormLabel>
              <FormControl><Input type="number" {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="estoqueMinimo" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Estoque Mínimo</FormLabel>
              <FormControl><Input type="number" {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="descricao" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Descrição</FormLabel>
            <FormControl><Textarea {...field} rows={3} className="text-base md:text-sm bg-secondary/50 resize-none" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">Cancelar</Button>
          <Button type="submit" className="text-xs">{produto ? 'Salvar Alterações' : 'Cadastrar Produto'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
