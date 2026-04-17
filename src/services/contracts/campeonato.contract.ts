export interface ParticipanteCampeonatoDTO {
  alunoId: string;
  nomeAluno: string;
  categoria: string;
  colocacao?: number;
  medalha?: 'ouro' | 'prata' | 'bronze';
  pontuacao?: number;
}

export interface CampeonatoDTO {
  id: string;
  nome: string;
  data: string;
  local: string;
  modalidade: string;
  status: 'planejado' | 'inscricoes-abertas' | 'em-andamento' | 'finalizado';
  participantes: ParticipanteCampeonatoDTO[];
}

export interface CreateCampeonatoDTO {
  nome: string;
  data: string;
  local: string;
  modalidade: string;
}
