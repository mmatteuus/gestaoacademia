import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AlunoFormValues } from '../types/aluno.types';
import { NO_RESPONSAVEL_VALUE } from './aluno-form.constants';
import { QuickResponsavelDialog } from './QuickResponsavelDialog';

interface ResponsavelOption {
  id: string;
  nome: string;
}

interface ResponsavelFieldProps {
  responsaveis: ResponsavelOption[];
  onQuickCreate?: (data: {
    nome: string;
    telefone: string;
    email?: string | null;
  }) => Promise<ResponsavelOption>;
}

export function ResponsavelField({ responsaveis, onQuickCreate }: ResponsavelFieldProps) {
  const { control, setValue } = useFormContext<AlunoFormValues>();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name="responsavelId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Responsável</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value === NO_RESPONSAVEL_VALUE ? null : value)}
              value={field.value ?? NO_RESPONSAVEL_VALUE}
            >
              <FormControl>
                <SelectTrigger className="h-9 bg-secondary/50 text-base md:text-sm">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={NO_RESPONSAVEL_VALUE}>Nenhum</SelectItem>
                {responsaveis.map((responsavel) => (
                  <SelectItem key={responsavel.id} value={responsavel.id}>
                    {responsavel.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onQuickCreate && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 h-8 text-xs"
                onClick={() => setQuickOpen(true)}
              >
                Cadastrar responsável
              </Button>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {onQuickCreate && (
        <QuickResponsavelDialog
          open={quickOpen}
          onOpenChange={setQuickOpen}
          onCreate={onQuickCreate}
          onCreated={(responsavel) => {
            setValue('responsavelId', responsavel.id, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      )}
    </>
  );
}
