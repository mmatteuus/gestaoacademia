import fetch from 'node-fetch';

const API = 'http://localhost:3000';

async function testAllSheets() {
  console.log('🧪 Testando todas as abas da aplicação...\n');

  const tests = [
    // Alunos
    { type: 'Alunos', data: { nome: 'Carlos Silva', email: 'carlos@teste.com', telefone: '11999999999', status: 'ativo', plano: 'Premium', data_matricula: '2026-04-01' }},
    // Financeiro
    { type: 'Financeiro', data: { aluno_id: 'ALU_001', descricao: 'Mensalidade Maio', valor: '150.00', status_pagamento: 'pago', data_vencimento: '2026-05-05', data_pagamento: '2026-04-20' }},
    // Aulas
    { type: 'Aulas', data: { aluno_id: 'ALU_001', nome_aula: 'Jiu-Jitsu Fundamentals', instrutor: 'Prof. Marcos', data_assistida: '2026-04-17', duracao_min: '60', observacoes: 'Ótimo desempenho' }},
    // Frequencia
    { type: 'Frequencia', data: { aluno_id: 'ALU_001', aula_id: 'AULA_001', data: '2026-04-17', presente: 'sim', horario_chegada: '19:00', observacoes: '' }},
    // Ranking
    { type: 'Ranking', data: { aluno_id: 'ALU_001', pontuacao: '850', categoria: 'Adulto', posicao: '3', data_referencia: '2026-04', descricao: 'Campeonato Regional' }},
    // Turmas
    { type: 'Turmas', data: { nome_turma: 'Turma Iniciante', instrutor: 'Prof. João', horario_inicio: '08:00', horario_fim: '09:30', dias_semana: 'Seg,Qua,Sex', capacidade_max: '20', status: 'ativa' }},
    // Graduacao
    { type: 'Graduacao', data: { aluno_id: 'ALU_001', faixa_atual: 'Branca', data_graduacao: '2026-03-15', grau: '2', instrutor_responsavel: 'Prof. Marcos', observacoes: 'Promoção por mérito' }},
    // Campeonatos
    { type: 'Campeonatos', data: { nome_evento: 'Copa São Paulo 2026', data_inicio: '2026-06-15', local: 'Arena Sport', custo_inscricao: '100.00', status: 'inscrições abertas' }},
    // Medalhas
    { type: 'Medalhas', data: { aluno_id: 'ALU_001', campanha_id: 'CAMP_001', tipo_medalha: 'ouro', categoria: 'Adulto Peso Leve', data_conquista: '2026-04-10' }},
    // Produtos
    { type: 'Produtos', data: { nome_produto: 'Kimono Jiu-Jitsu', sku: 'KIM-001', preco_custo: '120.00', preco_venda: '199.90', quantidade_estoque: '15', estoque_minimo: '5' }},
    // Vendas
    { type: 'Vendas', data: { aluno_id: 'ALU_001', produto_id: 'PROD_001', quantidade: '1', valor_total: '199.90', data_venda: '2026-04-17', metodo_pagamento: 'pix' }},
    // Aluguel
    { type: 'Aluguel', data: { locatario: 'Academia ABC', data_inicio: '2026-04-01', data_fim: '2026-04-30', horario: '08:00-22:00', valor_aluguel: '5000.00', status_pagamento: 'pago', finalidade: 'Evento Corporativo' }},
    // Professores
    { type: 'Professores', data: { nome: 'Marcos Santos', cpf: '123.456.789-00', telefone: '11988887777', email: 'marcos@academia.com', especialidade: 'Jiu-Jitsu', valor_hora: '50.00', status: 'ativo' }}
  ];

  const results = { success: 0, failed: 0 };

  for (const test of tests) {
    try {
      const res = await fetch(`${API}/rows?type=${test.type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      });
      
      if (res.ok) {
        console.log(`✅ ${test.type} - Inserido com sucesso`);
        results.success++;
      } else {
        console.log(`❌ ${test.type} - Erro: ${res.status}`);
        results.failed++;
      }
    } catch (e) {
      console.log(`❌ ${test.type} - Erro: ${e.message}`);
      results.failed++;
    }
  }

  console.log('\n📊 RESULTADO:');
  console.log(`   Sucesso: ${results.success}`);
  console.log(`   Falhas: ${results.failed}`);
  console.log(`   Total: ${tests.length}`);

  // Verificar dados em cada aba
  console.log('\n🔍 Verificando dados em cada aba...\n');
  
  const types = ['Alunos', 'Financeiro', 'Aulas', 'Frequencia', 'Ranking', 'Turmas', 'Graduacao', 'Campeonatos', 'Medalhas', 'Produtos', 'Vendas', 'Aluguel', 'Professores'];
  
  for (const type of types) {
    try {
      const res = await fetch(`${API}/rows?type=${type}`);
      const data = await res.json();
      console.log(`   ${type}: ${Array.isArray(data) ? data.length : 0} registros`);
    } catch (e) {
      console.log(`   ${type}: Erro ao buscar`);
    }
  }

  console.log('\n✨ Teste completo finalizado!');
}

testAllSheets();