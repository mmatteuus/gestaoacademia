import type {
  Aluno,
  Cobranca,
  GraduacaoAluno,
  Responsavel,
  SessaoAula,
  Turma,
} from '@/types';

export interface ActionResult<T = undefined> {
  ok: boolean;
  message?: string;
  data?: T;
}

export interface AcademiaDataContextValue {
  alunosList: Aluno[];
  turmasList: Turma[];
  sessoesList: SessaoAula[];
  cobrancasList: Cobranca[];
  graduacoesAlunosList: GraduacaoAluno[];
  responsaveisList: Responsavel[];
  isLoading: boolean;
  addAluno: (aluno: Aluno) => Promise<ActionResult>;
  updateAluno: (aluno: Aluno) => Promise<ActionResult>;
  addTurma: (turma: Turma) => Promise<ActionResult>;
  updateTurma: (turma: Turma) => Promise<ActionResult>;
  addAlunoToTurma: (alunoId: string, turmaId: string) => ActionResult;
  removeAlunoFromTurma: (alunoId: string, turmaId: string) => ActionResult;
  addSessao: (sessao: SessaoAula) => Promise<ActionResult>;
  syncMensalidadesParaTodos: () => ActionResult<{ created: number }>;
  syncGraduacoesParaTodos: () => ActionResult<{ created: number }>;
}
