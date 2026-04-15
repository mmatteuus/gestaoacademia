export interface CobrancaDTO {
  id: string;
  alunoId: string;
  nomeAluno: string;
  tipo: 'mensalidade' | 'inscricao' | 'graduacao' | 'produto' | 'aluguel';
  descricao: string;
  valor: number;
  valorPago: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'aberta' | 'parcial' | 'paga' | 'vencida' | 'cancelada' | 'estornada';
}

export interface CreateCobrancaDTO {
  alunoId: string;
  tipo: 'mensalidade' | 'inscricao' | 'graduacao' | 'produto' | 'aluguel';
  descricao: string;
  valor: number;
  dataVencimento: string;
}

export interface UpdateCobrancaDTO {
  descricao?: string;
  valor?: number;
  dataVencimento?: string;
  status?: 'aberta' | 'parcial' | 'paga' | 'vencida' | 'cancelada' | 'estornada';
}

export interface DespesaDTO {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  status: 'pendente' | 'paga';
}

export interface CreateDespesaDTO {
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
}

export interface ReceitaDTO {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  origem: string;
}

export interface CreateReceitaDTO {
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  origem: string;
}
