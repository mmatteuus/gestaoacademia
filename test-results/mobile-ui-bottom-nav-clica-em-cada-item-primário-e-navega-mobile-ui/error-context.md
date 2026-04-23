# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-ui.spec.ts >> bottom nav: clica em cada item primário e navega
- Location: e2e\mobile-ui.spec.ts:12:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /frequência/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: /frequência/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications alt+T"
    - generic [ref=e3]:
      - banner [ref=e4]:
        - generic [ref=e5]:
          - img [ref=e7]
          - generic [ref=e10]:
            - paragraph [ref=e11]: Gêmeos Academia
            - heading "Frequencia" [level=2] [ref=e12]
        - generic [ref=e13]:
          - button [ref=e14] [cursor=pointer]:
            - img
          - button "Tema escuro ativo. Alternar para claro" [ref=e15] [cursor=pointer]:
            - img
          - button "Sair" [ref=e16] [cursor=pointer]:
            - img
      - main [ref=e17]:
        - generic [ref=e19]: Carregando...
      - navigation "Navegação principal" [ref=e20]:
        - list [ref=e21]:
          - listitem [ref=e22]:
            - link "Início" [ref=e23]:
              - /url: /
              - img [ref=e25]
              - generic [ref=e30]: Início
          - listitem [ref=e31]:
            - link "Alunos" [ref=e32]:
              - /url: /alunos
              - img [ref=e34]
              - generic [ref=e39]: Alunos
          - listitem [ref=e40]:
            - link "Frequência" [ref=e41]:
              - /url: /frequencia
              - img [ref=e43]
              - generic [ref=e46]: Frequência
          - listitem [ref=e47]:
            - link "Financeiro" [ref=e48]:
              - /url: /financeiro
              - img [ref=e50]
              - generic [ref=e52]: Financeiro
          - listitem [ref=e53]:
            - button "Abrir mais opções" [ref=e54] [cursor=pointer]:
              - img [ref=e55]
              - generic [ref=e59]: Mais
      - contentinfo [ref=e60]:
        - paragraph [ref=e61]:
          - text: Desenvolvido por
          - link "MtsFerreira" [ref=e62]:
            - /url: https://MtsFerreira.dev
  - generic [ref=e63]: "5500"
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
  9   |   await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });
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
> 27  |     await expect(page.getByRole('heading', { name: item.expectHeading }).first()).toBeVisible({ timeout: 10000 });
      |                                                                                   ^ Error: expect(locator).toBeVisible() failed
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
  42  |   await page.getByRole('link', { name: /Turmas/i }).first().click();
  43  |   await expect(page.getByRole('heading', { name: /Turmas/i }).first()).toBeVisible({ timeout: 10000 });
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
  81  | test('AlunosPage: botão "Enviar formulário" presente e clicável', async ({ page }) => {
  82  |   await loginMobile(page);
  83  |   await page.goto('/alunos');
  84  |   await page.waitForTimeout(800);
  85  | 
  86  |   // Botão de share/copiar (com title "Compartilhar formulário de cadastro")
  87  |   const btn = page.locator('button[title*="Compartilhar"]').first();
  88  |   await expect(btn).toBeVisible();
  89  |   // Confirma que o título aponta para o link público correto
  90  |   // (não clicamos para evitar dependência de clipboard API em WebKit)
  91  | });
  92  | 
  93  | test('Login: lockout após 5 tentativas incorretas', async ({ page }) => {
  94  |   await page.goto('/');
  95  |   await page.evaluate(() => {
  96  |     sessionStorage.clear();
  97  |     localStorage.clear();
  98  |   });
  99  |   await page.reload();
  100 | 
  101 |   const senha = page.getByRole('textbox', { name: /senha/i });
  102 |   const entrar = page.getByRole('button', { name: /entrar/i });
  103 | 
  104 |   for (let i = 1; i <= 5; i++) {
  105 |     await senha.fill(`errada${i}`);
  106 |     await entrar.click();
  107 |     // Aguarda processamento
  108 |     await page.waitForTimeout(300);
  109 |   }
  110 | 
  111 |   // 6ª tentativa: deve aparecer mensagem de lockout
  112 |   await senha.fill('errada6');
  113 |   await entrar.click();
  114 |   await expect(page.getByRole('alert')).toContainText(/muitas tentativas|incorreta/i);
  115 | });
  116 | 
```