import type { Aluno } from '@/types';

import type { AlunoFormValues } from '../types/aluno.types';

export function fromFormToAlunoPatch(values: AlunoFormValues): Omit<Aluno, 'id' | 'dataMatricula'> {
  return {
    nome: values.nome,
    email: values.email,
    telefone: values.telefone,
    cpf: values.cpf,
    dataNascimento: values.dataNascimento,
    categoria: values.categoria,
    faixaAtual: values.faixaAtual,
    status: values.status,
    turmaIds: values.turmaIds,
    observacoes: values.observacoes,
    // Normalize: never keep sentinel; null means absent.
    responsavelId: values.responsavelId ?? undefined,
  };
}
