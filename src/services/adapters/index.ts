import type {
  Aluno, Responsavel, Turma, SessaoAula, RegistroFrequencia,
  GraduacaoAluno, HistoricoGraduacao, RegraGraduacao,
  RankingEntry, Campeonato, ParticipanteCampeonato,
  Cobranca, Despesa, Receita, Produto, Venda,
  Reserva, ContratoAluguel, PagamentoContratoAluguel,
  FormaPagamento, AlunoStatus, GraduacaoStatus, CobrancaStatus,
} from '@/types';

type Row = Record<string, string>;

// ============= helpers =============

const parseJsonArray = <T>(raw: string | undefined, fallback: T[] = []): T[] => {
  if (!raw || raw.trim() === '') return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    // tolera listas legadas separadas por vírgula
    return raw.split(',').map(s => s.trim()).filter(Boolean) as unknown as T[];
  }
};

const stringifyArray = (v: unknown[] | undefined): string =>
  v && v.length ? JSON.stringify(v) : '';

const parseNumber = (raw: string | undefined, fallback = 0): number => {
  if (raw === undefined || raw === '') return fallback;
  const n = Number(String(raw).replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
};

const parseBool = (raw: string | undefined): boolean =>
  raw === 'true' || raw === '1' || raw === 'TRUE' || raw === 'sim';

const opt = (v: string | undefined): string | undefined =>
  v && v.trim() !== '' ? v : undefined;

const stripUndef = <T extends Record<string, unknown>>(o: T): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = v;
  return out;
};

// ============= Aluno =============

export const alunoAdapter = {
  fromRow: (r: Row): Aluno => ({
    id: r.id,
    nome: r.nome ?? '',
    email: r.email ?? '',
    telefone: r.telefone ?? '',
    cpf: r.cpf ?? '',
    dataNascimento: r.data_nascimento ?? '',
    categoria: r.categoria ?? '',
    faixaAtual: r.faixa_atual ?? '',
    status: (r.status || 'ativo') as AlunoStatus,
    foto: opt(r.foto),
    responsavelId: opt(r.responsavel_id),
    turmaIds: parseJsonArray<string>(r.turma_ids),
    dataMatricula: r.data_matricula ?? '',
    observacoes: opt(r.observacoes),
  }),
  toRow: (a: Partial<Aluno>): Record<string, unknown> => stripUndef({
    id: a.id,
    nome: a.nome,
    email: a.email,
    telefone: a.telefone,
    cpf: a.cpf,
    data_nascimento: a.dataNascimento,
    categoria: a.categoria,
    faixa_atual: a.faixaAtual,
    status: a.status,
    foto: a.foto,
    responsavel_id: a.responsavelId ?? '',
    turma_ids: a.turmaIds ? stringifyArray(a.turmaIds) : undefined,
    data_matricula: a.dataMatricula,
    observacoes: a.observacoes,
  }),
};

// ============= Responsavel =============

export const responsavelAdapter = {
  fromRow: (r: Row): Responsavel => ({
    id: r.id,
    nome: r.nome ?? '',
    email: r.email ?? '',
    telefone: r.telefone ?? '',
    cpf: r.cpf ?? '',
    alunoIds: parseJsonArray<string>(r.aluno_ids),
  }),
  toRow: (v: Partial<Responsavel>): Record<string, unknown> => stripUndef({
    id: v.id,
    nome: v.nome,
    email: v.email,
    telefone: v.telefone,
    cpf: v.cpf,
    aluno_ids: v.alunoIds ? stringifyArray(v.alunoIds) : undefined,
  }),
};

// ============= Turma =============

export const turmaAdapter = {
  fromRow: (r: Row): Turma => ({
    id: r.id,
    nome: r.nome ?? '',
    modalidade: r.modalidade ?? '',
    professor: r.professor ?? '',
    horario: r.horario ?? '',
    diasSemana: parseJsonArray<string>(r.dias_semana),
    capacidade: parseNumber(r.capacidade),
    alunoIds: parseJsonArray<string>(r.aluno_ids),
  }),
  toRow: (t: Partial<Turma>): Record<string, unknown> => stripUndef({
    id: t.id,
    nome: t.nome,
    modalidade: t.modalidade,
    professor: t.professor,
    horario: t.horario,
    dias_semana: t.diasSemana ? stringifyArray(t.diasSemana) : undefined,
    capacidade: t.capacidade,
    aluno_ids: t.alunoIds ? stringifyArray(t.alunoIds) : undefined,
  }),
};

// ============= SessaoAula =============

export const sessaoAulaAdapter = {
  fromRow: (r: Row): SessaoAula => ({
    id: r.id,
    turmaId: r.turma_id ?? '',
    data: r.data ?? '',
    professor: r.professor ?? '',
    presencas: parseJsonArray<{ alunoId: string; presente: boolean }>(r.presencas),
  }),
  toRow: (s: Partial<SessaoAula>): Record<string, unknown> => stripUndef({
    id: s.id,
    turma_id: s.turmaId,
    data: s.data,
    professor: s.professor,
    presencas: s.presencas ? stringifyArray(s.presencas) : undefined,
  }),
};

// ============= RegistroFrequencia =============

export const frequenciaAdapter = {
  fromRow: (r: Row): RegistroFrequencia => ({
    id: r.id,
    alunoId: r.aluno_id ?? '',
    turmaId: r.turma_id ?? '',
    data: r.data ?? '',
    presente: parseBool(r.presente),
  }),
  toRow: (f: Partial<RegistroFrequencia>): Record<string, unknown> => stripUndef({
    id: f.id,
    aluno_id: f.alunoId,
    turma_id: f.turmaId,
    data: f.data,
    presente: f.presente === undefined ? undefined : String(f.presente),
  }),
};

// ============= Graduacao (histórico) =============

export const historicoGraduacaoAdapter = {
  fromRow: (r: Row): HistoricoGraduacao => ({
    id: r.id,
    alunoId: r.aluno_id ?? '',
    faixaDe: r.faixa_de ?? '',
    faixaPara: r.faixa_para ?? '',
    data: r.data ?? '',
    aprovadoPor: r.aprovado_por ?? '',
  }),
  toRow: (h: Partial<HistoricoGraduacao>): Record<string, unknown> => stripUndef({
    id: h.id,
    aluno_id: h.alunoId,
    faixa_de: h.faixaDe,
    faixa_para: h.faixaPara,
    data: h.data,
    aprovado_por: h.aprovadoPor,
  }),
};

// ============= GraduacaoAluno (estado atual) =============

export const graduacaoAlunoAdapter = {
  fromRow: (r: Row): GraduacaoAluno => ({
    alunoId: r.aluno_id ?? '',
    faixaAtual: r.faixa_atual ?? '',
    proximaFaixa: r.proxima_faixa ?? '',
    aulasRealizadas: parseNumber(r.aulas_realizadas),
    aulasNecessarias: parseNumber(r.aulas_necessarias),
    status: (r.status || 'nao-elegivel') as GraduacaoStatus,
    dataUltimaGraduacao: opt(r.data_ultima_graduacao),
  }),
  toRow: (g: Partial<GraduacaoAluno> & { id?: string }): Record<string, unknown> => stripUndef({
    id: g.id,
    aluno_id: g.alunoId,
    faixa_atual: g.faixaAtual,
    proxima_faixa: g.proximaFaixa,
    aulas_realizadas: g.aulasRealizadas,
    aulas_necessarias: g.aulasNecessarias,
    status: g.status,
    data_ultima_graduacao: g.dataUltimaGraduacao,
  }),
};

// ============= RegraGraduacao =============

export const regraGraduacaoAdapter = {
  fromRow: (r: Row): RegraGraduacao => ({
    id: r.id,
    modalidade: opt(r.modalidade),
    faixaOrigem: r.faixa_origem ?? '',
    faixaDestino: r.faixa_destino ?? '',
    categoria: r.categoria ?? '',
    aulasMinimas: parseNumber(r.aulas_minimas),
    mesesMinimos: parseNumber(r.meses_minimos),
  }),
  toRow: (r: Partial<RegraGraduacao>): Record<string, unknown> => stripUndef({
    id: r.id,
    modalidade: r.modalidade,
    faixa_origem: r.faixaOrigem,
    faixa_destino: r.faixaDestino,
    categoria: r.categoria,
    aulas_minimas: r.aulasMinimas,
    meses_minimos: r.mesesMinimos,
  }),
};

// ============= Ranking =============

export const rankingAdapter = {
  fromRow: (r: Row): RankingEntry => ({
    alunoId: r.aluno_id ?? '',
    nomeAluno: r.nome_aluno ?? '',
    categoria: r.categoria ?? '',
    posicao: parseNumber(r.posicao),
    posicaoAnterior: parseNumber(r.posicao_anterior),
    pontuacao: parseNumber(r.pontuacao),
    vitorias: parseNumber(r.vitorias),
    medalhas: parseNumber(r.medalhas),
    temporada: r.temporada ?? '',
  }),
  toRow: (r: Partial<RankingEntry> & { id?: string }): Record<string, unknown> => stripUndef({
    id: r.id,
    aluno_id: r.alunoId,
    nome_aluno: r.nomeAluno,
    categoria: r.categoria,
    posicao: r.posicao,
    posicao_anterior: r.posicaoAnterior,
    pontuacao: r.pontuacao,
    vitorias: r.vitorias,
    medalhas: r.medalhas,
    temporada: r.temporada,
  }),
};

// ============= Campeonato =============

export const campeonatoAdapter = {
  fromRow: (r: Row): Campeonato => ({
    id: r.id,
    nome: r.nome ?? '',
    data: r.data ?? '',
    local: r.local ?? '',
    modalidade: r.modalidade ?? '',
    status: (r.status || 'planejado') as Campeonato['status'],
    participantes: parseJsonArray<ParticipanteCampeonato>(r.participantes),
  }),
  toRow: (c: Partial<Campeonato>): Record<string, unknown> => stripUndef({
    id: c.id,
    nome: c.nome,
    data: c.data,
    local: c.local,
    modalidade: c.modalidade,
    status: c.status,
    participantes: c.participantes ? stringifyArray(c.participantes) : undefined,
  }),
};

// ============= Cobranca (Financeiro) =============

export const cobrancaAdapter = {
  fromRow: (r: Row): Cobranca => ({
    id: r.id,
    alunoId: r.aluno_id ?? '',
    nomeAluno: r.nome_aluno ?? '',
    tipo: (r.tipo || 'mensalidade') as Cobranca['tipo'],
    descricao: r.descricao ?? '',
    valor: parseNumber(r.valor),
    valorPago: parseNumber(r.valor_pago),
    dataVencimento: r.data_vencimento ?? '',
    dataPagamento: opt(r.data_pagamento),
    status: (r.status || 'aberta') as CobrancaStatus,
    formaPagamento: opt(r.forma_pagamento) as FormaPagamento | undefined,
    observacoes: opt(r.observacoes),
    comprovanteId: opt(r.comprovante_id),
  }),
  toRow: (c: Partial<Cobranca>): Record<string, unknown> => stripUndef({
    id: c.id,
    aluno_id: c.alunoId,
    nome_aluno: c.nomeAluno,
    tipo: c.tipo,
    descricao: c.descricao,
    valor: c.valor,
    valor_pago: c.valorPago,
    data_vencimento: c.dataVencimento,
    data_pagamento: c.dataPagamento,
    status: c.status,
    forma_pagamento: c.formaPagamento,
    observacoes: c.observacoes,
    comprovante_id: c.comprovanteId,
  }),
};

// ============= Despesa =============

export const despesaAdapter = {
  fromRow: (r: Row): Despesa => ({
    id: r.id,
    descricao: r.descricao ?? '',
    categoria: r.categoria ?? '',
    valor: parseNumber(r.valor),
    data: r.data ?? '',
    status: (r.status || 'pendente') as Despesa['status'],
  }),
  toRow: (d: Partial<Despesa>): Record<string, unknown> => stripUndef({
    id: d.id,
    descricao: d.descricao,
    categoria: d.categoria,
    valor: d.valor,
    data: d.data,
    status: d.status,
  }),
};

// ============= Receita =============

export const receitaAdapter = {
  fromRow: (r: Row): Receita => ({
    id: r.id,
    descricao: r.descricao ?? '',
    categoria: r.categoria ?? '',
    valor: parseNumber(r.valor),
    data: r.data ?? '',
    origem: r.origem ?? '',
  }),
  toRow: (r: Partial<Receita>): Record<string, unknown> => stripUndef({
    id: r.id,
    descricao: r.descricao,
    categoria: r.categoria,
    valor: r.valor,
    data: r.data,
    origem: r.origem,
  }),
};

// ============= Produto =============

export const produtoAdapter = {
  fromRow: (r: Row): Produto => ({
    id: r.id,
    nome: r.nome ?? '',
    descricao: r.descricao ?? '',
    preco: parseNumber(r.preco),
    estoque: parseNumber(r.estoque),
    estoqueMinimo: parseNumber(r.estoque_minimo),
    categoria: r.categoria ?? '',
    imagem: opt(r.imagem),
  }),
  toRow: (p: Partial<Produto>): Record<string, unknown> => stripUndef({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    preco: p.preco,
    estoque: p.estoque,
    estoque_minimo: p.estoqueMinimo,
    categoria: p.categoria,
    imagem: p.imagem,
  }),
};

// ============= Venda =============

export const vendaAdapter = {
  fromRow: (r: Row): Venda => ({
    id: r.id,
    data: r.data ?? '',
    itens: parseJsonArray<Venda['itens'][number]>(r.itens),
    total: parseNumber(r.total),
    compradorNome: r.comprador_nome ?? '',
    formaPagamento: (r.forma_pagamento || 'PIX') as Venda['formaPagamento'],
    observacoes: opt(r.observacoes),
    parcelado: r.parcelado ? parseBool(r.parcelado) : undefined,
    quantidadeParcelas: r.quantidade_parcelas ? parseNumber(r.quantidade_parcelas) : undefined,
    comprovanteId: opt(r.comprovante_id),
  }),
  toRow: (v: Partial<Venda>): Record<string, unknown> => stripUndef({
    id: v.id,
    data: v.data,
    itens: v.itens ? stringifyArray(v.itens) : undefined,
    total: v.total,
    comprador_nome: v.compradorNome,
    forma_pagamento: v.formaPagamento,
    parcelado: v.parcelado === undefined ? undefined : String(v.parcelado),
    quantidade_parcelas: v.quantidadeParcelas,
    observacoes: v.observacoes,
    comprovante_id: v.comprovanteId,
  }),
};

// ============= Reserva =============

export const reservaAdapter = {
  fromRow: (r: Row): Reserva => ({
    id: r.id,
    espaco: r.espaco ?? '',
    locatario: r.locatario ?? '',
    dataInicio: r.data_inicio ?? '',
    dataFim: r.data_fim ?? '',
    horaInicio: r.hora_inicio ?? '',
    horaFim: r.hora_fim ?? '',
    valor: parseNumber(r.valor),
    status: (r.status || 'pendente') as Reserva['status'],
  }),
  toRow: (r: Partial<Reserva>): Record<string, unknown> => stripUndef({
    id: r.id,
    espaco: r.espaco,
    locatario: r.locatario,
    data_inicio: r.dataInicio,
    data_fim: r.dataFim,
    hora_inicio: r.horaInicio,
    hora_fim: r.horaFim,
    valor: r.valor,
    status: r.status,
  }),
};

// ============= ContratoAluguel =============

export const contratoAluguelAdapter = {
  fromRow: (r: Row): ContratoAluguel => ({
    id: r.id,
    locatario: r.locatario ?? '',
    espaco: r.espaco ?? '',
    valor: parseNumber(r.valor),
    periodicidade: (r.periodicidade || 'mensal') as ContratoAluguel['periodicidade'],
    dataInicio: r.data_inicio ?? '',
    dataFim: r.data_fim ?? '',
    status: (r.status || 'ativo') as ContratoAluguel['status'],
  }),
  toRow: (c: Partial<ContratoAluguel>): Record<string, unknown> => stripUndef({
    id: c.id,
    locatario: c.locatario,
    espaco: c.espaco,
    valor: c.valor,
    periodicidade: c.periodicidade,
    data_inicio: c.dataInicio,
    data_fim: c.dataFim,
    status: c.status,
  }),
};

// ============= PagamentoContratoAluguel =============

export const pagamentoContratoAdapter = {
  fromRow: (r: Row): PagamentoContratoAluguel => ({
    id: r.id,
    contratoId: r.contrato_id ?? '',
    dataPagamento: r.data_pagamento ?? '',
    valor: parseNumber(r.valor),
    formaPagamento: (r.forma_pagamento || 'PIX') as PagamentoContratoAluguel['formaPagamento'],
    referencia: opt(r.referencia),
    observacoes: opt(r.observacoes),
    comprovanteId: opt(r.comprovante_id),
  }),
  toRow: (p: Partial<PagamentoContratoAluguel>): Record<string, unknown> => stripUndef({
    id: p.id,
    contrato_id: p.contratoId,
    data_pagamento: p.dataPagamento,
    valor: p.valor,
    forma_pagamento: p.formaPagamento,
    referencia: p.referencia,
    observacoes: p.observacoes,
    comprovante_id: p.comprovanteId,
  }),
};
