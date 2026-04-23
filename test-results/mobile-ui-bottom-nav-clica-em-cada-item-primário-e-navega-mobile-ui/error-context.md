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

Locator: getByRole('heading', { name: /dashboard/i })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: /dashboard/i }) resolved to 2 elements:
    1) <h2 class="text-sm sm:text-base font-semibold text-foreground truncate">Dashboard</h2> aka locator('h2')
    2) <h1 class="text-xl md:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1> aka locator('h1')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: /dashboard/i })

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
            - heading "Dashboard" [level=2] [ref=e12]
        - generic [ref=e13]:
          - button [ref=e14] [cursor=pointer]:
            - img
          - button "Tema escuro ativo. Alternar para claro" [ref=e15] [cursor=pointer]:
            - img
          - button "Sair" [ref=e16] [cursor=pointer]:
            - img
      - main [ref=e17]:
        - generic [ref=e19]:
          - generic [ref=e21]:
            - heading "Dashboard" [level=1] [ref=e22]
            - paragraph [ref=e23]: Visão geral da academia
          - generic [ref=e24]:
            - generic [ref=e26]:
              - heading "Ações rápidas" [level=3] [ref=e27]
              - paragraph [ref=e28]: Atalhos para o uso diário da academia
            - generic [ref=e29]:
              - link "Novo aluno" [ref=e30]:
                - /url: /alunos
                - generic [ref=e31]:
                  - img
                  - text: Novo aluno
                - img
              - link "Lançar frequência" [ref=e32]:
                - /url: /frequencia
                - generic [ref=e33]:
                  - img
                  - text: Lançar frequência
                - img
              - link "Novo campeonato" [ref=e34]:
                - /url: /campeonatos
                - generic [ref=e35]:
                  - img
                  - text: Novo campeonato
                - img
              - link "Registrar venda" [ref=e36]:
                - /url: /produtos
                - generic [ref=e37]:
                  - img
                  - text: Registrar venda
                - img
          - generic [ref=e38]:
            - generic [ref=e39]:
              - generic [ref=e40]:
                - generic [ref=e41]: Alunos Ativos
                - img [ref=e43]
              - generic [ref=e48]: "679"
              - generic [ref=e49]:
                - img [ref=e50]
                - generic [ref=e53]: +5%
            - generic [ref=e54]:
              - generic [ref=e55]:
                - generic [ref=e56]: Inadimplentes
                - img [ref=e58]
              - generic [ref=e60]: "0"
              - generic [ref=e61]:
                - img [ref=e62]
                - generic [ref=e65]: "-10%"
            - generic [ref=e66]:
              - generic [ref=e67]:
                - generic [ref=e68]: Aptos p/ Graduação
                - img [ref=e70]
              - generic [ref=e73]: "0"
            - generic [ref=e74]:
              - generic [ref=e75]:
                - generic [ref=e76]: Ocupação
                - img [ref=e78]
              - generic [ref=e82]: 1132%
              - generic [ref=e83]:
                - img [ref=e84]
                - generic [ref=e87]: +3%
          - generic [ref=e88]:
            - generic [ref=e89]:
              - generic [ref=e90]:
                - generic [ref=e91]: Receita do Mês
                - img [ref=e93]
              - generic [ref=e95]: R$ 17.300
              - generic [ref=e96]:
                - img [ref=e97]
                - generic [ref=e100]: +8%
            - generic [ref=e101]:
              - generic [ref=e102]:
                - generic [ref=e103]: Despesas do Mês
                - img [ref=e105]
              - generic [ref=e108]: R$ 10.300
              - generic [ref=e109]:
                - img [ref=e110]
                - generic [ref=e113]: +2%
            - generic [ref=e114]:
              - generic [ref=e115]:
                - generic [ref=e116]: Lucro Estimado
                - img [ref=e118]
              - generic [ref=e120]: R$ 7.000
              - generic [ref=e121]:
                - img [ref=e122]
                - generic [ref=e125]: +12%
            - generic [ref=e126]:
              - generic [ref=e127]:
                - generic [ref=e128]: Vendas do Mês
                - img [ref=e130]
              - generic [ref=e134]: R$ 2.450
              - generic [ref=e135]:
                - img [ref=e136]
                - generic [ref=e139]: +6%
          - generic [ref=e140]:
            - generic [ref=e141]:
              - heading "Presença Mensal" [level=3] [ref=e142]
              - img [ref=e146]:
                - generic [ref=e151]:
                  - generic [ref=e153]: Nov
                  - generic [ref=e155]: Dez
                  - generic [ref=e157]: Jan
                  - generic [ref=e159]: Fev
                  - generic [ref=e161]: Mar
                  - generic [ref=e163]: Abr
                - generic [ref=e165]:
                  - generic [ref=e167]: "0"
                  - generic [ref=e169]: "25"
                  - generic [ref=e171]: "50"
                  - generic [ref=e173]: "75"
                  - generic [ref=e175]: "100"
            - generic [ref=e181]:
              - heading "Receitas x Despesas" [level=3] [ref=e182]
              - img [ref=e186]:
                - generic [ref=e191]:
                  - generic [ref=e193]: Nov
                  - generic [ref=e195]: Dez
                  - generic [ref=e197]: Jan
                  - generic [ref=e199]: Fev
                  - generic [ref=e201]: Mar
                  - generic [ref=e203]: Abr
                - generic [ref=e205]:
                  - generic [ref=e207]: "0"
                  - generic [ref=e209]: "5500"
                  - generic [ref=e211]: "11000"
                  - generic [ref=e213]: "16500"
                  - generic [ref=e215]: "22000"
          - generic [ref=e220]:
            - generic [ref=e221]:
              - generic [ref=e222]:
                - heading "Alertas" [level=3] [ref=e223]
                - generic [ref=e224]: 492 pendência(s)
              - generic [ref=e225]:
                - generic [ref=e228]:
                  - paragraph [ref=e229]: Aluno E2E Dashboard com mensalidade vencida (24 cobranças)
                  - paragraph [ref=e230]: 2026-01-22
                - generic [ref=e233]:
                  - paragraph [ref=e234]: Aluno E2E Dashboard com mensalidade vencida (22 cobranças)
                  - paragraph [ref=e235]: 2026-01-22
                - generic [ref=e238]:
                  - paragraph [ref=e239]: Aluno E2E Dashboard com mensalidade vencida (33 cobranças)
                  - paragraph [ref=e240]: 2026-01-22
                - generic [ref=e243]:
                  - paragraph [ref=e244]: Aluno E2E Dashboard com mensalidade vencida (38 cobranças)
                  - paragraph [ref=e245]: 2026-01-22
                - generic [ref=e248]:
                  - paragraph [ref=e249]: "Estoque baixo: Faixa E2E (2 unid.)"
                  - paragraph [ref=e250]: 2026-04-23
                - generic [ref=e253]:
                  - paragraph [ref=e254]: "Estoque zerado: Luva E2E"
                  - paragraph [ref=e255]: 2026-04-23
                - generic [ref=e258]:
                  - paragraph [ref=e259]: "Estoque baixo: Faixa E2E (2 unid.)"
                  - paragraph [ref=e260]: 2026-04-23
                - generic [ref=e263]:
                  - paragraph [ref=e264]: "Estoque zerado: Luva E2E"
                  - paragraph [ref=e265]: 2026-04-23
            - generic [ref=e266]:
              - heading "Atividades Recentes" [level=3] [ref=e267]
              - generic [ref=e268]:
                - generic [ref=e271]:
                  - paragraph [ref=e272]: Venda de Kimono Exemplo para Aluno Exemplo
                  - paragraph [ref=e273]: 2026-04-23
                - generic [ref=e276]:
                  - paragraph [ref=e277]: Pagamento recebido de Aluno Exemplo
                  - paragraph [ref=e278]: 2026-04-23
                - generic [ref=e281]:
                  - paragraph [ref=e282]: Frequência lançada (1 alunos)
                  - paragraph [ref=e283]: 2026-04-23
                - generic [ref=e286]:
                  - paragraph [ref=e287]: Venda de Kimono E2E para Aluno E2E Dashboard
                  - paragraph [ref=e288]: 2026-04-23
                - generic [ref=e291]:
                  - paragraph [ref=e292]: Pagamento recebido de Aluno E2E Dashboard
                  - paragraph [ref=e293]: 2026-04-23
                - generic [ref=e296]:
                  - paragraph [ref=e297]: Frequência lançada (1 alunos)
                  - paragraph [ref=e298]: 2026-04-23
                - generic [ref=e301]:
                  - paragraph [ref=e302]: Venda de Kimono E2E para Aluno E2E Dashboard
                  - paragraph [ref=e303]: 2026-04-23
                - generic [ref=e306]:
                  - paragraph [ref=e307]: Pagamento recebido de Aluno E2E Dashboard
                  - paragraph [ref=e308]: 2026-04-23
      - navigation "Navegação principal" [ref=e309]:
        - list [ref=e310]:
          - listitem [ref=e311]:
            - link "Início" [ref=e312]:
              - /url: /
              - img [ref=e314]
              - generic [ref=e319]: Início
          - listitem [ref=e320]:
            - link "Alunos" [ref=e321]:
              - /url: /alunos
              - img [ref=e323]
              - generic [ref=e328]: Alunos
          - listitem [ref=e329]:
            - link "Frequência" [ref=e330]:
              - /url: /frequencia
              - img [ref=e332]
              - generic [ref=e335]: Frequência
          - listitem [ref=e336]:
            - link "Financeiro" [ref=e337]:
              - /url: /financeiro
              - img [ref=e339]
              - generic [ref=e341]: Financeiro
          - listitem [ref=e342]:
            - button "Abrir mais opções" [ref=e343] [cursor=pointer]:
              - img [ref=e344]
              - generic [ref=e348]: Mais
      - contentinfo [ref=e349]:
        - paragraph [ref=e350]:
          - text: Desenvolvido por
          - link "MtsFerreira" [ref=e351]:
            - /url: https://MtsFerreira.dev
  - generic [ref=e352]: "5500"
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
> 27  |     await expect(page.getByRole('heading', { name: item.expectHeading })).toBeVisible({ timeout: 10000 });
      |                                                                           ^ Error: expect(locator).toBeVisible() failed
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
  82  |   await context.grantPermissions(['clipboard-read', 'clipboard-write']);
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