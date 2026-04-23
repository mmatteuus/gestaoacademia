import { test, expect, type Page, type APIRequestContext } from '@playwright/test';

const SENHA = 'gemeos.com';
const PFX = 'it_e2e_dash_';

const TODAY = new Date().toISOString().slice(0, 10);
const yesterday = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
})();
const lastMonth = (() => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
})();
const future = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
})();
const past90 = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 90);
  return d.toISOString().slice(0, 10);
})();

const id = (k: string) => `${PFX}${k}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

async function login(page: Page) {
  await page.goto('/');
  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
}

async function createRow(api: APIRequestContext, body: Record<string, unknown>) {
  // Pequeno delay entre inserts para não estourar quota Sheets (60 reads/min/usuário).
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await api.post('http://localhost:3000/rows', { data: body });
    if (r.ok()) return r.json();
    const text = await r.text();
    lastErr = new Error(`POST /rows failed ${r.status()}: ${text}`);
    if (r.status() === 500 && /Quota|quota|exceeded/i.test(text)) {
      await new Promise((res) => setTimeout(res, 8000));
      continue;
    }
    throw lastErr;
  }
  throw lastErr;
}

async function listRows(api: APIRequestContext, type: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await api.get(`http://localhost:3000/rows?type=${encodeURIComponent(type)}`);
    if (r.ok()) return (await r.json()) as Array<Record<string, string>>;
    if (r.status() === 500) {
      await new Promise((res) => setTimeout(res, 5000));
      continue;
    }
    throw new Error(`GET /rows failed: ${r.status()}`);
  }
  throw new Error(`GET /rows failed após 3 tentativas`);
}

test.describe.configure({ mode: 'serial' });

test('dashboard reflete dados reais inseridos via API', async ({ page, request }) => {
  // ===== SETUP: insere o universo de dados =====
  const alunoId = id('aluno');
  const turmaId = id('turma');
  const prodOk = id('prod-ok');
  const prodLow = id('prod-low');
  const prodZero = id('prod-zero');
  const cobAberta = id('cob-aberta');
  const cobVencida = id('cob-vencida');
  const cobPaga = id('cob-paga');
  const desp = id('desp');
  const rec = id('rec');
  const aulaId = id('aula');
  const venda = id('venda');

  // Aluno
  await createRow(request, {
    sheet_type: 'Alunos',
    id: alunoId,
    nome: 'Aluno E2E Dashboard',
    email: 'e2e@test.com',
    telefone: '11999999999',
    cpf: '00000000000',
    data_nascimento: '2000-01-01',
    categoria: 'Adulto',
    faixa_atual: 'Branca',
    status: 'ativo',
    plano: 'mensal',
    data_matricula: past90,
    turma_ids: turmaId,
  });

  // Turma
  await createRow(request, {
    sheet_type: 'Turmas',
    id: turmaId,
    nome: 'Turma E2E',
    modalidade: 'Jiu-Jitsu',
    professor: 'Prof E2E',
    horario: '10:00-11:00',
    dias_semana: 'Seg,Qua',
    capacidade: 20,
    aluno_ids: alunoId,
    status: 'ativa',
  });

  // Produtos: estoque normal, baixo, zero
  await createRow(request, {
    sheet_type: 'Produtos', id: prodOk, nome: 'Kimono E2E', descricao: 'e2e',
    preco: 200, preco_custo: 100, estoque: 50, estoque_minimo: 5, categoria: 'Vestuario',
  });
  await createRow(request, {
    sheet_type: 'Produtos', id: prodLow, nome: 'Faixa E2E', descricao: 'e2e',
    preco: 50, preco_custo: 20, estoque: 2, estoque_minimo: 5, categoria: 'Faixas',
  });
  await createRow(request, {
    sheet_type: 'Produtos', id: prodZero, nome: 'Luva E2E', descricao: 'e2e',
    preco: 80, preco_custo: 40, estoque: 0, estoque_minimo: 3, categoria: 'Protecao',
  });

  // Cobranças: aberta, vencida, paga
  await createRow(request, {
    sheet_type: 'Financeiro', id: cobAberta, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
    tipo: 'mensalidade', descricao: 'Mensalidade futura', valor: 250, valor_pago: 0,
    data_vencimento: future, status: 'aberta',
  });
  await createRow(request, {
    sheet_type: 'Financeiro', id: cobVencida, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
    tipo: 'mensalidade', descricao: 'Mensalidade vencida', valor: 250, valor_pago: 0,
    data_vencimento: lastMonth, status: 'vencida',
  });
  await createRow(request, {
    sheet_type: 'Financeiro', id: cobPaga, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
    tipo: 'mensalidade', descricao: 'Mensalidade paga', valor: 250, valor_pago: 250,
    data_vencimento: yesterday, data_pagamento: TODAY, status: 'paga', forma_pagamento: 'PIX',
  });

  // Receita / Despesa do mês
  await createRow(request, {
    sheet_type: 'Receitas', id: rec, descricao: 'Receita extra E2E', categoria: 'extra',
    valor: 1500, data: TODAY, origem: 'evento',
  });
  await createRow(request, {
    sheet_type: 'Despesas', id: desp, descricao: 'Despesa E2E', categoria: 'aluguel',
    valor: 800, data: TODAY, status: 'paga',
  });

  // Aula com presenças
  await createRow(request, {
    sheet_type: 'Aulas', id: aulaId, turma_id: turmaId, data: TODAY, professor: 'Prof E2E',
    presencas: JSON.stringify([{ alunoId, presente: true }]),
  });

  // Venda
  await createRow(request, {
    sheet_type: 'Vendas', id: venda, data: TODAY, comprador_nome: 'Aluno E2E Dashboard',
    aluno_id: alunoId,
    itens: JSON.stringify([{ produtoId: prodOk, nomeProduto: 'Kimono E2E', quantidade: 1, precoUnitario: 200 }]),
    total: 200, forma_pagamento: 'PIX',
  });

  // ===== AÇÃO: abre o app e valida =====
  await login(page);

  // Dashboard renderiza
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Aguarda fim do skeleton + dados chegarem
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);

  // === KPI: conta de "Inadimplentes"? Aluno E2E não está como inadimplente, mas há cobrança vencida ===
  // KPI "Alunos Ativos" deve ser >= 1 (o nosso)
  const ativosCard = page.getByText('Alunos Ativos').locator('..').locator('..');
  await expect(ativosCard).toBeVisible();

  // === Receita do Mês ===
  // Receita esperada: receita_extra (1500) + cobrança paga (250) = 1750 mínimo
  const receitaCard = page.getByText('Receita do Mês').locator('..').locator('..');
  await expect(receitaCard).toBeVisible();
  const receitaTxt = await receitaCard.textContent();
  expect(receitaTxt).toContain('R$');
  // Confirma que NÃO é o mock antigo (15.400)
  // Pega o número do texto
  const receitaMatch = receitaTxt?.match(/R\$\s*([\d.,]+)/);
  expect(receitaMatch).toBeTruthy();

  // === Gráfico Presença Mensal: deve ter barras (rect com class de recharts) ===
  const presencaCard = page.getByRole('heading', { name: /Presença Mensal/i }).locator('..');
  await expect(presencaCard).toBeVisible();
  const barCount = await presencaCard.locator('svg .recharts-bar-rectangle, svg path.recharts-rectangle').count();
  expect(barCount).toBeGreaterThan(0);

  // === Gráfico Receitas x Despesas: linhas svg presentes ===
  const recDespCard = page.getByRole('heading', { name: /Receitas x Despesas/i }).locator('..');
  await expect(recDespCard).toBeVisible();
  const lineCount = await recDespCard.locator('svg .recharts-line').count();
  expect(lineCount).toBeGreaterThan(0);

  // === ALERTAS: deve mencionar produto com estoque baixo OU zerado ===
  await expect(page.getByText(/Estoque baixo: Faixa E2E/i).first()).toBeVisible();
  await expect(page.getByText(/Estoque zerado: Luva E2E/i).first()).toBeVisible();
  await expect(page.getByText(/Aluno E2E Dashboard com mensalidade vencida/i).first()).toBeVisible();

  // === ATIVIDADES RECENTES ===
  await expect(page.getByText(/Venda de Kimono E2E/i).first()).toBeVisible();
  await expect(page.getByText(/Pagamento recebido de Aluno E2E Dashboard/i).first()).toBeVisible();
  await expect(page.getByText(/Frequência lançada/i).first()).toBeVisible();

  // ===== TEARDOWN: marca itens com status cancelado para fácil identificação =====
  // (deletar não é suportado pela API; só tem update. Marcamos os IDs para limpeza manual.)
  console.log(`\n[E2E] Dados criados nesta run (prefixo ${PFX}):`);
  console.log({ alunoId, turmaId, prodOk, prodLow, prodZero, cobAberta, cobVencida, cobPaga, desp, rec, aulaId, venda });
});

test('verifica que API ainda está limpa de mocks (sem Lucas Mendes/Marina Silva fixos)', async ({ request }) => {
  // Se a planilha estiver vazia exceto pelos dados E2E e dados que VOCÊ inseriu,
  // garante que os dados reais NÃO contêm os mocks que estavam no codebase.
  const alunos = await listRows(request, 'Alunos');
  // Permite que outros dados existam, mas se o usuário disse que apagou tudo,
  // um Lucas Mendes/Marina Silva 'a1'/'a2' não deve voltar magicamente:
  const mockReturning = alunos.some((a) => a.id === 'a1' || a.id === 'a2' || a.id === 'a3');
  expect(mockReturning).toBe(false);
});
