import type { Aluno, AlunoStatus } from '@/types';

// View model used by UI. Today it matches the in-app domain type.
export type AlunoViewModel = Aluno;

export type AlunoFormResponsavelId = string | null;

export interface AlunoFormValues {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  categoria: string;
  faixaAtual: string;
  status: AlunoStatus;
  responsavelId: AlunoFormResponsavelId;
  turmaIds: string[];
  observacoes?: string;
}
