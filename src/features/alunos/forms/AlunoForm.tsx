import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import type { Aluno } from '@/types';
import { alunoSchema } from '../schemas/aluno.schema';
import type { AlunoFormValues } from '../types/aluno.types';
import { AlunoEnrollmentFields } from './AlunoEnrollmentFields';
import { AlunoPersonalFields } from './AlunoPersonalFields';

interface ResponsavelOption {
  id: string;
  nome: string;
}

interface AlunoFormProps {
  aluno?: Aluno;
  onSubmit: (data: AlunoFormValues) => void | Promise<void>;
  onCancel: () => void;
  responsaveis: ResponsavelOption[];
  onQuickCreateResponsavel?: (data: {
    nome: string;
    telefone: string;
    email?: string | null;
  }) => Promise<ResponsavelOption>;
}

function getDefaultValues(aluno?: Aluno): AlunoFormValues {
  return {
    nome: aluno?.nome ?? '',
    email: aluno?.email ?? '',
    telefone: aluno?.telefone ?? '',
    cpf: aluno?.cpf ?? '',
    dataNascimento: aluno?.dataNascimento ?? '',
    categoria: aluno?.categoria ?? '',
    faixaAtual: aluno?.faixaAtual ?? 'Branca',
    status: aluno?.status ?? 'pre-cadastro',
    responsavelId: aluno?.responsavelId ?? null,
    turmaIds: aluno?.turmaIds ?? [],
    observacoes: aluno?.observacoes ?? '',
  };
}

export function AlunoForm({
  aluno,
  onSubmit,
  onCancel,
  responsaveis,
  onQuickCreateResponsavel,
}: AlunoFormProps) {
  const form = useForm<AlunoFormValues>({
    resolver: zodResolver(alunoSchema),
    defaultValues: getDefaultValues(aluno),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AlunoPersonalFields />
        <AlunoEnrollmentFields
          responsaveis={responsaveis}
          onQuickCreateResponsavel={onQuickCreateResponsavel}
        />

        <DialogFooter className="flex-col gap-2 pt-2 sm:flex-row">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Salvando...'
              : aluno
                ? 'Salvar alterações'
                : 'Cadastrar aluno'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
