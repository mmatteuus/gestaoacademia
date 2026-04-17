import type { Aluno } from '@/types';

import type { TurmaFormValues } from '../types/turma.types';

export function fromFormToTurmaCreate(values: TurmaFormValues) {
  return {
    nome: values.nome,
    modalidade: values.modalidade,
    professor: values.professor,
    horario: values.horario,
    diasSemana: values.diasSemana,
    capacidade: values.capacidade,
    alunoIds: [] as string[],
  };
}

export function fromFormToTurmaUpdate(values: Partial<TurmaFormValues>) {
  return values;
}
