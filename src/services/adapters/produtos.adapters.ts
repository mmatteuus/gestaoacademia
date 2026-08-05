import type { Produto, Venda } from '@/types';
import {
  optionalString,
  parseBool,
  parseFormaPagamento,
  parseJsonArray,
  parseNumber,
  stringifyArray,
  stripUndefined,
  type Row,
} from './helpers';

export const produtoAdapter = {
  fromRow: (row: Row): Produto => ({
    id: row.id,
    nome: row.nome ?? '',
    descricao: row.descricao ?? '',
    preco: parseNumber(row.preco),
    estoque: parseNumber(row.estoque),
    estoqueMinimo: parseNumber(row.estoque_minimo),
    categoria: row.categoria ?? '',
    imagem: optionalString(row.imagem),
  }),
  toRow: (produto: Partial<Produto>) => stripUndefined({
    id: produto.id,
    nome: produto.nome,
    descricao: produto.descricao,
    preco: produto.preco,
    estoque: produto.estoque,
    estoque_minimo: produto.estoqueMinimo,
    categoria: produto.categoria,
    imagem: produto.imagem,
  }),
};

export const vendaAdapter = {
  fromRow: (row: Row): Venda => ({
    id: row.id,
    data: row.data ?? '',
    itens: parseJsonArray<Venda['itens'][number]>(row.itens),
    total: parseNumber(row.total),
    compradorNome: row.comprador_nome ?? '',
    formaPagamento: parseFormaPagamento(row.forma_pagamento) as Venda['formaPagamento'] || 'PIX',
    observacoes: optionalString(row.observacoes),
    parcelado: row.parcelado ? parseBool(row.parcelado) : undefined,
    quantidadeParcelas: row.quantidade_parcelas
      ? parseNumber(row.quantidade_parcelas)
      : undefined,
    comprovanteId: optionalString(row.comprovante_id),
  }),
  toRow: (venda: Partial<Venda>) => stripUndefined({
    id: venda.id,
    data: venda.data,
    itens: venda.itens ? stringifyArray(venda.itens) : undefined,
    total: venda.total,
    comprador_nome: venda.compradorNome,
    forma_pagamento: parseFormaPagamento(venda.formaPagamento) || venda.formaPagamento,
    parcelado: venda.parcelado === undefined ? undefined : String(venda.parcelado),
    quantidade_parcelas: venda.quantidadeParcelas,
    observacoes: venda.observacoes,
    comprovante_id: venda.comprovanteId,
  }),
};
