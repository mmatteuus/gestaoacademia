import type { HTMLInputTypeAttribute } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AlunoFormValues } from '../types/aluno.types';

type TextFieldName = 'nome' | 'email' | 'telefone' | 'cpf' | 'dataNascimento';

interface AlunoTextFieldProps {
  name: TextFieldName;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
}

export function AlunoTextField({
  name,
  label,
  type = 'text',
  placeholder,
  className,
}: AlunoTextFieldProps) {
  const { control } = useFormContext<AlunoFormValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-xs">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="h-9 bg-secondary/50 text-base md:text-sm"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
