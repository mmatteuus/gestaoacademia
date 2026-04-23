# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: desktop.spec.ts >> login exige senha correta, navega e faz logout
- Location: e2e\desktop.spec.ts:5:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
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
          - heading "Frequencia" [level=2] [ref=e12]
      - generic [ref=e13]:
        - generic [ref=e14]:
          - img [ref=e15]
          - textbox "Buscar alunos, turmas, produtos..." [ref=e18]
        - button "Tema escuro ativo. Alternar para claro" [ref=e19] [cursor=pointer]:
          - img
        - button "Sair" [ref=e20] [cursor=pointer]:
          - img
    - main [ref=e21]:
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - heading "Frequência" [level=1] [ref=e26]
            - paragraph [ref=e27]: Lançamento e acompanhamento de presença
          - button "Lançar Presença" [ref=e29] [cursor=pointer]:
            - img
            - text: Lançar Presença
        - generic [ref=e30]:
          - button "Turma E2E" [ref=e31] [cursor=pointer]
          - button "Turma E2E" [ref=e32] [cursor=pointer]
          - button "Turma E2E" [ref=e33] [cursor=pointer]
          - button "Turma E2E" [ref=e34] [cursor=pointer]
          - button "Turma E2E" [ref=e35] [cursor=pointer]
          - button "Turma E2E" [ref=e36] [cursor=pointer]
          - button "Turma E2E" [ref=e37] [cursor=pointer]
          - button "Turma Exemplo" [ref=e38] [cursor=pointer]
          - button "Turma E2E" [ref=e39] [cursor=pointer]
          - button "Turma E2E" [ref=e40] [cursor=pointer]
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]:
              - img [ref=e45]
              - generic [ref=e48]: 2026-04-22
              - generic [ref=e49]: • Prof E2E
            - generic [ref=e50]: 1/1 presentes
          - generic [ref=e52]:
            - img [ref=e53]
            - generic [ref=e56]: Aluno E2E Dashboard
    - navigation "Navegação principal" [ref=e57]:
      - list [ref=e58]:
        - listitem [ref=e59]:
          - link "Início" [ref=e60] [cursor=pointer]:
            - /url: /
            - img [ref=e62]
            - generic [ref=e67]: Início
        - listitem [ref=e68]:
          - link "Alunos" [ref=e69] [cursor=pointer]:
            - /url: /alunos
            - img [ref=e71]
            - generic [ref=e76]: Alunos
        - listitem [ref=e77]:
          - link "Frequência" [ref=e78] [cursor=pointer]:
            - /url: /frequencia
            - img [ref=e80]
            - generic [ref=e83]: Frequência
        - listitem [ref=e84]:
          - link "Financeiro" [ref=e85] [cursor=pointer]:
            - /url: /financeiro
            - img [ref=e87]
            - generic [ref=e89]: Financeiro
        - listitem [ref=e90]:
          - button "Abrir mais opções" [ref=e91] [cursor=pointer]:
            - img [ref=e92]
            - generic [ref=e96]: Mais
    - contentinfo [ref=e97]:
      - paragraph [ref=e98]:
        - text: Desenvolvido por
        - link "MtsFerreira" [ref=e99] [cursor=pointer]:
          - /url: https://MtsFerreira.dev
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const SENHA = 'gemeos.com';
  4  | 
  5  | test('login exige senha correta, navega e faz logout', async ({ page }) => {
  6  |   await page.goto('/');
  7  | 
  8  |   await expect(page.getByRole('heading', { name: /Gêmeos Academia/i })).toBeVisible();
  9  |   await expect(page.getByRole('textbox', { name: /senha/i })).toBeVisible();
  10 | 
  11 |   // Senha errada
  12 |   await page.getByRole('textbox', { name: /senha/i }).fill('errada');
  13 |   await page.getByRole('button', { name: /entrar/i }).click();
  14 |   await expect(page.getByRole('alert')).toContainText(/incorreta/i);
  15 | 
  16 |   // Senha correta
  17 |   await page.getByRole('textbox', { name: /senha/i }).fill('');
  18 |   await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  19 |   await page.getByRole('button', { name: /entrar/i }).click();
  20 | 
  21 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  22 | 
  23 |   // Navega pelas páginas
  24 |   const rotas = ['/alunos', '/turmas', '/frequencia', '/financeiro', '/produtos', '/ranking', '/relatorios'];
  25 |   for (const r of rotas) {
  26 |     await page.goto(r);
> 27 |     await page.waitForLoadState('networkidle');
     |                ^ Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
  28 |     await expect(page.getByText(/Desenvolvido por MtsFerreira/i).first()).toBeVisible();
  29 |   }
  30 | 
  31 |   // Logout
  32 |   await page.goto('/');
  33 |   await page.locator('header button[aria-label="Sair"]').click();
  34 |   await expect(page.getByRole('textbox', { name: /senha/i })).toBeVisible({ timeout: 10000 });
  35 | });
  36 | 
  37 | test('zoom não está bloqueado (viewport meta)', async ({ page }) => {
  38 |   await page.goto('/');
  39 |   const content = await page.locator('meta[name="viewport"]').getAttribute('content');
  40 |   expect(content).toBeTruthy();
  41 |   expect(content).not.toContain('maximum-scale');
  42 |   expect(content).not.toContain('user-scalable=0');
  43 | });
  44 | 
  45 | test('bundle não expõe senha em texto puro', async ({ page, request }) => {
  46 |   await page.goto('/');
  47 |   const scripts = await page.locator('script[src]').evaluateAll((els) =>
  48 |     els.map((e) => (e as HTMLScriptElement).src)
  49 |   );
  50 |   let found = false;
  51 |   for (const src of scripts) {
  52 |     const res = await request.get(src);
  53 |     const text = await res.text();
  54 |     if (/['"]gemeos\.com['"]/.test(text)) {
  55 |       found = true;
  56 |       break;
  57 |     }
  58 |   }
  59 |   expect(found).toBe(false);
  60 | });
  61 | 
  62 | test('persistência — sessão mantém no reload, cai ao limpar storage', async ({ page }) => {
  63 |   await page.goto('/');
  64 |   await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  65 |   await page.getByRole('button', { name: /entrar/i }).click();
  66 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  67 | 
  68 |   await page.reload();
  69 |   await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  70 | 
  71 |   await page.evaluate(() => sessionStorage.clear());
  72 |   await page.reload();
  73 |   await expect(page.getByRole('textbox', { name: /senha/i })).toBeVisible();
  74 | });
  75 | 
```