import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { alunoSchema } from '../schemas/aluno.schema';
import type { AlunoFormValues } from '../types/aluno.types';
import type { Aluno, AlunoStatus } from '@/types';
import { responsaveis } from '@/services/mocks/data';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface AlunoFormProps {
  aluno?: Aluno;
  onSubmit: (data: AlunoFormValues) => void;
  onCancel: () => void;
  // Quick create hook (used later by real service).
  onQuickCreateResponsavel?: (data: { nome: string; telefone: string; email?: string | null }) => Promise<{ id: string; nome: string }>; // [PENDENTE] backend
}

const categorias = ['Infantil', 'Juvenil', 'Adulto'] as const;
const faixas = ['Branca', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'] as const;
const statuses: { label: string; value: AlunoStatus }[] = [
  { label: 'Pré-cadastro', value: 'pre-cadastro' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Trancado', value: 'trancado' },
  { label: 'Inadimplente', value: 'inadimplente' },
  { label: 'Inativo', value: 'inativo' },
];

export function AlunoForm({ aluno, onSubmit, onCancel, onQuickCreateResponsavel }: AlunoFormProps) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickNome, setQuickNome] = useState('');
  const [quickTelefone, setQuickTelefone] = useState('');
  const [quickEmail, setQuickEmail] = useState('');

  const defaultResponsavelId = aluno?.responsavelId ?? null;

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
      responsavelId: defaultResponsavelId,
      turmaIds: aluno?.turmaIds ?? [],
      observacoes: aluno?.observacoes ?? '',
    },
  });

  const responsavelItems = useMemo(() => {
    return responsaveis.map((r) => ({ id: r.id, nome: r.nome }));
  }, []);

  const handleQuickCreate = async () => {
    if (!onQuickCreateResponsavel) {
      // Mock fallback: no backend yet.
      return;
    }
    const created = await onQuickCreateResponsavel({
      nome: quickNome,
      telefone: quickTelefone,
      email: quickEmail.trim() ? quickEmail.trim() : null,
    });
    form.setValue('responsavelId', created.id, { shouldValidate: true, shouldDirty: true });
    setQuickOpen(false);
    setQuickNome('');
    setQuickTelefone('');
    setQuickEmail('');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel className="text-xs">Nome Completo</FormLabel>
              <FormControl><Input {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Email</FormLabel>
              <FormControl><Input type="email" {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="telefone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Telefone</FormLabel>
              <FormControl><Input {...field} placeholder="(11) 99999-9999" className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="cpf" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">CPF</FormLabel>
              <FormControl><Input {...field} placeholder="000.000.000-00" className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="dataNascimento" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Data de Nascimento</FormLabel>
              <FormControl><Input type="date" {...field} className="h-9 text-base md:text-sm bg-secondary/50" /></FormControl>
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

          <FormField control={form.control} name="faixaAtual" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Faixa Atual</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-base md:text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{faixas.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-9 text-base md:text-sm bg-secondary/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="responsavelId" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Responsável (opcional)</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === '' ? null : v)}
                value={field.value ?? ''}
              >
                <FormControl><SelectTrigger className="h-9 text-base md:text-sm bg-secondary/50"><SelectValue placeholder="Nenhum" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {responsavelItems.map((r) => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="pt-2">
                <Button type="button" variant="secondary" size="sm" className="h-8 text-xs" onClick={() => setQuickOpen(true)}>
                  Cadastrar responsável rápido
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )} />

          <div className="sm:col-span-2">
            <p className="text-[10px] text-muted-foreground">
              Turmas: [PENDENTE] seleção no formulário (backend e regras finais).
            </p>
          </div>
        </div>

        <FormField control={form.control} name="observacoes" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Observações</FormLabel>
            <FormControl><Textarea {...field} rows={3} className="text-base md:text-sm bg-secondary/50 resize-none" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">Cancelar</Button>
          <Button type="submit" className="text-xs">{aluno ? 'Salvar Alterações' : 'Cadastrar Aluno'}</Button>
        </DialogFooter>
      </form>

      <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Cadastro rápido de responsável</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome Completo *</label>
              <input
                type="text"
                value={quickNome}
                onChange={(e) => setQuickNome(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="Ex Silva"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Telefone *</label>
              <input
                type="tel"
                value={quickTelefone}
                onChange={(e) => setQuickTelefone(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={quickEmail}
                onChange={(e) => setQuickEmail(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base md:text-sm text-foreground"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button type="button" variant="ghost" onClick={() => setQuickOpen(false)}>Cancelar</Button>
            <Button type="button" onClick={handleQuickCreate} disabled={!quickNome.trim() || !quickTelefone.trim()}>
              Vincular
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
