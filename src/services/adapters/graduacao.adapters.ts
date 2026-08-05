import type {
  Campeonato,
  GraduacaoAluno,
  GraduacaoStatus,
  HistoricoGraduacao,
  ParticipanteCampeonato,
  RankingEntry,
  RegraGraduacao,
} from '@/types';
import {
  optionalString,
  parseJsonArray,
  parseNumber,
  stringifyArray,
  stripUndefined,
  type Row,
} from './helpers';

export const historicoGraduacaoAdapter = {
  fromRow: (row: Row): HistoricoGraduacao => ({
    id: row.id,
    alunoId: row.aluno_id ?? '',
    faixaDe: row.faixa_de ?? '',
    faixaPara: row.faixa_para ?? '',
    data: row.data ?? '',
    aprovadoPor: row.aprovado_por ?? '',
  }),
  toRow: (historico: Partial<HistoricoGraduacao>) => stripUndefined({
    id: historico.id,
    aluno_id: historico.alunoId,
    faixa_de: historico.faixaDe,
    faixa_para: historico.faixaPara,
    data: historico.data,
    aprovado_por: historico.aprovadoPor,
  }),
};

export const graduacaoAlunoAdapter = {
  fromRow: (row: Row): GraduacaoAluno => ({
    id: row.id,
    alunoId: row.aluno_id ?? '',
    faixaAtual: row.faixa_atual ?? '',
    proximaFaixa: row.proxima_faixa ?? '',
    aulasRealizadas: parseNumber(row.aulas_realizadas),
    aulasNecessarias: parseNumber(row.aulas_necessarias),
    status: (row.status || 'nao-elegivel') as GraduacaoStatus,
    dataUltimaGraduacao: optionalString(row.data_ultima_graduacao),
  }),
  toRow: (graduacao: Partial<GraduacaoAluno> & { id?: string }) => stripUndefined({
    id: graduacao.id,
    aluno_id: graduacao.alunoId,
    faixa_atual: graduacao.faixaAtual,
    proxima_faixa: graduacao.proximaFaixa,
    aulas_realizadas: graduacao.aulasRealizadas,
    aulas_necessarias: graduacao.aulasNecessarias,
    status: graduacao.status,
    data_ultima_graduacao: graduacao.dataUltimaGraduacao,
  }),
};

export const regraGraduacaoAdapter = {
  fromRow: (row: Row): RegraGraduacao => ({
    id: row.id,
    modalidade: optionalString(row.modalidade),
    faixaOrigem: row.faixa_origem ?? '',
    faixaDestino: row.faixa_destino ?? '',
    categoria: row.categoria ?? '',
    aulasMinimas: parseNumber(row.aulas_minimas),
    mesesMinimos: parseNumber(row.meses_minimos),
  }),
  toRow: (regra: Partial<RegraGraduacao>) => stripUndefined({
    id: regra.id,
    modalidade: regra.modalidade,
    faixa_origem: regra.faixaOrigem,
    faixa_destino: regra.faixaDestino,
    categoria: regra.categoria,
    aulas_minimas: regra.aulasMinimas,
    meses_minimos: regra.mesesMinimos,
  }),
};

export const rankingAdapter = {
  fromRow: (row: Row): RankingEntry => ({
    alunoId: row.aluno_id ?? '',
    nomeAluno: row.nome_aluno ?? '',
    categoria: row.categoria ?? '',
    posicao: parseNumber(row.posicao),
    posicaoAnterior: parseNumber(row.posicao_anterior),
    pontuacao: parseNumber(row.pontuacao),
    vitorias: parseNumber(row.vitorias),
    medalhas: parseNumber(row.medalhas),
    temporada: row.temporada ?? '',
  }),
  toRow: (ranking: Partial<RankingEntry> & { id?: string }) => stripUndefined({
    id: ranking.id,
    aluno_id: ranking.alunoId,
    nome_aluno: ranking.nomeAluno,
    categoria: ranking.categoria,
    posicao: ranking.posicao,
    posicao_anterior: ranking.posicaoAnterior,
    pontuacao: ranking.pontuacao,
    vitorias: ranking.vitorias,
    medalhas: ranking.medalhas,
    temporada: ranking.temporada,
  }),
};

export const campeonatoAdapter = {
  fromRow: (row: Row): Campeonato => ({
    id: row.id,
    nome: row.nome ?? '',
    data: row.data ?? '',
    local: row.local ?? '',
    modalidade: row.modalidade ?? '',
    status: (row.status || 'planejado') as Campeonato['status'],
    participantes: parseJsonArray<unknown>(row.participantes).map((item) => {
      if (typeof item === 'string') {
        return { alunoId: item, nomeAluno: '', categoria: 'Adulto' } as ParticipanteCampeonato;
      }
      return item as ParticipanteCampeonato;
    }),
  }),
  toRow: (campeonato: Partial<Campeonato>) => stripUndefined({
    id: campeonato.id,
    nome: campeonato.nome,
    data: campeonato.data,
    local: campeonato.local,
    modalidade: campeonato.modalidade,
    status: campeonato.status,
    participantes: campeonato.participantes
      ? stringifyArray(campeonato.participantes)
      : undefined,
  }),
};
