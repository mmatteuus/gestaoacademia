# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-data.spec.ts >> verifica que API ainda está limpa de mocks (sem Lucas Mendes/Marina Silva fixos)
- Location: e2e\dashboard-data.spec.ts:217:1

# Error details

```
Error: GET /rows failed: 429
```

# Test source

```ts
  1   | import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
  2   | 
  3   | const SENHA = 'gemeos.com';
  4   | const PFX = 'it_e2e_dash_';
  5   | 
  6   | const TODAY = new Date().toISOString().slice(0, 10);
  7   | const yesterday = (() => {
  8   |   const d = new Date();
  9   |   d.setDate(d.getDate() - 1);
  10  |   return d.toISOString().slice(0, 10);
  11  | })();
  12  | const lastMonth = (() => {
  13  |   const d = new Date();
  14  |   d.setMonth(d.getMonth() - 1);
  15  |   return d.toISOString().slice(0, 10);
  16  | })();
  17  | const future = (() => {
  18  |   const d = new Date();
  19  |   d.setDate(d.getDate() + 30);
  20  |   return d.toISOString().slice(0, 10);
  21  | })();
  22  | const past90 = (() => {
  23  |   const d = new Date();
  24  |   d.setDate(d.getDate() - 90);
  25  |   return d.toISOString().slice(0, 10);
  26  | })();
  27  | 
  28  | const id = (k: string) => `${PFX}${k}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  29  | 
  30  | async function login(page: Page) {
  31  |   await page.goto('/');
  32  |   await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  33  |   await page.getByRole('button', { name: /entrar/i }).click();
  34  |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  35  | }
  36  | 
  37  | async function createRow(api: APIRequestContext, body: Record<string, unknown>) {
  38  |   // Pequeno delay entre inserts para não estourar quota Sheets (60 reads/min/usuário).
  39  |   let lastErr;
  40  |   for (let attempt = 0; attempt < 3; attempt++) {
  41  |     const r = await api.post('http://localhost:3000/rows', { data: body });
  42  |     if (r.ok()) return r.json();
  43  |     const text = await r.text();
  44  |     lastErr = new Error(`POST /rows failed ${r.status()}: ${text}`);
  45  |     if (r.status() === 500 && /Quota|quota|exceeded/i.test(text)) {
  46  |       await new Promise((res) => setTimeout(res, 8000));
  47  |       continue;
  48  |     }
  49  |     throw lastErr;
  50  |   }
  51  |   throw lastErr;
  52  | }
  53  | 
  54  | async function listRows(api: APIRequestContext, type: string) {
  55  |   const r = await api.get(`http://localhost:3000/rows?type=${encodeURIComponent(type)}`);
> 56  |   if (!r.ok()) throw new Error(`GET /rows failed: ${r.status()}`);
      |                      ^ Error: GET /rows failed: 429
  57  |   return (await r.json()) as Array<Record<string, string>>;
  58  | }
  59  | 
  60  | test.describe.configure({ mode: 'serial' });
  61  | 
  62  | test('dashboard reflete dados reais inseridos via API', async ({ page, request }) => {
  63  |   // ===== SETUP: insere o universo de dados =====
  64  |   const alunoId = id('aluno');
  65  |   const turmaId = id('turma');
  66  |   const prodOk = id('prod-ok');
  67  |   const prodLow = id('prod-low');
  68  |   const prodZero = id('prod-zero');
  69  |   const cobAberta = id('cob-aberta');
  70  |   const cobVencida = id('cob-vencida');
  71  |   const cobPaga = id('cob-paga');
  72  |   const desp = id('desp');
  73  |   const rec = id('rec');
  74  |   const aulaId = id('aula');
  75  |   const venda = id('venda');
  76  | 
  77  |   // Aluno
  78  |   await createRow(request, {
  79  |     sheet_type: 'Alunos',
  80  |     id: alunoId,
  81  |     nome: 'Aluno E2E Dashboard',
  82  |     email: 'e2e@test.com',
  83  |     telefone: '11999999999',
  84  |     cpf: '00000000000',
  85  |     data_nascimento: '2000-01-01',
  86  |     categoria: 'Adulto',
  87  |     faixa_atual: 'Branca',
  88  |     status: 'ativo',
  89  |     plano: 'mensal',
  90  |     data_matricula: past90,
  91  |     turma_ids: turmaId,
  92  |   });
  93  | 
  94  |   // Turma
  95  |   await createRow(request, {
  96  |     sheet_type: 'Turmas',
  97  |     id: turmaId,
  98  |     nome: 'Turma E2E',
  99  |     modalidade: 'Jiu-Jitsu',
  100 |     professor: 'Prof E2E',
  101 |     horario: '10:00-11:00',
  102 |     dias_semana: 'Seg,Qua',
  103 |     capacidade: 20,
  104 |     aluno_ids: alunoId,
  105 |     status: 'ativa',
  106 |   });
  107 | 
  108 |   // Produtos: estoque normal, baixo, zero
  109 |   await createRow(request, {
  110 |     sheet_type: 'Produtos', id: prodOk, nome: 'Kimono E2E', descricao: 'e2e',
  111 |     preco: 200, preco_custo: 100, estoque: 50, estoque_minimo: 5, categoria: 'Vestuario',
  112 |   });
  113 |   await createRow(request, {
  114 |     sheet_type: 'Produtos', id: prodLow, nome: 'Faixa E2E', descricao: 'e2e',
  115 |     preco: 50, preco_custo: 20, estoque: 2, estoque_minimo: 5, categoria: 'Faixas',
  116 |   });
  117 |   await createRow(request, {
  118 |     sheet_type: 'Produtos', id: prodZero, nome: 'Luva E2E', descricao: 'e2e',
  119 |     preco: 80, preco_custo: 40, estoque: 0, estoque_minimo: 3, categoria: 'Protecao',
  120 |   });
  121 | 
  122 |   // Cobranças: aberta, vencida, paga
  123 |   await createRow(request, {
  124 |     sheet_type: 'Financeiro', id: cobAberta, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  125 |     tipo: 'mensalidade', descricao: 'Mensalidade futura', valor: 250, valor_pago: 0,
  126 |     data_vencimento: future, status: 'aberta',
  127 |   });
  128 |   await createRow(request, {
  129 |     sheet_type: 'Financeiro', id: cobVencida, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  130 |     tipo: 'mensalidade', descricao: 'Mensalidade vencida', valor: 250, valor_pago: 0,
  131 |     data_vencimento: lastMonth, status: 'vencida',
  132 |   });
  133 |   await createRow(request, {
  134 |     sheet_type: 'Financeiro', id: cobPaga, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  135 |     tipo: 'mensalidade', descricao: 'Mensalidade paga', valor: 250, valor_pago: 250,
  136 |     data_vencimento: yesterday, data_pagamento: TODAY, status: 'paga', forma_pagamento: 'PIX',
  137 |   });
  138 | 
  139 |   // Receita / Despesa do mês
  140 |   await createRow(request, {
  141 |     sheet_type: 'Receitas', id: rec, descricao: 'Receita extra E2E', categoria: 'extra',
  142 |     valor: 1500, data: TODAY, origem: 'evento',
  143 |   });
  144 |   await createRow(request, {
  145 |     sheet_type: 'Despesas', id: desp, descricao: 'Despesa E2E', categoria: 'aluguel',
  146 |     valor: 800, data: TODAY, status: 'paga',
  147 |   });
  148 | 
  149 |   // Aula com presenças
  150 |   await createRow(request, {
  151 |     sheet_type: 'Aulas', id: aulaId, turma_id: turmaId, data: TODAY, professor: 'Prof E2E',
  152 |     presencas: JSON.stringify([{ alunoId, presente: true }]),
  153 |   });
  154 | 
  155 |   // Venda
  156 |   await createRow(request, {
```