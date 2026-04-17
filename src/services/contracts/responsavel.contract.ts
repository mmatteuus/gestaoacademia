export interface ResponsavelDTO {
  id: string;
  nome: string;
  email?: string | null;
  telefone: string;
  observacoes?: string | null;
  alunoIds: string[];
}

export interface CreateResponsavelDTO {
  nome: string;
  telefone: string;
  email?: string | null;
  observacoes?: string;
}

export interface UpdateResponsavelDTO {
  nome?: string;
  telefone?: string;
  email?: string | null;
  observacoes?: string | null;
}
