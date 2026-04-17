export interface AlunoDTO {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  categoria: string;
  faixaAtual: string;
  status: string;
  observacoes?: string | null;
  responsavelId?: string | null;
  turmaIds: string[];
  dataMatricula: string;
}

export interface CreateAlunoDTO {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  categoria: string;
  faixaAtual: string;
  status: string;
  observacoes?: string;
  responsavelId?: string | null;
  turmaIds: string[];
}

export interface UpdateAlunoDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  categoria?: string;
  faixaAtual?: string;
  status?: string;
  observacoes?: string | null;
  responsavelId?: string | null;
  turmaIds?: string[];
}
