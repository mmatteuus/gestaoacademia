import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

async function populateAllFields() {
  console.log('🚀 Preenchendo TODOS os campos para teste completo...\n');

  // === ABA: ALUNOS ===
  console.log('📋 ABA: ALUNOS');
  const alunos = [
    {
      id: 'ALU_001',
      nome: 'Ana Clara Silva',
      email: 'ana.clara@email.com',
      status: 'ativo',
      plano: 'Plano Anual Premium',
      created_at: new Date().toISOString()
    },
    {
      id: 'ALU_002',
      nome: 'Bruno Henrique Santos',
      email: 'bruno.santos@email.com',
      status: 'pendente',
      plano: 'Plano Mensal',
      created_at: new Date().toISOString()
    },
    {
      id: 'ALU_003',
      nome: 'Carla Mendes Oliveira',
      email: 'carla.mendes@email.com',
      status: 'inativo',
      plano: 'Plano Trimestral',
      created_at: new Date().toISOString()
    }
  ];

  for (const aluno of alunos) {
    await fetch(`${API_URL}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aluno)
    });
    console.log(`  ✅ Aluno: ${aluno.nome}`);
  }

  // === ABA: FINANCEIRO ===
  console.log('\n💰 ABA: FINANCEIRO');
  const financeiros = [
    {
      id: 'FIN_001',
      aluno_id: 'ALU_001',
      descricao: 'Matrícula Academia - 2026',
      valor: '250.00',
      status_pagamento: 'pago',
      data_vencimento: '2026-04-01',
      created_at: new Date().toISOString()
    },
    {
      id: 'FIN_002',
      aluno_id: 'ALU_001',
      descricao: 'Mensalidade Abril - Plano Premium',
      valor: '180.00',
      status_pagamento: 'pago',
      data_vencimento: '2026-04-10',
      created_at: new Date().toISOString()
    },
    {
      id: 'FIN_003',
      aluno_id: 'ALU_002',
      descricao: 'Mensalidade Abril - Plano Mensal',
      valor: '89.90',
      status_pagamento: 'pendente',
      data_vencimento: '2026-04-15',
      created_at: new Date().toISOString()
    },
    {
      id: 'FIN_004',
      aluno_id: 'ALU_003',
      descricao: 'Reativação de Plano',
      valor: '50.00',
      status_pagamento: 'cancelado',
      data_vencimento: '2026-03-20',
      created_at: new Date().toISOString()
    }
  ];

  for (const fin of financeiros) {
    await fetch(`${API_URL}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fin)
    });
    console.log(`  ✅ Financeiro: ${fin.descricao} - R$ ${fin.valor}`);
  }

  // === ABA: AULAS ===
  console.log('\n🏋️ ABA: AULAS');
  const aulas = [
    {
      id: 'AUL_001',
      aluno_id: 'ALU_001',
      nome_aula: 'Musculação - Treino A (Peito e Tríceps)',
      data_assistida: '2026-04-15',
      duracao_min: '75',
      created_at: new Date().toISOString()
    },
    {
      id: 'AUL_002',
      aluno_id: 'ALU_001',
      nome_aula: 'Cardio - Esteira Intervalado',
      data_assistida: '2026-04-15',
      duracao_min: '30',
      created_at: new Date().toISOString()
    },
    {
      id: 'AUL_003',
      aluno_id: 'ALU_002',
      nome_aula: 'Funcional - Circuito Completo',
      data_assistida: '2026-04-16',
      duracao_min: '60',
      created_at: new Date().toISOString()
    },
    {
      id: 'AUL_004',
      aluno_id: 'ALU_003',
      nome_aula: 'Yoga - Flexibilidade e Relaxamento',
      data_assistida: '2026-04-14',
      duracao_min: '90',
      created_at: new Date().toISOString()
    },
    {
      id: 'AUL_005',
      aluno_id: 'ALU_001',
      nome_aula: 'Musculação - Treino B (Costas e Bíceps)',
      data_assistida: '2026-04-17',
      duracao_min: '75',
      created_at: new Date().toISOString()
    }
  ];

  for (const aula of aulas) {
    await fetch(`${API_URL}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aula)
    });
    console.log(`  ✅ Aula: ${aula.nome_aula} (${aula.duracao_min}min)`);
  }

  // === VERIFICAÇÃO FINAL ===
  console.log('\n🔍 Verificando dados inseridos...');
  
  for (const type of ['Alunos', 'Financeiro', 'Aulas']) {
    const res = await fetch(`${API_URL}/rows?type=${type}`);
    const data = await res.json();
    console.log(`  📊 ${type}: ${Array.isArray(data) ? data.length : 0} registros`);
  }

  console.log('\n✨ Teste de preenchimento completo concluído!');
  console.log('👉 Abra sua planilha para conferir todas as abas preenchidas.');
}

populateAllFields().catch(console.error);
