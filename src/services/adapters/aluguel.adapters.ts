import type {
  ContratoAluguel,
  PagamentoContratoAluguel,
  Reserva,
} from '@/types';
import {
  optionalString,
  parseFormaPagamento,
  parseNumber,
  stripUndefined,
  type Row,
} from './helpers';

export const reservaAdapter = {
  fromRow: (row: Row): Reserva => ({
    id: row.id,
    espaco: row.espaco ?? '',
    locatario: row.locatario ?? '',
    dataInicio: row.data_inicio ?? '',
    dataFim: row.data_fim ?? '',
    horaInicio: row.hora_inicio ?? '',
    horaFim: row.hora_fim ?? '',
    valor: parseNumber(row.valor),
    status: (row.status || 'pendente') as Reserva['status'],
  }),
  toRow: (reserva: Partial<Reserva>) => stripUndefined({
    id: reserva.id,
    espaco: reserva.espaco,
    locatario: reserva.locatario,
    data_inicio: reserva.dataInicio,
    data_fim: reserva.dataFim,
    hora_inicio: reserva.horaInicio,
    hora_fim: reserva.horaFim,
    valor: reserva.valor,
    status: reserva.status,
  }),
};

export const contratoAluguelAdapter = {
  fromRow: (row: Row): ContratoAluguel => ({
    id: row.id,
    locatario: row.locatario ?? '',
    espaco: row.espaco ?? '',
    valor: parseNumber(row.valor),
    periodicidade: (row.periodicidade || 'mensal') as ContratoAluguel['periodicidade'],
    dataInicio: row.data_inicio ?? '',
    dataFim: row.data_fim ?? '',
    status: (row.status || 'ativo') as ContratoAluguel['status'],
  }),
  toRow: (contrato: Partial<ContratoAluguel>) => stripUndefined({
    id: contrato.id,
    locatario: contrato.locatario,
    espaco: contrato.espaco,
    valor: contrato.valor,
    periodicidade: contrato.periodicidade,
    data_inicio: contrato.dataInicio,
    data_fim: contrato.dataFim,
    status: contrato.status,
  }),
};

export const pagamentoContratoAdapter = {
  fromRow: (row: Row): PagamentoContratoAluguel => ({
    id: row.id,
    contratoId: row.contrato_id ?? '',
    dataPagamento: row.data_pagamento ?? '',
    valor: parseNumber(row.valor),
    formaPagamento: parseFormaPagamento(row.forma_pagamento) as PagamentoContratoAluguel['formaPagamento'] || 'PIX',
    referencia: optionalString(row.referencia),
    observacoes: optionalString(row.observacoes),
    comprovanteId: optionalString(row.comprovante_id),
  }),
  toRow: (pagamento: Partial<PagamentoContratoAluguel>) => stripUndefined({
    id: pagamento.id,
    contrato_id: pagamento.contratoId,
    data_pagamento: pagamento.dataPagamento,
    valor: pagamento.valor,
    forma_pagamento: parseFormaPagamento(pagamento.formaPagamento) || pagamento.formaPagamento,
    referencia: pagamento.referencia,
    observacoes: pagamento.observacoes,
    comprovante_id: pagamento.comprovanteId,
  }),
};
