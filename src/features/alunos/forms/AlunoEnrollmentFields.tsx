import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { AlunoFormValues } from '../types/aluno.types';
import { AlunoSelectField } from './AlunoSelectField';
import { CATEGORIAS, FAIXAS, STATUS_OPTIONS } from './aluno-form.constants';
import { ResponsavelField } from './ResponsavelField';

interface ResponsavelOption {
  id: string;
  nome: string;
}

interface AlunoEnrollmentFieldsProps {
  responsaveis: ResponsavelOption[];
  onQuickCreateResponsavel?: (data: {
    nome: string;
    telefone: string;
    email?: string | null;
  }) => Promise<ResponsavelOption>;
}

export function AlunoEnrollmentFields({
  responsaveis,
  onQuickCreateResponsavel,
}: AlunoEnrollmentFieldsProps) {
  const { control } = useFormContext<AlunoFormValues>();

  return (
    <section className="space-y-3" aria-labelledby="aluno-matricula">
      <div>
        <h3 id="aluno-matricula" className="text-sm font-semibold text-foreground">
          Matrícula e prática
        </h3>
        <p className="text-xs text-muted-foreground">
          Situação do aluno, categoria, graduação e responsável vinculado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AlunoSelectField
          name="categoria"
          label="Categoria"
          options={CATEGORIAS.map((value) => ({ label: value, value }))}
        />
        <AlunoSelectField
          name="faixaAtual"
          label="Faixa atual"
          options={FAIXAS.map((value) => ({ label: value, value }))}
        />
        <AlunoSelectField name="status" label="Situação" options={STATUS_OPTIONS} />
        <ResponsavelField
          responsaveis={responsaveis}
          onQuickCreate={onQuickCreateResponsavel}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Os vínculos de turma são gerenciados na ficha do aluno após o cadastro.
      </p>

      <FormField
        control={control}
        name="observacoes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Observações</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} className="resize-none bg-secondary/50 text-base md:text-sm" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}
