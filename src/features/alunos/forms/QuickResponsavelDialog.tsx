import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  responsavelRapidoSchema,
  type ResponsavelRapidoValues,
} from '../schemas/responsavel-rapido.schema';

interface ResponsavelCriado {
  id: string;
  nome: string;
}

interface QuickResponsavelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    nome: string;
    telefone: string;
    email?: string | null;
  }) => Promise<ResponsavelCriado>;
  onCreated: (responsavel: ResponsavelCriado) => void;
}

const DEFAULT_VALUES: ResponsavelRapidoValues = {
  nome: '',
  telefone: '',
  email: '',
};

export function QuickResponsavelDialog({
  open,
  onOpenChange,
  onCreate,
  onCreated,
}: QuickResponsavelDialogProps) {
  const form = useForm<ResponsavelRapidoValues>({
    resolver: zodResolver(responsavelRapidoSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) form.reset(DEFAULT_VALUES);
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (values: ResponsavelRapidoValues) => {
    try {
      const created = await onCreate({
        nome: values.nome,
        telefone: values.telefone,
        email: values.email || null,
      });
      onCreated(created);
      form.reset(DEFAULT_VALUES);
      onOpenChange(false);
    } catch {
      form.setError('root', {
        message: 'Não foi possível cadastrar o responsável. Tente novamente.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Cadastro rápido de responsável</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Cadastrar e vincular'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
