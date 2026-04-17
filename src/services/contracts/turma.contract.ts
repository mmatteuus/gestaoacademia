export interface TurmaDTO {
  id: string;
  nome: string;
  modalidade: string;
  professor: string;
  horario: string;
  diasSemana: string[];
  capacidade: number;
  alunoIds: string[];
}

export interface CreateTurmaDTO {
  nome: string;
  modalidade: string;
  professor: string;
  horario: string;
  diasSemana: string[];
  capacidade: number;
}

export interface UpdateTurmaDTO {
  nome?: string;
  modalidade?: string;
  professor?: string;
  horario?: string;
  diasSemana?: string[];
  capacidade?: number;
}
