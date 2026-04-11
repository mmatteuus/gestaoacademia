import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import type { Turma } from '@/types';

const turmaSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  modalidade: z.string().min(1, 'Modalidade obrigatória'),
  professor: z.string().trim().min(3, 'Professor obrigatório').max(100),
  horario: z.string().trim().min(1, 'Horário obrigatório'),
  diasSemana: z.array(z.string()).min(1, 'Selecione ao menos um dia'),
  capacidade: z.coerce.number().min(1, 'Capacidade mínima: 1').max(100),
});

type TurmaFormValues = z.infer<typeof turmaSchema>;

interface TurmaFormProps {
  turma?: Turma;
  onSubmit: (data: TurmaFormValues) => void;
  onCancel: () => void;
}

const modalidades = ['Jiu-Jitsu', 'Karatê', 'Muay Thai', 'Judô', 'Taekwondo', 'MMA', 'Boxe'];
const diasOptions = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function TurmaForm({ turma, onSubmit, onCancel }: TurmaFormProps) {
  const form = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      nome: turma?.nome ?? '',
      modalidade: turma?.modalidade ?? '',
      professor: turma?.professor ?? '',
      horario: turma?.horario ?? '',
      diasSemana: turma?.diasSemana ?? [],
      capacidade: turma?.capacidade ?? 20,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel className="text-xs">Nome da Turma</FormLabel>
              <FormControl><Input {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="modalidade" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Modalidade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{modalidades.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="professor" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Professor</FormLabel>
              <FormControl><Input {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="horario" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Horário</FormLabel>
              <FormControl><Input {...field} placeholder="08:00 - 09:30" className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="capacidade" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Capacidade</FormLabel>
              <FormControl><Input type="number" {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="diasSemana" render={() => (
          <FormItem>
            <FormLabel className="text-xs">Dias da Semana</FormLabel>
            <div className="flex flex-wrap gap-3 mt-1">
              {diasOptions.map(dia => (
                <FormField key={dia} control={form.control} name="diasSemana" render={({ field }) => (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox
                      checked={field.value?.includes(dia)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...(field.value || []), dia]
                          : field.value?.filter((d: string) => d !== dia) || [];
                        field.onChange(updated);
                      }}
                    />
                    <span className="text-xs text-foreground">{dia}</span>
                  </label>
                )} />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">Cancelar</Button>
          <Button type="submit" className="text-xs">{turma ? 'Salvar Alterações' : 'Criar Turma'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
