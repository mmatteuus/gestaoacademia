import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import type { Aluno, AlunoStatus } from '@/types';
import { turmas, responsaveis } from '@/mocks/data';

const alunoSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  telefone: z.string().trim().min(10, 'Telefone inválido').max(20),
  cpf: z.string().trim().min(11, 'CPF inválido').max(18),
  dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
  faixaAtual: z.string().min(1, 'Faixa obrigatória'),
  status: z.string().min(1, 'Status obrigatório'),
  responsavelId: z.string().optional(),
  turmaIds: z.array(z.string()).default([]),
  observacoes: z.string().max(500).optional(),
});

type AlunoFormValues = z.infer<typeof alunoSchema>;

interface AlunoFormProps {
  aluno?: Aluno;
  onSubmit: (data: AlunoFormValues) => void;
  onCancel: () => void;
}

const categorias = ['Infantil', 'Juvenil', 'Adulto'];
const faixas = ['Branca', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'];
const statuses: { label: string; value: AlunoStatus }[] = [
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Inativo', value: 'inativo' },
];

export function AlunoForm({ aluno, onSubmit, onCancel }: AlunoFormProps) {
  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: aluno?.nome ?? '',
      email: aluno?.email ?? '',
      telefone: aluno?.telefone ?? '',
      cpf: aluno?.cpf ?? '',
      dataNascimento: aluno?.dataNascimento ?? '',
      categoria: aluno?.categoria ?? '',
      faixaAtual: aluno?.faixaAtual ?? 'Branca',
      status: aluno?.status ?? 'pre-cadastro',
      responsavelId: aluno?.responsavelId ?? '',
      turmaIds: aluno?.turmaIds ?? [],
      observacoes: aluno?.observacoes ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel className="text-xs">Nome Completo</FormLabel>
              <FormControl><Input {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Email</FormLabel>
              <FormControl><Input type="email" {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="telefone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Telefone</FormLabel>
              <FormControl><Input {...field} placeholder="(11) 99999-9999" className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="cpf" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">CPF</FormLabel>
              <FormControl><Input {...field} placeholder="000.000.000-00" className="h-9 text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="dataNascimento" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Data de Nascimento</FormLabel>
              <FormControl><Input type="date" {...field} className="h-9 text-sm bg-secondary/50" /></FormControl>
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

          <FormField control={form.control} name="faixaAtual" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Faixa Atual</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{faixas.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="responsavelId" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Responsável (opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Nenhum" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {responsaveis.map(r => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="observacoes" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Observações</FormLabel>
            <FormControl><Textarea {...field} rows={3} className="text-sm bg-secondary/50 resize-none" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">Cancelar</Button>
          <Button type="submit" className="text-xs">{aluno ? 'Salvar Alterações' : 'Cadastrar Aluno'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
