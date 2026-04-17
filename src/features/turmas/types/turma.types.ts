import type { Turma } from '@/types';

export type TurmaViewModel = Turma;

export interface TurmaFormValues {
  nome: string;
  modalidade: string;
  professor: string;
  horario: string;
  diasSemana: string[];
  capacidade: number;
}
