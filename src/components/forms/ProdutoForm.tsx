import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import type { Produto } from '@/types';

const produtoSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  descricao: z.string().trim().min(3, 'Descrição obrigatória').max(300),
  preco: z.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  estoque: z.coerce.number().min(0, 'Estoque não pode ser negativo'),
  estoqueMinimo: z.coerce.number().min(0, 'Estoque mínimo não pode ser negativo'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
});

type ProdutoFormValues = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  produto?: Produto;
  onSubmit: (data: ProdutoFormValues) => void;
  onCancel: () => void;
}

const categorias = ['Vestimenta', 'Faixas', 'Proteção', 'Acessórios', 'Suplementos'];

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
              <FormControl><Input {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="categoria" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="preco" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Preço (R$)</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="estoque" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Estoque Atual</FormLabel>
              <FormControl><Input type="number" {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="estoqueMinimo" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Estoque Mínimo</FormLabel>
              <FormControl><Input type="number" {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="descricao" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Descrição</FormLabel>
            <FormControl><Textarea {...field} rows={3} className="text-sm bg-secondary/50 resize-none" /></FormControl>
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
