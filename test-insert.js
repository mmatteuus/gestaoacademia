import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

async function testInsertions() {
  const testData = [
    {
      id: String(Date.now()),
      nome: 'Usuário Teste Alpha',
      email: `alpha${Date.now()}@teste.com`,
      status: 'ativo',
      created_at: new Date().toISOString(),
    },
    {
      id: String(Date.now() + 1),
      nome: 'Usuário Teste Beta',
      email: `beta${Date.now()}@teste.com`,
      status: 'pendente',
      created_at: new Date().toISOString(),
    }
  ];

  console.log('🚀 Iniciando testes de inserção...\n');

  for (const data of testData) {
    try {
      console.log(`📝 Inserindo: ${data.nome} (${data.email})`);
      
      const response = await fetch(`${API_URL}/rows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Sucesso! ID: ${data.id}`);
      } else {
        console.log(`❌ Erro: ${result.error}`);
      }
    } catch (error) {
      console.log(`💥 Falha na conexão: ${error.message}`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n🔍 Verificando dados inseridos...\n');
  
  try {
    const listResponse = await fetch(`${API_URL}/rows`);
    const rows = await listResponse.json();
    
    console.log(`📊 Total de registros na planilha: ${rows.length}`);
    console.log('Últimos registros:');
    rows.slice(-2).forEach(row => {
      console.log(`   - ${row.nome} | ${row.email} | ${row.status}`);
    });
  } catch (error) {
    console.log(`💥 Erro ao listar: ${error.message}`);
  }
}

testInsertions();
