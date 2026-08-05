import type {
  Aluno,
  AlunoStatus,
  RegistroFrequencia,
  Responsavel,
  SessaoAula,
  Turma,
} from '@/types';
import {
  optionalString,
  parseBool,
  parseJsonArray,
  parseNumber,
  stringifyArray,
  stripUndefined,
  type Row,
} from './helpers';

export const alunoAdapter = {
  fromRow: (row: Row): Aluno => ({
    id: row.id,
    nome: row.nome ?? '',
    email: row.email ?? '',
    telefone: row.telefone ?? '',
    cpf: row.cpf ?? '',
    dataNascimento: row.data_nascimento ?? '',
    categoria: row.categoria ?? '',
    faixaAtual: row.faixa_atual ?? '',
    status: (row.status || 'ativo') as AlunoStatus,
    foto: optionalString(row.foto),
    responsavelId: optionalString(row.responsavel_id),
    turmaIds: parseJsonArray<string>(row.turma_ids),
    dataMatricula: row.data_matricula ?? '',
    observacoes: optionalString(row.observacoes),
  }),
  toRow: (aluno: Partial<Aluno>) => stripUndefined({
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    telefone: aluno.telefone,
    cpf: aluno.cpf,
    data_nascimento: aluno.dataNascimento,
    categoria: aluno.categoria,
    faixa_atual: aluno.faixaAtual,
    status: aluno.status,
    foto: aluno.foto,
    responsavel_id: aluno.responsavelId ?? '',
    turma_ids: aluno.turmaIds ? stringifyArray(aluno.turmaIds) : undefined,
    data_matricula: aluno.dataMatricula,
    observacoes: aluno.observacoes,
  }),
};

export const responsavelAdapter = {
  fromRow: (row: Row): Responsavel => ({
    id: row.id,
    nome: row.nome ?? '',
    email: row.email ?? '',
    telefone: row.telefone ?? '',
    cpf: row.cpf ?? '',
    alunoIds: parseJsonArray<string>(row.aluno_ids),
  }),
  toRow: (responsavel: Partial<Responsavel>) => stripUndefined({
    id: responsavel.id,
    nome: responsavel.nome,
    email: responsavel.email,
    telefone: responsavel.telefone,
    cpf: responsavel.cpf,
    aluno_ids: responsavel.alunoIds ? stringifyArray(responsavel.alunoIds) : undefined,
  }),
};

export const turmaAdapter = {
  fromRow: (row: Row): Turma => ({
    id: row.id,
    nome: row.nome ?? '',
    modalidade: row.modalidade ?? '',
    professor: row.professor ?? '',
    horario: row.horario ?? '',
    diasSemana: parseJsonArray<string>(row.dias_semana),
    capacidade: parseNumber(row.capacidade),
    alunoIds: parseJsonArray<string>(row.aluno_ids),
  }),
  toRow: (turma: Partial<Turma>) => stripUndefined({
    id: turma.id,
    nome: turma.nome,
    modalidade: turma.modalidade,
    professor: turma.professor,
    horario: turma.horario,
    dias_semana: turma.diasSemana ? stringifyArray(turma.diasSemana) : undefined,
    capacidade: turma.capacidade,
    aluno_ids: turma.alunoIds ? stringifyArray(turma.alunoIds) : undefined,
  }),
};

export const sessaoAulaAdapter = {
  fromRow: (row: Row): SessaoAula => ({
    id: row.id,
    turmaId: row.turma_id ?? '',
    data: row.data ?? '',
    professor: row.professor ?? '',
    presencas: parseJsonArray<unknown>(row.presencas).map((item) => {
      if (typeof item === 'string') return { alunoId: item, presente: true };
      const presence = item as { alunoId?: string; presente?: boolean };
      return { alunoId: presence.alunoId ?? '', presente: presence.presente ?? true };
    }),
  }),
  toRow: (sessao: Partial<SessaoAula>) => stripUndefined({
    id: sessao.id,
    turma_id: sessao.turmaId,
    data: sessao.data,
    professor: sessao.professor,
    presencas: sessao.presencas ? stringifyArray(sessao.presencas) : undefined,
  }),
};

export const frequenciaAdapter = {
  fromRow: (row: Row): RegistroFrequencia => ({
    id: row.id,
    alunoId: row.aluno_id ?? '',
    turmaId: row.turma_id ?? '',
    data: row.data ?? '',
    presente: parseBool(row.presente),
  }),
  toRow: (frequencia: Partial<RegistroFrequencia>) => stripUndefined({
    id: frequencia.id,
    aluno_id: frequencia.alunoId,
    turma_id: frequencia.turmaId,
    data: frequencia.data,
    presente: frequencia.presente === undefined ? undefined : String(frequencia.presente),
  }),
};
