export interface ReservaDTO {
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

export interface CreateReservaDTO {
  espaco: string;
  locatario: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  valor: number;
}

export interface ContratoAluguelDTO {
  id: string;
  locatario: string;
  espaco: string;
  valor: number;
  periodicidade: 'mensal' | 'semanal' | 'avulso';
  dataInicio: string;
  dataFim: string;
  status: 'ativo' | 'encerrado' | 'cancelado';
}

export interface CreateContratoAluguelDTO {
  locatario: string;
  espaco: string;
  valor: number;
  periodicidade: 'mensal' | 'semanal' | 'avulso';
  dataInicio: string;
  dataFim: string;
}
