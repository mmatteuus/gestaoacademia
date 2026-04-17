const BASE_URL = process.env.SEED_BASE_URL || 'https://gemeosacademia.mtsferreira.dev';
const now = new Date();
const stamp = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const today = now.toISOString().slice(0, 10);

const ids = {
  responsavel: `resp_${stamp}`,
  aluno1: `aluno_${stamp}_1`,
  aluno2: `aluno_${stamp}_2`,
  turma: `turma_${stamp}`,
  aula: `aula_${stamp}`,
  frequencia: `freq_${stamp}`,
  regra: `regra_${stamp}`,
  gradAluno1: `gradaluno_${stamp}_1`,
  gradAluno2: `gradaluno_${stamp}_2`,
  graduacaoHist: `gradhist_${stamp}`,
  ranking1: `ranking_${stamp}_1`,
  ranking2: `ranking_${stamp}_2`,
  campeonato: `camp_${stamp}`,
  medalha: `med_${stamp}`,
  cobranca1: `cobr_${stamp}_1`,
  cobranca2: `cobr_${stamp}_2`,
  despesa: `desp_${stamp}`,
  receita: `rec_${stamp}`,
  produto1: `prod_${stamp}_1`,
  produto2: `prod_${stamp}_2`,
  venda: `venda_${stamp}`,
  reserva: `res_${stamp}`,
  contrato: `cont_${stamp}`,
  pagamentoContrato: `pagcont_${stamp}`,
  professor: `prof_${stamp}`,
};

async function postRow(sheetType, data) {
  const res = await fetch(`${BASE_URL}/rows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, sheet_type: sheetType }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /rows failed for ${sheetType}: ${res.status} ${text}`);
  }
}

async function getRows(type) {
  const res = await fetch(`${BASE_URL}/rows?type=${encodeURIComponent(type)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET /rows failed for ${type}: ${res.status} ${text}`);
  }
  return res.json();
}

async function run() {
  console.log(`Seeding all pages on ${BASE_URL} (batch ${stamp})`);

  await postRow('Responsaveis', {
    id: ids.responsavel,
    nome: 'Responsavel Seed',
    email: `responsavel.${stamp}@example.com`,
    telefone: '62999990001',
    cpf: '11111111111',
    aluno_ids: JSON.stringify([ids.aluno1]),
    observacoes: 'Seed completo',
  });

  await postRow('Alunos', {
    id: ids.aluno1,
    nome: 'Aluno Seed Um',
    email: `aluno1.${stamp}@example.com`,
    telefone: '62999990002',
    cpf: '22222222222',
    data_nascimento: '2008-05-10',
    categoria: 'Juvenil',
    faixa_atual: 'Amarela',
    status: 'ativo',
    plano: 'mensal',
    data_matricula: today,
    responsavel_id: ids.responsavel,
    turma_ids: JSON.stringify([ids.turma]),
    observacoes: 'Aluno vinculado a responsavel/turma',
  });

  await postRow('Alunos', {
    id: ids.aluno2,
    nome: 'Aluno Seed Dois',
    email: `aluno2.${stamp}@example.com`,
    telefone: '62999990003',
    cpf: '33333333333',
    data_nascimento: '1999-01-20',
    categoria: 'Adulto',
    faixa_atual: 'Branca',
    status: 'inadimplente',
    plano: 'trimestral',
    data_matricula: today,
    turma_ids: JSON.stringify([ids.turma]),
    observacoes: 'Aluno para financeiro/ranking',
  });

  await postRow('Professores', {
    id: ids.professor,
    nome: 'Professor Seed',
    cpf: '44444444444',
    telefone: '62999990004',
    email: `prof.${stamp}@example.com`,
    especialidade: 'Jiu-Jitsu',
    valor_hora: '120',
    status: 'ativo',
  });

  await postRow('Turmas', {
    id: ids.turma,
    nome: 'Turma Seed Noite',
    modalidade: 'Jiu-Jitsu',
    professor: 'Professor Seed',
    horario: '19:00',
    dias_semana: JSON.stringify(['Seg', 'Qua', 'Sex']),
    capacidade: '30',
    aluno_ids: JSON.stringify([ids.aluno1, ids.aluno2]),
    status: 'ativa',
  });

  await postRow('Aulas', {
    id: ids.aula,
    turma_id: ids.turma,
    data: today,
    professor: 'Professor Seed',
    presencas: JSON.stringify([
      { alunoId: ids.aluno1, presente: true },
      { alunoId: ids.aluno2, presente: false },
    ]),
    observacoes: 'Aula seed',
  });

  await postRow('Frequencia', {
    id: ids.frequencia,
    aluno_id: ids.aluno1,
    turma_id: ids.turma,
    aula_id: ids.aula,
    data: today,
    presente: 'true',
    horario_chegada: '18:55',
    observacoes: 'Chegou no horario',
  });

  await postRow('RegrasGraduacao', {
    id: ids.regra,
    modalidade: 'Jiu-Jitsu',
    faixa_origem: 'Amarela',
    faixa_destino: 'Laranja',
    categoria: 'Juvenil',
    aulas_minimas: '20',
    meses_minimos: '4',
  });

  await postRow('GraduacoesAlunos', {
    id: ids.gradAluno1,
    aluno_id: ids.aluno1,
    faixa_atual: 'Amarela',
    proxima_faixa: 'Laranja',
    aulas_realizadas: '12',
    aulas_necessarias: '20',
    status: 'elegivel',
    data_ultima_graduacao: '2025-12-10',
  });

  await postRow('GraduacoesAlunos', {
    id: ids.gradAluno2,
    aluno_id: ids.aluno2,
    faixa_atual: 'Branca',
    proxima_faixa: 'Amarela',
    aulas_realizadas: '3',
    aulas_necessarias: '18',
    status: 'nao-elegivel',
    data_ultima_graduacao: '2025-09-10',
  });

  await postRow('Graduacao', {
    id: ids.graduacaoHist,
    aluno_id: ids.aluno1,
    faixa_de: 'Branca',
    faixa_para: 'Amarela',
    data: '2025-12-10',
    aprovado_por: 'Professor Seed',
    observacoes: 'Historico seed',
  });

  await postRow('Ranking', {
    id: ids.ranking1,
    aluno_id: ids.aluno1,
    nome_aluno: 'Aluno Seed Um',
    categoria: 'Juvenil',
    posicao: '2',
    posicao_anterior: '3',
    pontuacao: '820',
    vitorias: '11',
    medalhas: '2',
    temporada: '2026',
    data_referencia: today,
  });

  await postRow('Ranking', {
    id: ids.ranking2,
    aluno_id: ids.aluno2,
    nome_aluno: 'Aluno Seed Dois',
    categoria: 'Adulto',
    posicao: '5',
    posicao_anterior: '6',
    pontuacao: '640',
    vitorias: '7',
    medalhas: '1',
    temporada: '2026',
    data_referencia: today,
  });

  await postRow('Campeonatos', {
    id: ids.campeonato,
    nome: 'Copa Seed',
    data: today,
    local: 'Ginasio Central',
    modalidade: 'Jiu-Jitsu',
    status: 'inscricoes-abertas',
    participantes: JSON.stringify([
      { alunoId: ids.aluno1, nomeAluno: 'Aluno Seed Um', categoria: 'Juvenil', pontuacao: 20 },
      { alunoId: ids.aluno2, nomeAluno: 'Aluno Seed Dois', categoria: 'Adulto', pontuacao: 10 },
    ]),
    custo_inscricao: '90',
  });

  await postRow('Medalhas', {
    id: ids.medalha,
    aluno_id: ids.aluno1,
    campeonato_id: ids.campeonato,
    tipo_medalha: 'ouro',
    categoria: 'Juvenil Leve',
    data_conquista: today,
  });

  await postRow('Financeiro', {
    id: ids.cobranca1,
    aluno_id: ids.aluno1,
    nome_aluno: 'Aluno Seed Um',
    tipo: 'mensalidade',
    descricao: 'Mensalidade Seed',
    valor: '180',
    valor_pago: '180',
    data_vencimento: today,
    data_pagamento: today,
    status: 'paga',
    forma_pagamento: 'PIX',
    observacoes: 'Pago no prazo',
  });

  await postRow('Financeiro', {
    id: ids.cobranca2,
    aluno_id: ids.aluno2,
    nome_aluno: 'Aluno Seed Dois',
    tipo: 'mensalidade',
    descricao: 'Mensalidade Seed Atrasada',
    valor: '180',
    valor_pago: '0',
    data_vencimento: '2026-01-10',
    status: 'vencida',
    observacoes: 'Inadimplente',
  });

  await postRow('Despesas', {
    id: ids.despesa,
    descricao: 'Compra de tatame',
    categoria: 'Infraestrutura',
    valor: '950',
    data: today,
    status: 'paga',
    observacoes: 'Despesa seed',
  });

  await postRow('Receitas', {
    id: ids.receita,
    descricao: 'Receita mensalidades',
    categoria: 'Mensalidades',
    valor: '3200',
    data: today,
    origem: 'Alunos',
    observacoes: 'Receita seed',
  });

  await postRow('Produtos', {
    id: ids.produto1,
    nome: 'Kimono Seed',
    descricao: 'Kimono oficial',
    sku: `SKU-${stamp}-1`,
    preco: '250',
    preco_custo: '170',
    estoque: '20',
    estoque_minimo: '5',
    categoria: 'Uniformes',
  });

  await postRow('Produtos', {
    id: ids.produto2,
    nome: 'Faixa Seed',
    descricao: 'Faixa graduacao',
    sku: `SKU-${stamp}-2`,
    preco: '45',
    preco_custo: '20',
    estoque: '40',
    estoque_minimo: '10',
    categoria: 'Acessorios',
  });

  await postRow('Vendas', {
    id: ids.venda,
    data: today,
    comprador_nome: 'Aluno Seed Um',
    aluno_id: ids.aluno1,
    itens: JSON.stringify([
      { produtoId: ids.produto1, nomeProduto: 'Kimono Seed', quantidade: 1, precoUnitario: 250 },
      { produtoId: ids.produto2, nomeProduto: 'Faixa Seed', quantidade: 1, precoUnitario: 45 },
    ]),
    total: '295',
    forma_pagamento: 'PIX',
    parcelado: 'false',
    quantidade_parcelas: '1',
    observacoes: 'Venda seed',
  });

  await postRow('Reservas', {
    id: ids.reserva,
    espaco: 'Dojo Principal',
    locatario: 'Evento Seed',
    data_inicio: today,
    data_fim: today,
    hora_inicio: '14:00',
    hora_fim: '18:00',
    valor: '600',
    status: 'confirmada',
    observacoes: 'Reserva seed',
  });

  await postRow('Aluguel', {
    id: ids.contrato,
    locatario: 'Empresa Seed',
    espaco: 'Dojo Principal',
    valor: '2500',
    periodicidade: 'mensal',
    data_inicio: '2026-04-01',
    data_fim: '2026-12-31',
    status: 'ativo',
    observacoes: 'Contrato de aluguel seed',
  });

  await postRow('PagamentosContrato', {
    id: ids.pagamentoContrato,
    contrato_id: ids.contrato,
    data_pagamento: today,
    valor: '2500',
    forma_pagamento: 'PIX',
    referencia: 'Abr/2026',
    observacoes: 'Pagamento seed',
  });

  const verifyTypes = [
    'Alunos', 'Responsaveis', 'Turmas', 'Aulas', 'Frequencia',
    'Graduacao', 'GraduacoesAlunos', 'RegrasGraduacao', 'Ranking', 'Campeonatos',
    'Medalhas', 'Financeiro', 'Despesas', 'Receitas', 'Produtos',
    'Vendas', 'Reservas', 'Aluguel', 'PagamentosContrato', 'Professores',
  ];

  console.log('Verification snapshot:');
  for (const type of verifyTypes) {
    const rows = await getRows(type);
    console.log(`${type}: ${Array.isArray(rows) ? rows.length : 0}`);
  }

  console.log(`Seed completed. Batch: ${stamp}`);
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});