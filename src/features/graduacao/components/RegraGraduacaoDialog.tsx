import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RegraGraduacao } from '@/types';
import {
  regraGraduacaoSchema,
  type RegraGraduacaoValues,
} from '../schemas/regra-graduacao.schema';

interface RegraGraduacaoDialogProps {
  open: boolean;
  regra: RegraGraduacao | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RegraGraduacaoValues) => boolean;
}

const MODALIDADES = ['Jiu-Jitsu', 'Karate', 'Judo', 'Muay Thai'] as const;
const CATEGORIAS = ['Infantil', 'Juvenil', 'Adulto'] as const;

function getDefaultValues(regra: RegraGraduacao | null): RegraGraduacaoValues {
  const modalidade = MODALIDADES.includes(regra?.modalidade as (typeof MODALIDADES)[number])
    ? (regra?.modalidade as (typeof MODALIDADES)[number])
    : 'Jiu-Jitsu';
  const categoria = CATEGORIAS.includes(regra?.categoria as (typeof CATEGORIAS)[number])
    ? (regra?.categoria as (typeof CATEGORIAS)[number])
    : 'Adulto';

  return {
    id: regra?.id ?? '',
    modalidade,
    categoria,
    faixaOrigem: regra?.faixaOrigem ?? '',
    faixaDestino: regra?.faixaDestino ?? '',
    aulasMinimas: regra?.aulasMinimas ?? 0,
    mesesMinimos: regra?.mesesMinimos ?? 0,
  };
}

export function RegraGraduacaoDialog({
  open,
  regra,
  onOpenChange,
  onSubmit,
}: RegraGraduacaoDialogProps) {
  const form = useForm<RegraGraduacaoValues>({
    resolver: zodResolver(regraGraduacaoSchema),
    defaultValues: getDefaultValues(regra),
  });

  useEffect(() => {
    if (open) form.reset(getDefaultValues(regra));
  }, [form, open, regra]);

  const handleSubmit = (values: RegraGraduacaoValues) => {
    if (onSubmit(values)) form.reset(getDefaultValues(null));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{regra ? 'Editar regra de graduação' : 'Nova regra de graduação'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="modalidade" render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade</FormLabel>
                <FormControl>
                  <select {...field} className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm">
                    {MODALIDADES.map((modalidade) => <option key={modalidade}>{modalidade}</option>)}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="categoria" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <select {...field} className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm">
                    {CATEGORIAS.map((categoria) => <option key={categoria}>{categoria}</option>)}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="faixaOrigem" render={({ field }) => (
              <FormItem>
                <FormLabel>Faixa de origem</FormLabel>
                <FormControl><Input {...field} placeholder="Branca" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="faixaDestino" render={({ field }) => (
              <FormItem>
                <FormLabel>Faixa de destino</FormLabel>
                <FormControl><Input {...field} placeholder="Azul" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="aulasMinimas" render={({ field }) => (
              <FormItem>
                <FormLabel>Aulas mínimas</FormLabel>
                <FormControl><Input {...field} type="number" min={0} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mesesMinimos" render={({ field }) => (
              <FormItem>
                <FormLabel>Meses mínimos</FormLabel>
                <FormControl><Input {...field} type="number" min={0} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="sm:col-span-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{regra ? 'Salvar alterações' : 'Criar regra'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
