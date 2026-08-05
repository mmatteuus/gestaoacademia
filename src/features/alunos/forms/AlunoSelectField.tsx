import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AlunoFormValues } from '../types/aluno.types';

type SelectFieldName = 'categoria' | 'faixaAtual' | 'status';

interface SelectOption {
  label: string;
  value: string;
}

interface AlunoSelectFieldProps {
  name: SelectFieldName;
  label: string;
  placeholder?: string;
  options: readonly SelectOption[];
}

export function AlunoSelectField({
  name,
  label,
  placeholder = 'Selecione',
  options,
}: AlunoSelectFieldProps) {
  const { control } = useFormContext<AlunoFormValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="h-9 bg-secondary/50 text-base md:text-sm">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
