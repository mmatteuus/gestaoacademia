export interface SessaoAulaDTO {
  id: string;
  turmaId: string;
  data: string;
  professor: string;
  presencas: { alunoId: string; presente: boolean }[];
}

export interface CreateSessaoAulaDTO {
  turmaId: string;
  data: string;
  professor: string;
}

export interface RegistroFrequenciaDTO {
  id: string;
  alunoId: string;
  turmaId: string;
  data: string;
  presente: boolean;
}

export interface CreateRegistroFrequenciaDTO {
  alunoId: string;
  turmaId: string;
  data: string;
  presente: boolean;
}
