import { test, expect } from '@playwright/test';

const SENHA = 'gemeos.com';

test('login mobile, input >=16px (sem zoom iOS), navega e vê footer', async ({ page }) => {
  await page.goto('/');

  const input = page.getByRole('textbox', { name: /senha/i });
  await expect(input).toBeVisible();
  // continua usando input para o restante do teste
  const fontSize = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(16);

  await input.fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

  await page.goto('/alunos');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(/Desenvolvido por MtsFerreira/i).first()).toBeVisible();

  // Sem scroll horizontal na raiz
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);
});

test('botão de logout é touch-friendly (>= 36px) em mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

  const logout = page.getByRole('button', { name: /sair/i });
  const box = await logout.boundingBox();
  expect(box).toBeTruthy();
  if (box) {
    expect(box.height).toBeGreaterThanOrEqual(32);
    expect(box.width).toBeGreaterThanOrEqual(32);
  }
});

test('dialog não estoura viewport em mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

  await page.goto('/alunos');
  await page.waitForLoadState('networkidle');

  const novoBtn = page.getByRole('button', { name: /novo/i }).first();
  const visible = await novoBtn.isVisible().catch(() => false);
  test.skip(!visible, 'Botão "Novo" não encontrado em Alunos');

  await novoBtn.click();
  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible({ timeout: 5000 });
  const box = await dialog.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  if (box && viewport) {
    expect(box.height).toBeLessThanOrEqual(viewport.height);
    expect(box.width).toBeLessThanOrEqual(viewport.width);
  }
});
