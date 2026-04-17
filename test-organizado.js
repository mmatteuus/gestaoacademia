import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

async function populateAllSheets() {
  console.log('🚀 Iniciando preenchimento organizado das abas...\n');

  // 1. Alunos
  const alunoId = 'ALUNO_' + Date.now();
  const aluno = {
    nome: 'Maria Souza',
    email: 'maria.souza@aluno.com',
    status: 'ativo',
    plano: 'Plano Anual'
  };

  console.log('1️⃣ Adicionando Aluno...');
  await fetch(`${API_URL}/rows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno)
  });
  console.log(`✅ Aluno ${aluno.nome} adicionado na aba 'Alunos'.`);

  // 2. Financeiro
  const finId = 'FIN_' + Date.now();
  const financeiro = {
    id: finId,
    aluno_id: alunoId,
    descricao: 'Matrícula Academia',
    valor: '200.00',
    status_pagamento: 'pendente',
    data_vencimento: '2026-05-01'
  };

  console.log('\n2️⃣ Adicionando registro Financeiro...');
  await fetch(`${API_URL}/rows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(financeiro)
  });
  console.log(`✅ Registro financeiro de R$ ${financeiro.valor} na aba 'Financeiro'.`);

  // 3. Aulas
  const aulaId = 'AULA_' + Date.now();
  const aula = {
    id: aulaId,
    aluno_id: alunoId,
    nome_aula: 'Musculação Intensiva',
    data_assistida: new Date().toISOString().split('T')[0],
    duracao_min: '90'
  };

  console.log('\n3️⃣ Registrando Aula...');
  await fetch(`${API_URL}/rows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aula)
  });
  console.log(`✅ Aula "${aula.nome_aula}" registrada na aba 'Aulas'.`);

  console.log('\n✨ Organização concluída! Verifique as 3 abas na sua planilha.');
}

populateAllSheets();
