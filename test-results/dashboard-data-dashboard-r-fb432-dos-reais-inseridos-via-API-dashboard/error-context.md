# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-data.spec.ts >> dashboard reflete dados reais inseridos via API
- Location: e2e\dashboard-data.spec.ts:51:1

# Error details

```
Error: POST /rows failed 500: {"ok":false,"error":"operation_failed","message":"Internal server error"}
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
  38  |   const r = await api.post('http://localhost:3000/rows', { data: body });
> 39  |   if (!r.ok()) throw new Error(`POST /rows failed ${r.status()}: ${await r.text()}`);
      |                      ^ Error: POST /rows failed 500: {"ok":false,"error":"operation_failed","message":"Internal server error"}
  40  |   return r.json();
  41  | }
  42  | 
  43  | async function listRows(api: APIRequestContext, type: string) {
  44  |   const r = await api.get(`http://localhost:3000/rows?type=${encodeURIComponent(type)}`);
  45  |   if (!r.ok()) throw new Error(`GET /rows failed: ${r.status()}`);
  46  |   return (await r.json()) as Array<Record<string, string>>;
  47  | }
  48  | 
  49  | test.describe.configure({ mode: 'serial' });
  50  | 
  51  | test('dashboard reflete dados reais inseridos via API', async ({ page, request }) => {
  52  |   // ===== SETUP: insere o universo de dados =====
  53  |   const alunoId = id('aluno');
  54  |   const turmaId = id('turma');
  55  |   const prodOk = id('prod-ok');
  56  |   const prodLow = id('prod-low');
  57  |   const prodZero = id('prod-zero');
  58  |   const cobAberta = id('cob-aberta');
  59  |   const cobVencida = id('cob-vencida');
  60  |   const cobPaga = id('cob-paga');
  61  |   const desp = id('desp');
  62  |   const rec = id('rec');
  63  |   const aulaId = id('aula');
  64  |   const venda = id('venda');
  65  | 
  66  |   // Aluno
  67  |   await createRow(request, {
  68  |     sheet_type: 'Alunos',
  69  |     id: alunoId,
  70  |     nome: 'Aluno E2E Dashboard',
  71  |     email: 'e2e@test.com',
  72  |     telefone: '11999999999',
  73  |     cpf: '00000000000',
  74  |     data_nascimento: '2000-01-01',
  75  |     categoria: 'Adulto',
  76  |     faixa_atual: 'Branca',
  77  |     status: 'ativo',
  78  |     plano: 'mensal',
  79  |     data_matricula: past90,
  80  |     turma_ids: turmaId,
  81  |   });
  82  | 
  83  |   // Turma
  84  |   await createRow(request, {
  85  |     sheet_type: 'Turmas',
  86  |     id: turmaId,
  87  |     nome: 'Turma E2E',
  88  |     modalidade: 'Jiu-Jitsu',
  89  |     professor: 'Prof E2E',
  90  |     horario: '10:00-11:00',
  91  |     dias_semana: 'Seg,Qua',
  92  |     capacidade: 20,
  93  |     aluno_ids: alunoId,
  94  |     status: 'ativa',
  95  |   });
  96  | 
  97  |   // Produtos: estoque normal, baixo, zero
  98  |   await createRow(request, {
  99  |     sheet_type: 'Produtos', id: prodOk, nome: 'Kimono E2E', descricao: 'e2e',
  100 |     preco: 200, preco_custo: 100, estoque: 50, estoque_minimo: 5, categoria: 'Vestuario',
  101 |   });
  102 |   await createRow(request, {
  103 |     sheet_type: 'Produtos', id: prodLow, nome: 'Faixa E2E', descricao: 'e2e',
  104 |     preco: 50, preco_custo: 20, estoque: 2, estoque_minimo: 5, categoria: 'Faixas',
  105 |   });
  106 |   await createRow(request, {
  107 |     sheet_type: 'Produtos', id: prodZero, nome: 'Luva E2E', descricao: 'e2e',
  108 |     preco: 80, preco_custo: 40, estoque: 0, estoque_minimo: 3, categoria: 'Protecao',
  109 |   });
  110 | 
  111 |   // Cobranças: aberta, vencida, paga
  112 |   await createRow(request, {
  113 |     sheet_type: 'Financeiro', id: cobAberta, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  114 |     tipo: 'mensalidade', descricao: 'Mensalidade futura', valor: 250, valor_pago: 0,
  115 |     data_vencimento: future, status: 'aberta',
  116 |   });
  117 |   await createRow(request, {
  118 |     sheet_type: 'Financeiro', id: cobVencida, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  119 |     tipo: 'mensalidade', descricao: 'Mensalidade vencida', valor: 250, valor_pago: 0,
  120 |     data_vencimento: lastMonth, status: 'vencida',
  121 |   });
  122 |   await createRow(request, {
  123 |     sheet_type: 'Financeiro', id: cobPaga, aluno_id: alunoId, nome_aluno: 'Aluno E2E Dashboard',
  124 |     tipo: 'mensalidade', descricao: 'Mensalidade paga', valor: 250, valor_pago: 250,
  125 |     data_vencimento: yesterday, data_pagamento: TODAY, status: 'paga', forma_pagamento: 'PIX',
  126 |   });
  127 | 
  128 |   // Receita / Despesa do mês
  129 |   await createRow(request, {
  130 |     sheet_type: 'Receitas', id: rec, descricao: 'Receita extra E2E', categoria: 'extra',
  131 |     valor: 1500, data: TODAY, origem: 'evento',
  132 |   });
  133 |   await createRow(request, {
  134 |     sheet_type: 'Despesas', id: desp, descricao: 'Despesa E2E', categoria: 'aluguel',
  135 |     valor: 800, data: TODAY, status: 'paga',
  136 |   });
  137 | 
  138 |   // Aula com presenças
  139 |   await createRow(request, {
```