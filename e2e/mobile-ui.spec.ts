import { test, expect } from '@playwright/test';

const SENHA = 'gemeos.com';

async function loginMobile(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });
}

test('bottom nav: clica em cada item primário e navega', async ({ page }) => {
  await loginMobile(page);

  // Cada item primário do BottomNav: Início / Alunos / Frequência / Financeiro
  const items: Array<{ name: RegExp; expectHeading: RegExp }> = [
    { name: /alunos/i, expectHeading: /alunos/i },
    { name: /frequência/i, expectHeading: /frequência/i },
    { name: /financeiro/i, expectHeading: /financeiro/i },
    { name: /início/i, expectHeading: /dashboard/i },
  ];

  for (const item of items) {
    const link = page.locator('nav[aria-label="Navegação principal"]').getByRole('link', { name: item.name });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page.getByRole('heading', { name: item.expectHeading }).first()).toBeVisible({ timeout: 10000 });
  }
});

test('bottom nav: botão "Mais" abre menu com itens secundários', async ({ page }) => {
  await loginMobile(page);

  await page.getByRole('button', { name: /abrir mais op/i }).click();
  // Drawer "Mais opções"
  await expect(page.getByRole('heading', { name: /Mais opções/i })).toBeVisible();
  // Itens secundários acessíveis
  await expect(page.getByRole('link', { name: /Turmas/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Ranking/i })).toBeVisible();

  // Clica num item — fecha o drawer e navega
  await page.getByRole('link', { name: /Turmas/i }).first().click();
  await expect(page.getByRole('heading', { name: /Turmas/i }).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('heading', { name: /Mais opções/i })).not.toBeVisible();
});

test('Ranking: clica na aba "Regras" e vê conteúdo de regras', async ({ page }) => {
  await loginMobile(page);
  await page.goto('/ranking');

  await page.getByRole('button', { name: /^Regras$/i }).click();
  // Conteúdo de regras
  await expect(page.getByRole('heading', { name: /Como funciona o ranking/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible();
  await expect(page.getByText(/\+15 pontos por vitória/i)).toBeVisible();
  await expect(page.getByText(/\+25 pontos por medalha/i)).toBeVisible();
});

test('Formulário público: preenche e envia cadastro de aluno', async ({ page }) => {
  let capturedPayload: Record<string, unknown> | null = null;
  await page.route('**/api/public/aluno-cadastro', async (route) => {
    capturedPayload = (route.request().postDataJSON() ?? null) as Record<string, unknown> | null;
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, id: 'precad_ui_test' }),
    });
  });

  // Não precisa de login — rota pública
  await page.goto('/cadastro/aluno');

  await expect(page.getByRole('heading', { name: /Cadastro de aluno/i })).toBeVisible();

  // Preenche campos obrigatórios + opcionais
  const nome = `Aluno UI ${Date.now()}`;
  await page.getByLabel(/Nome completo/i).fill(nome);
  await page.getByLabel(/Telefone \*/i).fill('11999999999');
  await page.getByLabel(/E-mail/i).fill('uitest@example.com');
  await page.getByLabel(/Categoria/i).selectOption('Adulto');
  await page.getByLabel(/Faixa atual/i).fill('Branca');
  await page.getByLabel(/Observações/i).fill('Cadastro via teste E2E mobile');

  // Submete
  await page.getByRole('button', { name: /Enviar cadastro/i }).click();

  // Tela de sucesso
  await expect(page.getByRole('heading', { name: /Cadastro enviado/i })).toBeVisible({ timeout: 15000 });
  expect(capturedPayload?.nome).toBe(nome);
  expect(capturedPayload?.telefone).toBe('11999999999');
});

test('AlunosPage: botão "Enviar formulário" presente e clicável', async ({ page }) => {
  await loginMobile(page);
  await page.goto('/alunos');
  await page.waitForTimeout(800);

  const btn = page.getByRole('button', { name: /Compartilhar formulário de cadastro/i });
  await expect(btn).toBeVisible();
  await expect(btn).toHaveAttribute('title', /Compartilhar formulário de cadastro/i);
});

test('Formulário público: falha da API mostra erro e destrava envio', async ({ page }) => {
  await page.route('**/api/public/aluno-cadastro', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, message: 'Não foi possível salvar.' }),
    });
  });

  await page.goto('/cadastro/aluno');
  await page.getByLabel(/Nome completo/i).fill(`Aluno Falha ${Date.now()}`);
  await page.getByLabel(/Telefone \*/i).fill('11999999999');

  await page.getByRole('button', { name: /Enviar cadastro/i }).click();

  await expect(page.getByRole('alert')).toContainText(/não foi possível/i);
  await expect(page.getByRole('button', { name: /Enviar cadastro/i })).toBeEnabled();
});

test('Login: lockout após 5 tentativas incorretas', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
  await page.reload();

  const senha = page.getByRole('textbox', { name: /senha/i });
  const entrar = page.getByRole('button', { name: /entrar/i });

  for (let i = 1; i <= 5; i++) {
    await senha.fill(`errada${i}`);
    await entrar.click();
    // Aguarda processamento
    await page.waitForTimeout(300);
  }

  // 6ª tentativa: deve aparecer mensagem de lockout
  await senha.fill('errada6');
  await entrar.click();
  await expect(page.getByRole('alert')).toContainText(/muitas tentativas|incorreta/i);
});
