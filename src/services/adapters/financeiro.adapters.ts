import type {
  Cobranca,
  CobrancaStatus,
  Despesa,
  Receita,
} from '@/types';
import {
  optionalString,
  parseFormaPagamento,
  parseNumber,
  stripUndefined,
  type Row,
} from './helpers';

export const cobrancaAdapter = {
  fromRow: (row: Row): Cobranca => ({
    id: row.id,
    alunoId: row.aluno_id ?? '',
    nomeAluno: row.nome_aluno ?? '',
    tipo: (row.tipo || 'mensalidade') as Cobranca['tipo'],
    descricao: row.descricao ?? '',
    valor: parseNumber(row.valor),
    valorPago: parseNumber(row.valor_pago),
    dataVencimento: row.data_vencimento ?? '',
    dataPagamento: optionalString(row.data_pagamento),
    status: (row.status || 'aberta') as CobrancaStatus,
    formaPagamento: parseFormaPagamento(row.forma_pagamento),
    observacoes: optionalString(row.observacoes),
    comprovanteId: optionalString(row.comprovante_id),
  }),
  toRow: (cobranca: Partial<Cobranca>) => stripUndefined({
    id: cobranca.id,
    aluno_id: cobranca.alunoId,
    nome_aluno: cobranca.nomeAluno,
    tipo: cobranca.tipo,
    descricao: cobranca.descricao,
    valor: cobranca.valor,
    valor_pago: cobranca.valorPago,
    data_vencimento: cobranca.dataVencimento,
    data_pagamento: cobranca.dataPagamento,
    status: cobranca.status,
    forma_pagamento: parseFormaPagamento(cobranca.formaPagamento) || cobranca.formaPagamento,
    observacoes: cobranca.observacoes,
    comprovante_id: cobranca.comprovanteId,
  }),
};

export const despesaAdapter = {
  fromRow: (row: Row): Despesa => ({
    id: row.id,
    descricao: row.descricao ?? '',
    categoria: row.categoria ?? '',
    valor: parseNumber(row.valor),
    data: row.data ?? '',
    status: (row.status || 'pendente') as Despesa['status'],
  }),
  toRow: (despesa: Partial<Despesa>) => stripUndefined({
    id: despesa.id,
    descricao: despesa.descricao,
    categoria: despesa.categoria,
    valor: despesa.valor,
    data: despesa.data,
    status: despesa.status,
  }),
};

export const receitaAdapter = {
  fromRow: (row: Row): Receita => ({
    id: row.id,
    descricao: row.descricao ?? '',
    categoria: row.categoria ?? '',
    valor: parseNumber(row.valor),
    data: row.data ?? '',
    origem: row.origem ?? '',
  }),
  toRow: (receita: Partial<Receita>) => stripUndefined({
    id: receita.id,
    descricao: receita.descricao,
    categoria: receita.categoria,
    valor: receita.valor,
    data: receita.data,
    origem: receita.origem,
  }),
};
