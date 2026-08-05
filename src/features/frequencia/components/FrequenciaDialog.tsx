import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Aluno, Turma } from '@/types';
import { frequenciaSchema, type FrequenciaValues } from '../schemas/frequencia.schema';

interface FrequenciaDialogProps {
  open: boolean;
  turma?: Turma;
  alunos: Aluno[];
  presencas: Record<string, boolean>;
  onOpenChange: (open: boolean) => void;
  onToggle: (alunoId: string) => void;
  onSubmit: (values: FrequenciaValues) => Promise<boolean>;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

export function FrequenciaDialog({
  open,
  turma,
  alunos,
  presencas,
  onOpenChange,
  onToggle,
  onSubmit,
}: FrequenciaDialogProps) {
  const form = useForm<FrequenciaValues>({
    resolver: zodResolver(frequenciaSchema),
    defaultValues: { data: today() },
  });

  useEffect(() => {
    if (open) form.reset({ data: today() });
  }, [form, open]);

  if (!turma) return null;

  const alunosById = new Map(alunos.map((aluno) => [aluno.id, aluno]));
  const handleSubmit = async (values: FrequenciaValues) => {
    const saved = await onSubmit(values);
    if (saved) form.reset({ data: today() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Lançar frequência — {turma.nome}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="data" render={({ field }) => (
              <FormItem>
                <FormLabel>Data da aula</FormLabel>
                <FormControl><Input {...field} type="date" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <fieldset>
              <legend className="mb-2 text-xs text-muted-foreground">Marque os alunos presentes</legend>
              <div className="space-y-2">
                {turma.alunoIds.map((alunoId) => {
                  const presente = presencas[alunoId] ?? false;
                  return (
                    <button
                      key={alunoId}
                      type="button"
                      onClick={() => onToggle(alunoId)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-xs transition-colors ${
                        presente
                          ? 'border-success/30 bg-success/10 text-foreground'
                          : 'border-destructive/30 bg-destructive/10 text-muted-foreground'
                      }`}
                    >
                      {presente ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                      )}
                      <span className="text-sm">{alunosById.get(alunoId)?.nome || alunoId}</span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider">
                        {presente ? 'Presente' : 'Ausente'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar frequência'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
