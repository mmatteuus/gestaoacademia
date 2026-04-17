export interface RankingEntryDTO {
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

export interface RegraGraduacaoDTO {
  id: string;
  faixaOrigem: string;
  faixaDestino: string;
  categoria: string;
  aulasMinimas: number;
  mesesMinimos: number;
}

export interface GraduacaoAlunoDTO {
  alunoId: string;
  faixaAtual: string;
  proximaFaixa: string;
  aulasRealizadas: number;
  aulasNecessarias: number;
  status: 'nao-elegivel' | 'elegivel' | 'aprovado' | 'graduado';
  dataUltimaGraduacao?: string;
}

export interface HistoricoGraduacaoDTO {
  id: string;
  alunoId: string;
  faixaDe: string;
  faixaPara: string;
  data: string;
  aprovadoPor: string;
}
