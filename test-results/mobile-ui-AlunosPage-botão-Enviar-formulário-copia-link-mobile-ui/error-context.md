# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-ui.spec.ts >> AlunosPage: botão "Enviar formulário" copia link
- Location: e2e\mobile-ui.spec.ts:81:1

# Error details

```
Error: browserContext.grantPermissions: Unknown permission: clipboard-write
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const SENHA = 'gemeos.com';
  4   | 
  5   | async function loginMobile(page: import('@playwright/test').Page) {
  6   |   await page.goto('/');
  7   |   await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  8   |   await page.getByRole('button', { name: /entrar/i }).click();
  9   |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  10  | }
  11  | 
  12  | test('bottom nav: clica em cada item primário e navega', async ({ page }) => {
  13  |   await loginMobile(page);
  14  | 
  15  |   // Cada item primário do BottomNav: Início / Alunos / Frequência / Financeiro
  16  |   const items: Array<{ name: RegExp; expectHeading: RegExp }> = [
  17  |     { name: /alunos/i, expectHeading: /alunos/i },
  18  |     { name: /frequência/i, expectHeading: /frequência/i },
  19  |     { name: /financeiro/i, expectHeading: /financeiro/i },
  20  |     { name: /início/i, expectHeading: /dashboard/i },
  21  |   ];
  22  | 
  23  |   for (const item of items) {
  24  |     const link = page.locator('nav[aria-label="Navegação principal"]').getByRole('link', { name: item.name });
  25  |     await expect(link).toBeVisible();
  26  |     await link.click();
  27  |     await expect(page.getByRole('heading', { name: item.expectHeading })).toBeVisible({ timeout: 10000 });
  28  |   }
  29  | });
  30  | 
  31  | test('bottom nav: botão "Mais" abre menu com itens secundários', async ({ page }) => {
  32  |   await loginMobile(page);
  33  | 
  34  |   await page.getByRole('button', { name: /abrir mais op/i }).click();
  35  |   // Drawer "Mais opções"
  36  |   await expect(page.getByRole('heading', { name: /Mais opções/i })).toBeVisible();
  37  |   // Itens secundários acessíveis
  38  |   await expect(page.getByRole('link', { name: /Turmas/i })).toBeVisible();
  39  |   await expect(page.getByRole('link', { name: /Ranking/i })).toBeVisible();
  40  | 
  41  |   // Clica num item — fecha o drawer e navega
  42  |   await page.getByRole('link', { name: /Turmas/i }).click();
  43  |   await expect(page.getByRole('heading', { name: /Turmas/i })).toBeVisible({ timeout: 10000 });
  44  |   await expect(page.getByRole('heading', { name: /Mais opções/i })).not.toBeVisible();
  45  | });
  46  | 
  47  | test('Ranking: clica na aba "Regras" e vê conteúdo de regras', async ({ page }) => {
  48  |   await loginMobile(page);
  49  |   await page.goto('/ranking');
  50  | 
  51  |   await page.getByRole('button', { name: /^Regras$/i }).click();
  52  |   // Conteúdo de regras
  53  |   await expect(page.getByRole('heading', { name: /Como funciona o ranking/i })).toBeVisible();
  54  |   await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible();
  55  |   await expect(page.getByText(/\+15 pontos por vitória/i)).toBeVisible();
  56  |   await expect(page.getByText(/\+25 pontos por medalha/i)).toBeVisible();
  57  | });
  58  | 
  59  | test('Formulário público: preenche e envia cadastro de aluno', async ({ page }) => {
  60  |   // Não precisa de login — rota pública
  61  |   await page.goto('/cadastro/aluno');
  62  | 
  63  |   await expect(page.getByRole('heading', { name: /Cadastro de aluno/i })).toBeVisible();
  64  | 
  65  |   // Preenche campos obrigatórios + opcionais
  66  |   const nome = `Aluno UI ${Date.now()}`;
  67  |   await page.getByLabel(/Nome completo/i).fill(nome);
  68  |   await page.getByLabel(/Telefone \*/i).fill('11999999999');
  69  |   await page.getByLabel(/E-mail/i).fill('uitest@example.com');
  70  |   await page.getByLabel(/Categoria/i).selectOption('Adulto');
  71  |   await page.getByLabel(/Faixa atual/i).fill('Branca');
  72  |   await page.getByLabel(/Observações/i).fill('Cadastro via teste E2E mobile');
  73  | 
  74  |   // Submete
  75  |   await page.getByRole('button', { name: /Enviar cadastro/i }).click();
  76  | 
  77  |   // Tela de sucesso
  78  |   await expect(page.getByRole('heading', { name: /Cadastro enviado/i })).toBeVisible({ timeout: 15000 });
  79  | });
  80  | 
  81  | test('AlunosPage: botão "Enviar formulário" copia link', async ({ page, context }) => {
> 82  |   await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      |                 ^ Error: browserContext.grantPermissions: Unknown permission: clipboard-write
  83  |   await loginMobile(page);
  84  |   await page.goto('/alunos');
  85  |   await page.waitForTimeout(500);
  86  | 
  87  |   // Botão de share/copiar (mobile mostra ícone Copy)
  88  |   const btn = page.getByRole('button', { name: /Compartilhar formulário|Enviar formulário/i }).first();
  89  |   await expect(btn).toBeVisible();
  90  |   // Como navigator.share não é nativo no Playwright, ele cai no fallback de copiar
  91  |   await btn.click();
  92  |   // Aguarda toast de "Link copiado"
  93  |   await expect(page.getByText(/Link copiado|Não foi possível copiar/i).first()).toBeVisible({ timeout: 5000 });
  94  | });
  95  | 
  96  | test('Login: lockout após 5 tentativas incorretas', async ({ page }) => {
  97  |   await page.goto('/');
  98  |   await page.evaluate(() => {
  99  |     sessionStorage.clear();
  100 |     localStorage.clear();
  101 |   });
  102 |   await page.reload();
  103 | 
  104 |   const senha = page.getByRole('textbox', { name: /senha/i });
  105 |   const entrar = page.getByRole('button', { name: /entrar/i });
  106 | 
  107 |   for (let i = 1; i <= 5; i++) {
  108 |     await senha.fill(`errada${i}`);
  109 |     await entrar.click();
  110 |     // Aguarda processamento
  111 |     await page.waitForTimeout(300);
  112 |   }
  113 | 
  114 |   // 6ª tentativa: deve aparecer mensagem de lockout
  115 |   await senha.fill('errada6');
  116 |   await entrar.click();
  117 |   await expect(page.getByRole('alert')).toContainText(/muitas tentativas|incorreta/i);
  118 | });
  119 | 
```