# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile.spec.ts >> login mobile, input >=16px (sem zoom iOS), navega e vê footer
- Location: e2e\mobile.spec.ts:5:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
=========================== logs ===========================
  "domcontentloaded" event fired
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e7]
        - generic [ref=e10]:
          - paragraph [ref=e11]: Gêmeos Academia
          - heading "Alunos" [level=2] [ref=e12]
      - generic [ref=e13]:
        - button [ref=e14] [cursor=pointer]:
          - img
        - button "Tema escuro ativo. Alternar para claro" [ref=e15] [cursor=pointer]:
          - img
        - button "Sair" [ref=e16] [cursor=pointer]:
          - img
    - main [ref=e17]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - generic [ref=e21]:
            - heading "Alunos" [level=1] [ref=e22]
            - paragraph [ref=e23]: 679 alunos cadastrados
          - generic [ref=e25]:
            - button "Compartilhar formulário de cadastro" [ref=e26] [cursor=pointer]:
              - img
              - img
            - button "Novo Aluno" [ref=e27] [cursor=pointer]:
              - img
              - text: Novo Aluno
        - generic [ref=e28]:
          - generic [ref=e29]:
            - img [ref=e30]
            - textbox "Buscar aluno..." [ref=e33]
          - generic [ref=e34]:
            - button "Todos" [ref=e35] [cursor=pointer]
            - button "Ativo" [ref=e36] [cursor=pointer]
            - button "Inadimplente" [ref=e37] [cursor=pointer]
            - button "Trancado" [ref=e38] [cursor=pointer]
            - button "Inativo" [ref=e39] [cursor=pointer]
            - button "Pre-cadastro" [ref=e40] [cursor=pointer]
        - generic [ref=e41]:
          - button "Aluno E2E Dashboard Adulto • Branca Ativo 11999999999 e2e@test.com 1 turma(s) Editar" [ref=e42] [cursor=pointer]:
            - generic [ref=e43]:
              - generic [ref=e44]:
                - paragraph [ref=e45]: Aluno E2E Dashboard
                - paragraph [ref=e46]: Adulto • Branca
              - generic [ref=e47]: Ativo
            - generic [ref=e48]:
              - paragraph [ref=e49]: "11999999999"
              - paragraph [ref=e50]: e2e@test.com
              - paragraph [ref=e51]: 1 turma(s)
            - button "Editar" [ref=e53]:
              - img
              - text: Editar
          - button "Aluno E2E Dashboard Adulto • Branca Ativo 11999999999 e2e@test.com 1 turma(s) Editar" [ref=e54] [cursor=pointer]:
            - generic [ref=e55]:
              - generic [ref=e56]:
                - paragraph [ref=e57]: Aluno E2E Dashboard
                - paragraph [ref=e58]: Adulto • Branca
              - generic [ref=e59]: Ativo
            - generic [ref=e60]:
              - paragraph [ref=e61]: "11999999999"
              - paragraph [ref=e62]: e2e@test.com
              - paragraph [ref=e63]: 1 turma(s)
            - button "Editar" [ref=e65]:
              - img
              - text: Editar
          - button "Aluno E2E Dashboard Adulto • Branca Ativo 11999999999 e2e@test.com 1 turma(s) Editar" [ref=e66] [cursor=pointer]:
            - generic [ref=e67]:
              - generic [ref=e68]:
                - paragraph [ref=e69]: Aluno E2E Dashboard
                - paragraph [ref=e70]: Adulto • Branca
              - generic [ref=e71]: Ativo
            - generic [ref=e72]:
              - paragraph [ref=e73]: "11999999999"
              - paragraph [ref=e74]: e2e@test.com
              - paragraph [ref=e75]: 1 turma(s)
            - button "Editar" [ref=e77]:
              - img
              - text: Editar
          - button "Aluno E2E Dashboard Adulto • Branca Ativo 11999999999 e2e@test.com 1 turma(s) Editar" [ref=e78] [cursor=pointer]:
            - generic [ref=e79]:
              - generic [ref=e80]:
                - paragraph [ref=e81]: Aluno E2E Dashboard
                - paragraph [ref=e82]: Adulto • Branca
              - generic [ref=e83]: Ativo
            - generic [ref=e84]:
              - paragraph [ref=e85]: "11999999999"
              - paragraph [ref=e86]: e2e@test.com
              - paragraph [ref=e87]: 1 turma(s)
            - button "Editar" [ref=e89]:
              - img
              - text: Editar
          - button "Aluno E2E Dashboard Adulto • Branca Ativo 11999999999 e2e@test.com 1 turma(s) Editar" [ref=e90] [cursor=pointer]:
            - generic [ref=e91]:
              - generic [ref=e92]:
                - paragraph [ref=e93]: Aluno E2E Dashboard
                - paragraph [ref=e94]: Adulto • Branca
              - generic [ref=e95]: Ativo
            - generic [ref=e96]:
              - paragraph [ref=e97]: "11999999999"
              - paragraph [ref=e98]: e2e@test.com
              - paragraph [ref=e99]: 1 turma(s)
            - button "Editar" [ref=e101]:
              - img
              - text: Editar
          - button "Aluno E2E Dashboard Adulto • Branca Ativo 11999999999 e2e@test.com 1 turma(s) Editar" [ref=e102] [cursor=pointer]:
            - generic [ref=e103]:
              - generic [ref=e104]:
                - paragraph [ref=e105]: Aluno E2E Dashboard
                - paragraph [ref=e106]: Adulto • Branca
              - generic [ref=e107]: Ativo
            - generic [ref=e108]:
              - paragraph [ref=e109]: "11999999999"
              - paragraph [ref=e110]: e2e@test.com
              - paragraph [ref=e111]: 1 turma(s)
            - button "Editar" [ref=e113]:
              - img
              - text: Editar
        - generic [ref=e114]:
          - button [disabled]:
            - img
          - generic [ref=e115]: Pagina 1 de 114
          - button [ref=e116] [cursor=pointer]:
            - img
    - navigation "Navegação principal" [ref=e117]:
      - list [ref=e118]:
        - listitem [ref=e119]:
          - link "Início" [ref=e120]:
            - /url: /
            - img [ref=e122]
            - generic [ref=e127]: Início
        - listitem [ref=e128]:
          - link "Alunos" [ref=e129]:
            - /url: /alunos
            - img [ref=e131]
            - generic [ref=e136]: Alunos
        - listitem [ref=e137]:
          - link "Frequência" [ref=e138]:
            - /url: /frequencia
            - img [ref=e140]
            - generic [ref=e143]: Frequência
        - listitem [ref=e144]:
          - link "Financeiro" [ref=e145]:
            - /url: /financeiro
            - img [ref=e147]
            - generic [ref=e149]: Financeiro
        - listitem [ref=e150]:
          - button "Abrir mais opções" [ref=e151] [cursor=pointer]:
            - img [ref=e152]
            - generic [ref=e156]: Mais
    - contentinfo [ref=e157]:
      - paragraph [ref=e158]:
        - text: Desenvolvido por
        - link "MtsFerreira" [ref=e159]:
          - /url: https://MtsFerreira.dev
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const SENHA = 'gemeos.com';
  4  | 
  5  | test('login mobile, input >=16px (sem zoom iOS), navega e vê footer', async ({ page }) => {
  6  |   await page.goto('/');
  7  | 
  8  |   const input = page.getByRole('textbox', { name: /senha/i });
  9  |   await expect(input).toBeVisible();
  10 |   // continua usando input para o restante do teste
  11 |   const fontSize = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  12 |   expect(fontSize).toBeGreaterThanOrEqual(16);
  13 | 
  14 |   await input.fill(SENHA);
  15 |   await page.getByRole('button', { name: /entrar/i }).click();
  16 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  17 | 
  18 |   await page.goto('/alunos');
> 19 |   await page.waitForLoadState('networkidle');
     |              ^ Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
  20 |   await expect(page.getByText(/Desenvolvido por MtsFerreira/i).first()).toBeVisible();
  21 | 
  22 |   // Sem scroll horizontal na raiz
  23 |   const overflow = await page.evaluate(() => ({
  24 |     scrollWidth: document.documentElement.scrollWidth,
  25 |     clientWidth: document.documentElement.clientWidth,
  26 |   }));
  27 |   expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);
  28 | });
  29 | 
  30 | test('botão de logout é touch-friendly (>= 36px) em mobile', async ({ page }) => {
  31 |   await page.goto('/');
  32 |   await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  33 |   await page.getByRole('button', { name: /entrar/i }).click();
  34 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  35 | 
  36 |   const logout = page.getByRole('button', { name: /sair/i });
  37 |   const box = await logout.boundingBox();
  38 |   expect(box).toBeTruthy();
  39 |   if (box) {
  40 |     expect(box.height).toBeGreaterThanOrEqual(32);
  41 |     expect(box.width).toBeGreaterThanOrEqual(32);
  42 |   }
  43 | });
  44 | 
  45 | test('dialog não estoura viewport em mobile', async ({ page }) => {
  46 |   await page.goto('/');
  47 |   await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  48 |   await page.getByRole('button', { name: /entrar/i }).click();
  49 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  50 | 
  51 |   await page.goto('/alunos');
  52 |   await page.waitForLoadState('networkidle');
  53 | 
  54 |   const novoBtn = page.getByRole('button', { name: /novo/i }).first();
  55 |   const visible = await novoBtn.isVisible().catch(() => false);
  56 |   test.skip(!visible, 'Botão "Novo" não encontrado em Alunos');
  57 | 
  58 |   await novoBtn.click();
  59 |   const dialog = page.locator('[role="dialog"]').first();
  60 |   await expect(dialog).toBeVisible({ timeout: 5000 });
  61 |   const box = await dialog.boundingBox();
  62 |   const viewport = page.viewportSize();
  63 |   expect(box && viewport).toBeTruthy();
  64 |   if (box && viewport) {
  65 |     expect(box.height).toBeLessThanOrEqual(viewport.height);
  66 |     expect(box.width).toBeLessThanOrEqual(viewport.width);
  67 |   }
  68 | });
  69 | 
```