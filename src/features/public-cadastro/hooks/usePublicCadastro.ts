import { useState, type FormEvent } from 'react';
import { submitPublicCadastro } from '../services/public-cadastro.service';
import type { PublicCadastroField, PublicCadastroFormValues } from '../types/public-cadastro.types';

const INITIAL_FORM: PublicCadastroFormValues = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  data_nascimento: '',
  categoria: '',
  faixa_atual: '',
  observacoes: '',
};

export function usePublicCadastro() {
  const [form, setForm] = useState<PublicCadastroFormValues>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setField = (field: PublicCadastroField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await submitPublicCadastro(form);
      setSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível enviar. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    success,
    setField,
    submit,
  };
}
