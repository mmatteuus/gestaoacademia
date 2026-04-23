import { test, expect } from '@playwright/test';

const SENHA = 'gemeos.com';

test('login exige senha correta, navega e faz logout', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Gêmeos Academia/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /senha/i })).toBeVisible();

  // Senha errada
  await page.getByRole('textbox', { name: /senha/i }).fill('errada');
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('alert')).toContainText(/incorreta/i);

  // Senha correta
  await page.getByRole('textbox', { name: /senha/i }).fill('');
  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });

  // Navega pelas páginas
  const rotas = ['/alunos', '/turmas', '/frequencia', '/financeiro', '/produtos', '/ranking', '/relatorios'];
  for (const r of rotas) {
    await page.goto(r);
    await expect(page.getByText(/Desenvolvido por MtsFerreira/i).first()).toBeVisible({ timeout: 10000 });
  }

  // Logout
  await page.goto('/');
  await page.locator('header button[aria-label="Sair"]').click();
  await expect(page.getByRole('textbox', { name: /senha/i })).toBeVisible({ timeout: 10000 });
});

test('zoom não está bloqueado (viewport meta)', async ({ page }) => {
  await page.goto('/');
  const content = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(content).toBeTruthy();
  expect(content).not.toContain('maximum-scale');
  expect(content).not.toMatch(/user-scalable\s*=\s*(0|no)/i);
});

test('bundle não expõe senha em texto puro', async ({ page, request }) => {
  await page.goto('/');
  const scripts = await page.locator('script[src]').evaluateAll((els) =>
    els.map((e) => (e as HTMLScriptElement).src)
  );
  let found = false;
  for (const src of scripts) {
    const res = await request.get(src);
    const text = await res.text();
    if (/['"]gemeos\.com['"]/.test(text)) {
      found = true;
      break;
    }
  }
  expect(found).toBe(false);
});

test('persistência — sessão mantém no reload, cai ao limpar storage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });

  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await expect(page.getByRole('textbox', { name: /senha/i })).toBeVisible();
});
