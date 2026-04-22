// === Aluno ===
export type AlunoStatus = 'pre-cadastro' | 'ativo' | 'trancado' | 'inadimplente' | 'inativo';

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  status: AlunoStatus;
  foto?: string;
  responsavelId?: string;
  turmaIds: string[];
  faixaAtual: string;
  categoria: string;
  dataMatricula: string;
  observacoes?: string;
}

export interface Responsavel {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  alunoIds: string[];
}

export interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  professor: string;
  horario: string;
  diasSemana: string[];
  capacidade: number;
  alunoIds: string[];
}

export interface RegistroFrequencia {
  id: string;
  alunoId: string;
  turmaId: string;
  data: string;
  presente: boolean;
}

export interface SessaoAula {
  id: string;
  turmaId: string;
  data: string;
  professor: string;
  presencas: { alunoId: string; presente: boolean }[];
}

export type GraduacaoStatus = 'nao-elegivel' | 'elegivel' | 'aprovado' | 'graduado';

export interface RegraGraduacao {
  id: string;
  modalidade?: string;
  faixaOrigem: string;
  faixaDestino: string;
  categoria: string;
  aulasMinimas: number;
  mesesMinimos: number;
}

export interface GraduacaoAluno {
  id?: string;
  alunoId: string;
  faixaAtual: string;
  proximaFaixa: string;
  aulasRealizadas: number;
  aulasNecessarias: number;
  status: GraduacaoStatus;
  dataUltimaGraduacao?: string;
}

export interface HistoricoGraduacao {
  id: string;
  alunoId: string;
  faixaDe: string;
  faixaPara: string;
  data: string;
  aprovadoPor: string;
}

export interface RankingEntry {
  alunoId: string;
  nomeAluno: string;
  categoria: string;
  posicao: number;
  posicaoAnterior: number;
  pontuacao: number;
  vitorias: number;
  medalhas: number;
  temporada: string;
}

export interface Campeonato {
  id: string;
  nome: string;
  data: string;
  local: string;
  modalidade: string;
  status: 'planejado' | 'inscricoes-abertas' | 'em-andamento' | 'finalizado';
  participantes: ParticipanteCampeonato[];
}

export interface ParticipanteCampeonato {
  alunoId: string;
  nomeAluno: string;
  categoria: string;
  colocacao?: number;
  medalha?: 'ouro' | 'prata' | 'bronze';
  pontuacao?: number;
}

export type CobrancaStatus = 'aberta' | 'parcial' | 'paga' | 'vencida' | 'cancelada' | 'estornada';
export type FormaPagamento = 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência' | 'Boleto';

export interface Cobranca {
  id: string;
  alunoId: string;
  nomeAluno: string;
  tipo: 'mensalidade' | 'inscricao' | 'graduacao' | 'produto' | 'aluguel';
  descricao: string;
  valor: number;
  valorPago: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: CobrancaStatus;
  formaPagamento?: FormaPagamento;
  observacoes?: string;
  comprovanteId?: string;
}

export interface Despesa {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  status: 'pendente' | 'paga';
}

export interface Receita {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  origem: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoria: string;
  imagem?: string;
}

export interface Venda {
  id: string;
  data: string;
  itens: { produtoId: string; nomeProduto: string; quantidade: number; precoUnitario: number }[];
  total: number;
  compradorNome: string;
  formaPagamento: Exclude<FormaPagamento, 'Boleto'>;
  observacoes?: string;
  parcelado?: boolean;
  quantidadeParcelas?: number;
  comprovanteId?: string;
}

export interface Reserva {
  id: string;
  espaco: string;
  locatario: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  valor: number;
  status: 'confirmada' | 'pendente' | 'cancelada';
  conflito?: boolean;
}

export interface ContratoAluguel {
  id: string;
  locatario: string;
  espaco: string;
  valor: number;
  periodicidade: 'mensal' | 'semanal' | 'avulso';
  dataInicio: string;
  dataFim: string;
  status: 'ativo' | 'encerrado' | 'cancelado';
}

export interface PagamentoContratoAluguel {
  id: string;
  contratoId: string;
  dataPagamento: string;
  valor: number;
  formaPagamento: Exclude<FormaPagamento, 'Boleto'>;
  observacoes?: string;
  referencia?: string;
  comprovanteId?: string;
}

export interface KPI {
  label: string;
  valor: string | number;
  variacao?: number;
  icone?: string;
  tipo?: 'positivo' | 'negativo' | 'neutro';
}

export interface Alerta {
  id: string;
  tipo: 'urgente' | 'aviso' | 'info';
  mensagem: string;
  data: string;
}

export interface AtividadeRecente {
  id: string;
  descricao: string;
  data: string;
  tipo: string;
}
