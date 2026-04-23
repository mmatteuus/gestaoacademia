/**
 * Seed-demo: insere 1 dado-exemplo em cada entidade SE não existir já.
 * Usa o prefixo `demo_` para identificar. Rode com: `node scripts/seed-demo.mjs`.
 *
 * O objetivo é que o usuário sempre tenha 1 referência visual de como cada
 * entidade fica preenchida, sem poluir a base.
 */
import { listRows, insertRow } from '../backend/src/repositories/sheets.repository.js';

const TODAY = new Date().toISOString().slice(0, 10);
const ALUNO_ID = 'demo_aluno';
const TURMA_ID = 'demo_turma';
const PROD_ID = 'demo_produto';

let created = 0, skipped = 0;

async function ensure(type, id, payload) {
  try {
    const rows = await listRows(type);
    if (rows.some((r) => r.id === id)) {
      console.log(`  · ${type}/${id} já existe — pulando`);
      skipped++;
      return;
    }
    await insertRow({ ...payload, sheet_type: type, id });
    console.log(`  ✓ ${type}/${id} criado`);
    created++;
  } catch (err) {
    console.error(`  ✗ ${type}/${id} falhou:`, err?.message || err);
  }
}

(async () => {
  console.log('=== Seed-demo (1 exemplo por entidade) ===\n');

  await ensure('Alunos', ALUNO_ID, {
    nome: 'Aluno Exemplo',
    email: 'exemplo@academia.com',
    telefone: '(11) 90000-0000',
    cpf: '000.000.000-00',
    data_nascimento: '2000-01-01',
    categoria: 'Adulto',
    faixa_atual: 'Branca',
    status: 'ativo',
    plano: 'mensal',
    data_matricula: TODAY,
    turma_ids: TURMA_ID,
    observacoes: 'Aluno de exemplo — pode ser editado ou removido livremente.',
  });

  await ensure('Responsaveis', 'demo_responsavel', {
    nome: 'Responsável Exemplo',
    email: 'responsavel@academia.com',
    telefone: '(11) 91111-1111',
    cpf: '111.111.111-11',
    aluno_ids: ALUNO_ID,
    observacoes: 'Responsável de exemplo.',
  });

  await ensure('Turmas', TURMA_ID, {
    nome: 'Turma Exemplo',
    modalidade: 'Jiu-Jitsu',
    professor: 'Professor Exemplo',
    horario: '19:00 - 20:30',
    dias_semana: 'Seg,Qua,Sex',
    capacidade: 15,
    aluno_ids: ALUNO_ID,
    status: 'ativa',
  });

  await ensure('Aulas', 'demo_aula', {
    turma_id: TURMA_ID,
    data: TODAY,
    professor: 'Professor Exemplo',
    presencas: JSON.stringify([{ alunoId: ALUNO_ID, presente: true }]),
    observacoes: 'Aula de exemplo.',
  });

  await ensure('Frequencia', 'demo_frequencia', {
    aluno_id: ALUNO_ID,
    turma_id: TURMA_ID,
    aula_id: 'demo_aula',
    data: TODAY,
    presente: 'true',
    horario_chegada: '19:00',
  });

  await ensure('Graduacao', 'demo_graduacao', {
    aluno_id: ALUNO_ID,
    faixa_de: 'Branca',
    faixa_para: 'Amarela',
    data: TODAY,
    aprovado_por: 'Professor Exemplo',
    observacoes: 'Graduação de exemplo.',
  });

  await ensure('GraduacoesAlunos', 'demo_grad_aluno', {
    aluno_id: ALUNO_ID,
    faixa_atual: 'Branca',
    proxima_faixa: 'Amarela',
    aulas_realizadas: 5,
    aulas_necessarias: 20,
    status: 'em-progresso',
    data_ultima_graduacao: TODAY,
  });

  await ensure('RegrasGraduacao', 'demo_regra', {
    modalidade: 'Jiu-Jitsu',
    faixa_origem: 'Branca',
    faixa_destino: 'Amarela',
    categoria: 'Adulto',
    aulas_minimas: 20,
    meses_minimos: 6,
  });

  await ensure('Ranking', 'demo_ranking', {
    aluno_id: ALUNO_ID,
    nome_aluno: 'Aluno Exemplo',
    categoria: 'Adulto',
    posicao: 1,
    posicao_anterior: 1,
    pontuacao: 100,
    vitorias: 1,
    medalhas: 1,
    temporada: String(new Date().getFullYear()),
    data_referencia: TODAY,
  });

  await ensure('Campeonatos', 'demo_campeonato', {
    nome: 'Campeonato Exemplo',
    data: TODAY,
    local: 'Ginásio Exemplo',
    modalidade: 'Jiu-Jitsu',
    status: 'inscricoes-abertas',
    participantes: JSON.stringify([{ alunoId: ALUNO_ID, nomeAluno: 'Aluno Exemplo', categoria: 'Adulto' }]),
    custo_inscricao: 50,
  });

  await ensure('Medalhas', 'demo_medalha', {
    aluno_id: ALUNO_ID,
    campeonato_id: 'demo_campeonato',
    tipo_medalha: 'ouro',
    categoria: 'Adulto',
    data_conquista: TODAY,
  });

  await ensure('Financeiro', 'demo_cobranca', {
    aluno_id: ALUNO_ID,
    nome_aluno: 'Aluno Exemplo',
    tipo: 'mensalidade',
    descricao: 'Mensalidade exemplo',
    valor: 200,
    valor_pago: 200,
    data_vencimento: TODAY,
    data_pagamento: TODAY,
    status: 'paga',
    forma_pagamento: 'PIX',
    observacoes: 'Cobrança paga de exemplo.',
  });

  await ensure('Despesas', 'demo_despesa', {
    descricao: 'Despesa exemplo (aluguel)',
    categoria: 'aluguel',
    valor: 1500,
    data: TODAY,
    status: 'paga',
  });

  await ensure('Receitas', 'demo_receita', {
    descricao: 'Receita exemplo (evento)',
    categoria: 'evento',
    valor: 800,
    data: TODAY,
    origem: 'evento',
  });

  await ensure('Produtos', PROD_ID, {
    nome: 'Kimono Exemplo',
    descricao: 'Produto de exemplo — pode ser editado ou removido.',
    sku: 'DEMO-001',
    preco: 250,
    preco_custo: 120,
    estoque: 10,
    estoque_minimo: 2,
    categoria: 'Vestimenta',
  });

  await ensure('Vendas', 'demo_venda', {
    data: TODAY,
    comprador_nome: 'Aluno Exemplo',
    aluno_id: ALUNO_ID,
    itens: JSON.stringify([{ produtoId: PROD_ID, nomeProduto: 'Kimono Exemplo', quantidade: 1, precoUnitario: 250 }]),
    total: 250,
    forma_pagamento: 'PIX',
  });

  await ensure('Reservas', 'demo_reserva', {
    espaco: 'Tatame Principal',
    locatario: 'Locatário Exemplo',
    data_inicio: TODAY,
    data_fim: TODAY,
    hora_inicio: '20:00',
    hora_fim: '22:00',
    valor: 300,
    status: 'confirmada',
  });

  await ensure('Aluguel', 'demo_aluguel', {
    locatario: 'Locatário Exemplo',
    espaco: 'Tatame Principal',
    valor: 1200,
    periodicidade: 'mensal',
    data_inicio: TODAY,
    data_fim: '',
    status: 'ativo',
  });

  await ensure('PagamentosContrato', 'demo_pag_contrato', {
    contrato_id: 'demo_aluguel',
    data_pagamento: TODAY,
    valor: 1200,
    forma_pagamento: 'PIX',
    referencia: 'mensal',
  });

  await ensure('Professores', 'demo_professor', {
    nome: 'Professor Exemplo',
    cpf: '222.222.222-22',
    telefone: '(11) 92222-2222',
    email: 'prof@academia.com',
    especialidade: 'Jiu-Jitsu',
    valor_hora: 80,
    status: 'ativo',
  });

  console.log(`\n=== ${created} criados, ${skipped} já existiam ===`);
})();
