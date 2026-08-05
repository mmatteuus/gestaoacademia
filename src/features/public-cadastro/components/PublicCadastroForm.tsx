import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PublicCadastroField, PublicCadastroFormValues } from '../types/public-cadastro.types';

interface PublicCadastroFormProps {
  values: PublicCadastroFormValues;
  loading: boolean;
  error: string | null;
  onChange: (field: PublicCadastroField, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function PublicCadastroForm({
  values,
  loading,
  error,
  onChange,
  onSubmit,
}: PublicCadastroFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl p-5 glass-card sm:p-6"
      aria-label="Formulário de cadastro"
    >
      <Field label="Nome completo *" htmlFor="nome">
        <Input id="nome" required value={values.nome} onChange={(event) => onChange('nome', event.target.value)} autoComplete="name" />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Telefone *" htmlFor="telefone">
          <Input id="telefone" required value={values.telefone} onChange={(event) => onChange('telefone', event.target.value)} autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="E-mail" htmlFor="email">
          <Input id="email" type="email" value={values.email} onChange={(event) => onChange('email', event.target.value)} autoComplete="email" inputMode="email" />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="CPF" htmlFor="cpf">
          <Input id="cpf" value={values.cpf} onChange={(event) => onChange('cpf', event.target.value)} inputMode="numeric" />
        </Field>
        <Field label="Data de nascimento" htmlFor="data_nascimento">
          <Input id="data_nascimento" type="date" value={values.data_nascimento} onChange={(event) => onChange('data_nascimento', event.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Categoria" htmlFor="categoria">
          <select
            id="categoria"
            value={values.categoria}
            onChange={(event) => onChange('categoria', event.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
          >
            <option value="">Selecione</option>
            <option value="Adulto">Adulto</option>
            <option value="Juvenil">Juvenil</option>
            <option value="Infantil">Infantil</option>
          </select>
        </Field>
        <Field label="Faixa atual" htmlFor="faixa_atual">
          <Input id="faixa_atual" placeholder="Ex.: Branca" value={values.faixa_atual} onChange={(event) => onChange('faixa_atual', event.target.value)} />
        </Field>
      </div>

      <Field label="Observações" htmlFor="observacoes">
        <textarea
          id="observacoes"
          value={values.observacoes}
          onChange={(event) => onChange('observacoes', event.target.value)}
          maxLength={500}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
        />
      </Field>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="h-11 w-full" disabled={loading || !values.nome || !values.telefone}>
        {loading ? 'Enviando...' : 'Enviar cadastro'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">* campos obrigatórios</p>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
