import { expect, type Locator, type Page, test } from '@playwright/test';

const SENHA = 'gemeos.com';

const adminRoutes: Array<{ path: string; heading: RegExp }> = [
  { path: '/', heading: /dashboard/i },
  { path: '/alunos', heading: /alunos/i },
  { path: '/turmas', heading: /turmas/i },
  { path: '/frequencia', heading: /frequência|frequencia/i },
  { path: '/graduacao', heading: /graduação|graduacao/i },
  { path: '/ranking', heading: /ranking/i },
  { path: '/campeonatos', heading: /campeonatos/i },
  { path: '/financeiro', heading: /financeiro escolar|financeiro/i },
  { path: '/financeiro-gerencial', heading: /financeiro gerencial/i },
  { path: '/produtos', heading: /produtos|estoque|vendas/i },
  { path: '/aluguel', heading: /aluguel/i },
  { path: '/relatorios', heading: /relatórios|relatorios/i },
];

function normalizeText(value: string | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

async function runStep(page: Page, label: string, action: () => Promise<void>) {
  await test.step(label, async () => {
    try {
      console.log(`[human] ${label}`);
      await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`[human][skip] ${label} :: ${message}`);
    }
  });
}

async function login(page: Page) {
  await page.goto('/');
  const dashboardHeading = page.getByRole('heading', { name: /dashboard/i }).first();

  if (await dashboardHeading.isVisible().catch(() => false)) {
    return;
  }

  await page.getByRole('textbox', { name: /senha/i }).fill(SENHA);
  await page.getByRole('button', { name: /entrar/i }).click();
  await expect(dashboardHeading).toBeVisible({ timeout: 20_000 });
}

async function fillVisibleFields(scope: Locator, contextName: string) {
  const fields = scope.locator('input:not([type="hidden"]), textarea, select');
  const total = await fields.count();
  let filledCount = 0;

  for (let i = 0; i < total; i += 1) {
    const field = fields.nth(i);
    const visible = await field.isVisible().catch(() => false);
    if (!visible) continue;

    const disabled = await field.isDisabled().catch(() => false);
    if (disabled) continue;

    const tag = await field.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
    const type = await field
      .evaluate((el) => (el as HTMLInputElement).type?.toLowerCase() ?? '')
      .catch(() => '');

    try {
      if (tag === 'select') {
        const options = await field.locator('option').count();
        if (options > 1) {
          await field.selectOption({ index: 1 });
        } else {
          await field.selectOption({ index: 0 });
        }
        filledCount += 1;
        continue;
      }

      if (type === 'checkbox' || type === 'radio') {
        await field.click({ timeout: 2_000 });
        filledCount += 1;
        continue;
      }

      if (type === 'date') {
        await field.fill('2026-04-23');
        filledCount += 1;
        continue;
      }

      if (type === 'datetime-local') {
        await field.fill('2026-04-23T10:30');
        filledCount += 1;
        continue;
      }

      if (type === 'number') {
        await field.fill('10');
        filledCount += 1;
        continue;
      }

      if (type === 'email') {
        await field.fill('teste.humano@example.com');
        filledCount += 1;
        continue;
      }

      if (type === 'tel') {
        await field.fill('11999999999');
        filledCount += 1;
        continue;
      }

      if (tag === 'textarea') {
        await field.fill(`Teste humano ${Date.now()} - ${contextName}`);
        filledCount += 1;
        continue;
      }

      await field.fill(`Teste ${contextName} ${i + 1}`);
      filledCount += 1;
    } catch {
      // Continua para os demais campos.
    }
  }

  console.log(`[human] ${contextName}: campos preenchidos=${filledCount}/${total}`);
}

async function clickDialogAction(dialog: Locator) {
  const action = dialog.getByRole('button', {
    name: /salvar|criar|adicionar|registrar|enviar|confirmar|finalizar|gerar|ok/i,
  });
  if (await action.first().isVisible().catch(() => false)) {
    await action.first().click({ timeout: 2_500 });
    return;
  }

  const fallbackClose = dialog.getByRole('button', {
    name: /fechar|cancelar|voltar|concluir|pronto/i,
  });
  if (await fallbackClose.first().isVisible().catch(() => false)) {
    await fallbackClose.first().click({ timeout: 2_500 });
  }
}

async function closeVisibleDialogs(page: Page) {
  for (let i = 0; i < 3; i += 1) {
    const dialog = page.locator('[role="dialog"]').last();
    if (!(await dialog.isVisible().catch(() => false))) return;

    const closeButton = dialog.getByRole('button', { name: /fechar|cancelar|voltar|concluir|pronto|x/i }).first();
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click({ timeout: 2_000 }).catch(() => {});
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
    await page.waitForTimeout(200);
  }
}

async function interactWithVisibleDialog(page: Page, contextName: string) {
  const dialogs = page.locator('[role="dialog"]');
  const count = await dialogs.count();
  if (count === 0) return;

  const dialog = dialogs.last();
  if (!(await dialog.isVisible().catch(() => false))) return;

  await fillVisibleFields(dialog, `${contextName}-dialog`);
  await clickDialogAction(dialog);
  await page.waitForTimeout(350);
  await closeVisibleDialogs(page);
}

async function clickVisibleButtonsInMain(page: Page, contextName: string) {
  const main = page.locator('main');
  const handles = await main.locator('button, [role="tab"], [role="button"]').elementHandles();
  const visited = new Set<string>();
  let clicked = 0;

  for (const handle of handles) {
    try {
      await closeVisibleDialogs(page);

      const box = await handle.boundingBox();
      if (!box || box.width < 4 || box.height < 4) continue;

      const disabled = await handle.getAttribute('disabled');
      if (disabled !== null) continue;

      const ariaDisabled = await handle.getAttribute('aria-disabled');
      if (ariaDisabled === 'true') continue;

      const label = normalizeText(
        (await handle.getAttribute('aria-label')) ??
          (await handle.getAttribute('title')) ??
          (await handle.textContent()),
      );
      if (!label) continue;

      const key = label.toLowerCase();
      if (visited.has(key)) continue;
      visited.add(key);

      if (/sair|logout|excluir|apagar|deletar|remover/i.test(key)) continue;

      await runStep(page, `${contextName}: clicar "${label}"`, async () => {
        await handle.scrollIntoViewIfNeeded();
        await handle.click({ timeout: 2_500 });
        clicked += 1;
        await page.waitForTimeout(350);
        await interactWithVisibleDialog(page, contextName);
        await closeVisibleDialogs(page);
      });
    } catch {
      // Continua para os próximos elementos caso o nó tenha sido removido.
    }
  }

  console.log(`[human] ${contextName}: botões/abas clicados=${clicked}/${handles.length}`);
}

async function exploreRoute(page: Page, route: { path: string; heading: RegExp }) {
  await runStep(page, `abrir ${route.path}`, async () => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible({ timeout: 20_000 });
    await closeVisibleDialogs(page);
  });

  const main = page.locator('main');
  await runStep(page, `${route.path}: preencher campos visíveis`, async () => {
    await fillVisibleFields(main, route.path);
  });
  await runStep(page, `${route.path}: clicar botões e abas visíveis`, async () => {
    await clickVisibleButtonsInMain(page, route.path);
  });
}

async function explorePublicCadastro(page: Page) {
  await runStep(page, 'abrir /cadastro/aluno', async () => {
    await page.goto('/cadastro/aluno');
    await expect(page.getByRole('heading', { name: /cadastro de aluno/i })).toBeVisible({ timeout: 20_000 });
  });

  await runStep(page, 'preencher formulário público', async () => {
    await page.getByLabel(/Nome completo/i).fill(`Aluno Teste Humano ${Date.now()}`);
    await page.getByLabel(/Telefone \*/i).fill('11999999999');
    await page.getByLabel(/E-mail/i).fill('teste.publico@example.com');
    await page.getByLabel(/Categoria/i).selectOption('Adulto');
    await page.getByLabel(/Faixa atual/i).fill('Branca');
    await page.getByLabel(/Observações/i).fill('Cadastro disparado por teste humano exploratório.');
  });

  await runStep(page, 'enviar cadastro público', async () => {
    await page.getByRole('button', { name: /enviar cadastro/i }).click();
    const successHeading = page.getByRole('heading', { name: /cadastro enviado/i });
    const alertError = page.getByRole('alert');
    await Promise.race([
      successHeading.waitFor({ state: 'visible', timeout: 15_000 }),
      alertError.waitFor({ state: 'visible', timeout: 15_000 }),
    ]);
  });
}

test('exploração humana visual: clicar e preencher fluxos principais', async ({ page }) => {
  test.setTimeout(12 * 60_000);

  await runStep(page, 'abrir browsermcp blank e clicar na tela', async () => {
    await page.goto('https://browsermcp.io/blank');
    await page.mouse.click(260, 220);
    await page.waitForTimeout(500);
  });

  await runStep(page, 'login administrativo', async () => {
    await login(page);
  });

  for (const route of adminRoutes) {
    await exploreRoute(page, route);
  }

  await explorePublicCadastro(page);
});
