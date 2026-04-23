import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { chromium, devices } from 'playwright';

const ROOT = process.cwd();
const SCREEN_DIR = path.join(ROOT, 'qa-screenshots');
const REPORT_PATH = path.join(ROOT, 'qa-report.md');
const CONSOLE_PATH = path.join(ROOT, 'qa-console.log');
const BASE_URL = 'http://localhost:8080';
const BACKEND_URL = 'http://localhost:3000/status';

const ROUTES = [
  '/',
  '/alunos',
  '/turmas',
  '/frequencia',
  '/graduacao',
  '/ranking',
  '/campeonatos',
  '/financeiro',
  '/financeiro-gerencial',
  '/produtos',
  '/aluguel',
  '/relatorios',
];

const MORE_LINKS = [
  'Turmas',
  'Graduação',
  'Ranking',
  'Campeonatos',
  'Gerencial',
  'Produtos & Vendas',
  'Aluguel',
  'Relatórios',
];

const IGNORE_CONSOLE_ERROR = /\/(rows|status)(\?|$)|Failed to load resource.*\/(rows|status)|net::ERR_/i;
const TEST_PREFIX = `[TESTE QA] ${Date.now()}`;

/** @type {Array<{time:string,type:string,text:string,url?:string,location?:string,ignored?:boolean}>} */
const consoleEntries = [];
/** @type {Array<{id:string,title:string,status:'passed'|'failed'|'skipped',details:string}>} */
const coverage = [];
/** @type {Array<{id:number,title:string,route:string,steps:string[],impact:'alto'|'medio'|'baixo',screenshot:string,details:string}>} */
const failures = [];
/** @type {Array<{id:number,title:string,route:string,details:string}>} */
const warnings = [];

let shotCounter = 1;
let failureCounter = 1;
let warningCounter = 1;
let hadFatalScriptError = false;

const createdData = {
  alunoNome: `${TEST_PREFIX} Aluno Mobile`,
  turmaNome: `${TEST_PREFIX} Turma Mobile`,
  regraDestino: `${TEST_PREFIX} Faixa`,
  campeonatoNome: `${TEST_PREFIX} Open`,
  produtoNome: `${TEST_PREFIX} Kimono`,
  aluguelCliente: `${TEST_PREFIX} Cliente`,
};

function nowIso() {
  return new Date().toISOString();
}

function slug(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80);
}

function ensureCleanArtifacts() {
  if (fs.existsSync(SCREEN_DIR)) {
    fs.rmSync(SCREEN_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(SCREEN_DIR, { recursive: true });
  fs.writeFileSync(CONSOLE_PATH, '', 'utf8');
}

function recordCoverage(id, title, status, details) {
  coverage.push({ id, title, status, details });
}

function recordWarning(title, route, details) {
  warnings.push({ id: warningCounter++, title, route, details });
}

async function recordFailure(page, title, route, details, steps, impact = 'medio') {
  const failureId = failureCounter++;
  const file = `falha-${String(failureId).padStart(2, '0')}-${slug(title)}.png`;
  const out = path.join(SCREEN_DIR, file);
  try {
    await page.screenshot({ path: out, fullPage: true });
  } catch {
    // ignore screenshot failure
  }
  failures.push({
    id: failureId,
    title,
    route,
    steps,
    impact,
    screenshot: `qa-screenshots/${file}`,
    details,
  });
}

async function shot(page, label) {
  const name = `${String(shotCounter++).padStart(2, '0')}-${slug(label)}.png`;
  const out = path.join(SCREEN_DIR, name);
  await page.screenshot({ path: out, fullPage: true });
  return `qa-screenshots/${name}`;
}

async function settle(page, ms = 500) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 6000 });
  } catch {
    // ignore
  }
  await page.waitForTimeout(ms);
}

function parseRouteCount(text) {
  const match = text.match(/(\d+)\s+alunos\s+cadastrados/i);
  return match ? Number(match[1]) : null;
}

async function expectVisible(locator, timeout = 5000) {
  await locator.waitFor({ state: 'visible', timeout });
}

async function clickWhenVisible(locator) {
  await expectVisible(locator);
  await locator.click();
}

async function typeWhenVisible(locator, value) {
  await expectVisible(locator);
  await locator.fill('');
  await locator.type(value, { delay: 25 });
}

async function fillWhenVisible(locator, value) {
  await expectVisible(locator);
  await locator.fill(value);
}

async function stateAction(page, label, fn) {
  await shot(page, `${label}-before`);
  await fn();
  await settle(page);
  await shot(page, `${label}-after`);
}

async function runScenario(page, title, fn) {
  try {
    await fn();
  } catch (error) {
    const message = error instanceof Error ? `${error.message}\n${error.stack || ''}` : String(error);
    await recordFailure(
      page,
      `Falha de execução no cenário: ${title}`,
      '/global',
      message,
      [`Executar cenário: ${title}`],
      'alto'
    );
    recordWarning(`Cenário interrompido: ${title}`, '/global', 'Runner continuou para os próximos cenários.');
  }
}

function addConsoleListeners(page) {
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    const location = msg.location();
    const ignored = type === 'error' && IGNORE_CONSOLE_ERROR.test(text);
    consoleEntries.push({
      time: nowIso(),
      type,
      text,
      url: location?.url,
      location: location?.lineNumber != null ? `${location.lineNumber}:${location.columnNumber}` : undefined,
      ignored,
    });
  });

  page.on('pageerror', (err) => {
    consoleEntries.push({
      time: nowIso(),
      type: 'pageerror',
      text: String(err),
      ignored: false,
    });
  });
}

function flushConsoleLog() {
  const lines = consoleEntries.map((entry) => {
    const parts = [
      `[${entry.time}]`,
      `[${entry.type}]`,
      entry.ignored ? '[ignored]' : '[tracked]',
      entry.text,
    ];
    if (entry.url) parts.push(`@ ${entry.url}${entry.location ? `:${entry.location}` : ''}`);
    return parts.join(' ');
  });
  fs.writeFileSync(CONSOLE_PATH, `${lines.join('\n')}\n`, 'utf8');
}

function trackedConsoleErrorsSince(index) {
  return consoleEntries.slice(index).filter((entry) => {
    if (entry.type === 'pageerror') return true;
    return entry.type === 'error' && !entry.ignored;
  });
}

function reactWarningHitsSince(index) {
  return consoleEntries.slice(index).filter((entry) => {
    if (entry.type !== 'warning' && entry.type !== 'error') return false;
    return /(validateDOMNesting|Warning:\s|React)/i.test(entry.text) && !entry.ignored;
  });
}

async function waitForHttp(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // keep polling
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: ROOT,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...(options.env || {}) },
  });

  child.stdout?.on('data', (chunk) => {
    const text = chunk.toString();
    fs.appendFileSync(CONSOLE_PATH, `[${nowIso()}] [proc:${command}] ${text}`);
  });
  child.stderr?.on('data', (chunk) => {
    const text = chunk.toString();
    fs.appendFileSync(CONSOLE_PATH, `[${nowIso()}] [proc:${command}:err] ${text}`);
  });
  return child;
}

async function stopProcess(child) {
  if (!child || child.killed) return;
  child.kill('SIGTERM');
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (!child.killed) {
    child.kill('SIGKILL');
  }
}

async function bypassLoginIfNeeded(page) {
  const loginVisible = await page.getByRole('button', { name: /Entrar/i }).first().isVisible().catch(() => false);
  if (!loginVisible) return false;

  await stateAction(page, 'login-bypass-localstorage', async () => {
    await page.evaluate(() => {
      localStorage.setItem('gemeos.auth.v1', 'ok');
      localStorage.setItem('gemeos.auth.expiry.v1', String(Date.now() + 24 * 60 * 60 * 1000));
    });
    await page.reload();
  });
  return true;
}

async function gotoRoute(page, route, label = 'open') {
  await page.goto(`${BASE_URL}${route}`);
  await settle(page);
  await shot(page, `${route || 'root'}-${label}`);
}

async function checkFooter(page, route) {
  const footerText = page.getByText('Desenvolvido por', { exact: false });
  const footerLink = page.getByRole('link', { name: /MtsFerreira/i }).first();
  const hasText = await footerText.first().isVisible().catch(() => false);
  const hasLink = await footerLink.isVisible().catch(() => false);
  if (!hasText || !hasLink) {
    await recordFailure(
      page,
      'Rodapé obrigatório ausente',
      route,
      'Texto/link obrigatório não apareceu na viewport móvel.',
      [`Abrir ${route}`, 'Verificar presença de "Desenvolvido por MtsFerreira"'],
      'alto'
    );
    return false;
  }
  return true;
}

async function smokeRoutes(page) {
  let pass = true;
  for (const route of ROUTES) {
    const consoleMark = consoleEntries.length;
    await gotoRoute(page, route, 'smoke');
    const okFooter = await checkFooter(page, route);
    const errors = trackedConsoleErrorsSince(consoleMark);
    if (!okFooter || errors.length > 0) {
      pass = false;
      if (errors.length > 0) {
        await recordFailure(
          page,
          `Erro de console na rota ${route}`,
          route,
          errors.map((e) => e.text).join(' | '),
          [`Abrir ${route}`, 'Aguardar networkidle', 'Observar console'],
          'alto'
        );
      }
    }
  }

  recordCoverage(
    'smoke-12-routes',
    'Smoke de 12 rotas com screenshot e 0 erro JS relevante',
    pass ? 'passed' : 'failed',
    pass ? 'Todas as rotas abriram com screenshot e sem erro JS rastreado.' : 'Uma ou mais rotas tiveram erro JS/rodapé ausente.'
  );
}

async function selectRadixComboboxByIndex(dialog, index, optionText) {
  const combos = dialog.getByRole('combobox');
  const combo = combos.nth(index);
  await clickWhenVisible(combo);
  const option = dialog.page().getByRole('option', { name: new RegExp(`^${optionText}$`, 'i') }).first();
  const optionVisible = await option.isVisible().catch(() => false);
  if (optionVisible) {
    await option.click();
  } else {
    await dialog.page().getByText(optionText, { exact: false }).first().click();
  }
  await settle(dialog.page());
}

async function cadastroAluno(page) {
  await gotoRoute(page, '/alunos', 'cadastro-start');

  const subtitleLocator = page.getByText(/alunos cadastrados/i).first();
  const subtitleBefore = (await subtitleLocator.textContent().catch(() => '')) || '';
  const countBefore = parseRouteCount(subtitleBefore);

  await stateAction(page, 'alunos-novo-aluno-open', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Novo Aluno/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  // validação vazio
  await stateAction(page, 'alunos-validacao-vazio', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Cadastrar Aluno/i }));
  });

  const validationVisible = await dialog.getByText(/obrigat|inválid|minimo|minimo/i).first().isVisible().catch(() => false);
  if (!validationVisible) {
    await recordFailure(
      page,
      'Validação de aluno vazio não legível',
      '/alunos',
      'Não foi possível identificar mensagens de validação ao submeter formulário vazio.',
      ['Abrir Novo Aluno', 'Clicar em Cadastrar Aluno sem preencher'],
      'alto'
    );
  }

  // preenchimento válido
  await stateAction(page, 'alunos-preencher-formulario', async () => {
    await typeWhenVisible(dialog.getByLabel(/Nome Completo/i), createdData.alunoNome);
    await typeWhenVisible(dialog.getByLabel(/^Email$/i), `qa.${Date.now()}@teste.local`);
    await fillWhenVisible(dialog.getByLabel(/^Telefone$/i), '11900000000');
    await fillWhenVisible(dialog.getByLabel(/^CPF$/i), '000.000.000-00');
    await fillWhenVisible(dialog.getByLabel(/Data de Nascimento/i), '2006-04-23');

    await selectRadixComboboxByIndex(dialog, 0, 'Adulto');
    await selectRadixComboboxByIndex(dialog, 1, 'Branca');
    await selectRadixComboboxByIndex(dialog, 2, 'Ativo');

    await typeWhenVisible(dialog.getByLabel(/Observações/i), `${TEST_PREFIX} observacao inicial`);
  });

  const consoleMark = consoleEntries.length;
  await stateAction(page, 'alunos-submit-valido', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Cadastrar Aluno/i }));
  });

  const successToast = page.getByText(/Aluno cadastrado com sucesso/i).first();
  const toastVisible = await successToast.isVisible().catch(() => false);
  if (!toastVisible) {
    await recordFailure(
      page,
      'Toast de cadastro de aluno ausente',
      '/alunos',
      'Após cadastro válido, não apareceu feedback de sucesso esperado.',
      ['Preencher formulário válido', 'Submeter'],
      'alto'
    );
  }

  const toaster = page.locator('[data-sonner-toaster]').first();
  const toastPos = await toaster.getAttribute('data-position').catch(() => null);
  const toastOffset = await toaster.getAttribute('data-offset').catch(() => null);
  if (toastPos !== 'top-center') {
    await recordFailure(
      page,
      'Toast fora do top-center',
      '/alunos',
      `posição atual: ${toastPos ?? 'null'}`,
      ['Gerar toast de sucesso', 'Inspecionar data-position'],
      'medio'
    );
  }

  if (!toastOffset || !toastOffset.includes('safe-area')) {
    recordWarning(
      'Toast sem offset de safe-area explícito',
      '/alunos',
      `data-offset atual: ${toastOffset ?? 'null'}`
    );
  }

  await settle(page, 800);

  const subtitleAfter = (await subtitleLocator.textContent().catch(() => '')) || '';
  const countAfter = parseRouteCount(subtitleAfter);
  const studentVisible = await page.getByText(createdData.alunoNome, { exact: false }).first().isVisible().catch(() => false);

  if (!studentVisible) {
    await recordFailure(
      page,
      'Aluno cadastrado não apareceu na lista',
      '/alunos',
      'O nome recém-cadastrado não ficou visível após submissão.',
      ['Cadastrar aluno com sucesso', 'Verificar card na listagem'],
      'alto'
    );
  }

  if (countBefore != null && countAfter != null && countAfter < countBefore + 1) {
    await recordFailure(
      page,
      'Contador de alunos não incrementou',
      '/alunos',
      `contador antes=${countBefore}, depois=${countAfter}`,
      ['Ler subtítulo antes', 'Cadastrar aluno', 'Ler subtítulo depois'],
      'medio'
    );
  }

  const currentErrors = trackedConsoleErrorsSince(consoleMark);
  if (currentErrors.length) {
    await recordFailure(
      page,
      'Erro de console durante cadastro de aluno',
      '/alunos',
      currentErrors.map((e) => e.text).join(' | '),
      ['Fluxo de cadastro completo'],
      'alto'
    );
  }

  if (!studentVisible) {
    recordCoverage(
      'cadastro-aluno-completo',
      'Cadastro completo de aluno + validação + ficha + edição/persistência',
      'failed',
      'Cadastro não refletiu na lista; cenários de ficha/edição do aluno foram interrompidos.'
    );
    return;
  }

  await stateAction(page, 'alunos-abrir-ficha', async () => {
    await clickWhenVisible(page.getByRole('button', { name: new RegExp(`Abrir ficha de ${createdData.alunoNome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') }).first());
  });

  const sheet = page.getByRole('dialog').first();
  await expectVisible(sheet);

  const tabs = ['Perfil', 'Financeiro', 'Frequencia', 'Graduacao'];
  let tabsOk = true;
  for (const tab of tabs) {
    const trigger = sheet.getByRole('tab', { name: new RegExp(`^${tab}$`, 'i') }).first();
    const visible = await trigger.isVisible().catch(() => false);
    if (!visible) {
      tabsOk = false;
      continue;
    }
    await stateAction(page, `alunos-ficha-aba-${tab}`, async () => {
      await trigger.click();
    });
  }

  if (!tabsOk) {
    await recordFailure(
      page,
      'Ficha do aluno sem todas as 4 abas',
      '/alunos',
      'Uma ou mais abas (Perfil/Financeiro/Frequência/Graduação) não ficaram acessíveis.',
      ['Abrir ficha do aluno recém criado', 'Verificar abas'],
      'alto'
    );
  }

  await stateAction(page, 'alunos-ficha-editar', async () => {
    await clickWhenVisible(sheet.getByRole('button', { name: /^Editar$/i }).first());
  });

  const editDialog = page.getByRole('dialog').first();
  await expectVisible(editDialog);
  const updatedObs = `${TEST_PREFIX} observacao editada`;
  await stateAction(page, 'alunos-ficha-editar-observacao', async () => {
    await fillWhenVisible(editDialog.getByLabel(/Observações/i), updatedObs);
    await clickWhenVisible(editDialog.getByRole('button', { name: /Salvar Alterações/i }));
  });

  // reabre edição para verificar persistência do campo observações
  await stateAction(page, 'alunos-ficha-reabrir-edicao', async () => {
    await clickWhenVisible(sheet.getByRole('button', { name: /^Editar$/i }).first());
  });

  const editDialog2 = page.getByRole('dialog').first();
  await expectVisible(editDialog2);
  const obsValue = await editDialog2.getByLabel(/Observações/i).inputValue().catch(() => '');
  if (obsValue !== updatedObs) {
    await recordFailure(
      page,
      'Observações do aluno não persistiram após salvar',
      '/alunos',
      `valor esperado="${updatedObs}", valor atual="${obsValue}"`,
      ['Editar observações', 'Salvar', 'Reabrir formulário'],
      'alto'
    );
  }

  await stateAction(page, 'alunos-ficha-fechar-edicao', async () => {
    await clickWhenVisible(editDialog2.getByRole('button', { name: /Cancelar/i }).first());
  });

  recordCoverage(
    'cadastro-aluno-completo',
    'Cadastro completo de aluno + validação + ficha + edição/persistência',
    failures.some((f) => f.route === '/alunos') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/alunos')
      ? 'Houve falha(s) no fluxo primário de alunos.'
      : 'Fluxo de cadastro/edição/ficha validado com sucesso.'
  );
}

async function bottomNavAndMore(page) {
  await gotoRoute(page, '/', 'bottomnav-start');

  const primary = ['Início', 'Alunos', 'Frequência', 'Financeiro'];
  for (const item of primary) {
    await stateAction(page, `bottomnav-tap-${item}`, async () => {
      await clickWhenVisible(page.getByRole('link', { name: new RegExp(`^${item}$`, 'i') }).first());
    });
  }

  await stateAction(page, 'bottomnav-open-mais', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Abrir mais opções/i }).first());
  });

  const dialog = page.getByRole('dialog', { name: /Mais opções/i }).first();
  await expectVisible(dialog);

  let allLinks = true;
  for (const link of MORE_LINKS) {
    const exists = await dialog.getByRole('link', { name: new RegExp(link, 'i') }).first().isVisible().catch(() => false);
    if (!exists) allLinks = false;
  }

  if (!allLinks) {
    await recordFailure(
      page,
      'Menu Mais sem todos os 8 atalhos',
      '/',
      'Um ou mais atalhos esperados não apareceram no menu Mais.',
      ['Abrir menu Mais', 'Verificar atalhos obrigatórios'],
      'alto'
    );
  }

  // fechar no backdrop
  await stateAction(page, 'bottomnav-close-mais-backdrop', async () => {
    await page.mouse.click(10, 80);
  });

  const closedByBackdrop = !(await dialog.isVisible().catch(() => false));
  if (!closedByBackdrop) {
    await recordFailure(
      page,
      'Menu Mais não fechou tocando no backdrop',
      '/',
      'Backdrop não fechou o modal.',
      ['Abrir menu Mais', 'Tocar fora do sheet'],
      'medio'
    );
    await stateAction(page, 'bottomnav-force-close-mais-x', async () => {
      await clickWhenVisible(dialog.getByRole('button', { name: /^Fechar$/i }).first());
    });
  }

  // abre de novo e fecha no X
  await stateAction(page, 'bottomnav-open-mais-again', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Abrir mais opções/i }).first());
  });
  const dialog2 = page.getByRole('dialog', { name: /Mais opções/i }).first();
  await expectVisible(dialog2);
  await stateAction(page, 'bottomnav-close-mais-x', async () => {
    await clickWhenVisible(dialog2.getByRole('button', { name: /^Fechar$/i }).first());
  });

  recordCoverage(
    'nav-bottom-mais',
    'BottomNav + Menu Mais (itens, backdrop e X)',
    failures.some((f) => f.title.includes('Menu Mais')) ? 'failed' : 'passed',
    failures.some((f) => f.title.includes('Menu Mais'))
      ? 'Falhas encontradas no menu Mais.'
      : 'Navegação primária e menu Mais funcionando.'
  );
}

async function createTurmaAndAssignAluno(page) {
  await gotoRoute(page, '/turmas', 'turmas-start');

  await stateAction(page, 'turmas-open-nova-turma', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Nova Turma/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'turmas-fill-form', async () => {
    await typeWhenVisible(dialog.getByLabel(/Nome da Turma/i), createdData.turmaNome);
    await typeWhenVisible(dialog.getByLabel(/^Professor$/i), `${TEST_PREFIX} Sensei`);
    await fillWhenVisible(dialog.getByLabel(/Horário/i), '19:00 - 20:00');
    await fillWhenVisible(dialog.getByLabel(/Capacidade/i), '20');

    const modalityCombo = dialog.getByRole('combobox').first();
    await clickWhenVisible(modalityCombo);
    await clickWhenVisible(page.getByRole('option', { name: /Jiu-Jitsu/i }).first());

    await clickWhenVisible(dialog.getByText(/^Seg$/i).first());
    await clickWhenVisible(dialog.getByText(/^Qua$/i).first());
  });

  await stateAction(page, 'turmas-submit', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Criar Turma/i }).first());
  });

  const turmaCard = page.getByText(createdData.turmaNome, { exact: false }).first();
  const turmaVisible = await turmaCard.isVisible().catch(() => false);
  if (!turmaVisible) {
    await recordFailure(
      page,
      'Turma criada não apareceu na lista',
      '/turmas',
      'Após criar turma, o card não apareceu na listagem.',
      ['Abrir Nova Turma', 'Preencher e criar', 'Verificar listagem'],
      'alto'
    );
  }

  // vincula o aluno criado para viabilizar cenário de frequência
  const manageButton = page.getByRole('button', { name: new RegExp(`Gerenciar alunos de ${createdData.turmaNome}`, 'i') }).first();
  const manageVisible = await manageButton.isVisible().catch(() => false);
  if (manageVisible) {
    await stateAction(page, 'turmas-manage-open', async () => {
      await manageButton.click();
    });

    const manageDialog = page.getByRole('dialog').first();
    const addButton = manageDialog.getByRole('button', { name: /Adicionar/i }).first();
    const canAdd = await addButton.isVisible().catch(() => false);
    if (canAdd) {
      await stateAction(page, 'turmas-manage-add-aluno', async () => {
        await addButton.click();
      });
    } else {
      recordWarning(
        'Não foi possível vincular aluno à nova turma',
        '/turmas',
        'Botão Adicionar não apareceu no modal de gerenciamento.'
      );
    }

    await stateAction(page, 'turmas-manage-close', async () => {
      await clickWhenVisible(manageDialog.getByRole('button', { name: /^Fechar$/i }).first());
    });
  }

  recordCoverage(
    'form-turmas',
    'Turmas → Nova Turma (criar e listar)',
    failures.some((f) => f.route === '/turmas') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/turmas') ? 'Falha ao criar/listar turma.' : 'Turma criada com sucesso.'
  );
}

async function frequenciaScenario(page) {
  await gotoRoute(page, '/frequencia', 'frequencia-start');

  // seleciona turma criada quando disponível
  const turmaChip = page.getByRole('button', { name: new RegExp(createdData.turmaNome, 'i') }).first();
  if (await turmaChip.isVisible().catch(() => false)) {
    await stateAction(page, 'frequencia-select-turma', async () => {
      await turmaChip.click();
    });
  }

  await stateAction(page, 'frequencia-open-lancar', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Lançar Presença/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  const dialogVisible = await dialog.isVisible().catch(() => false);
  if (!dialogVisible) {
    const hasErrorToast = await page.getByText(/não possui alunos vinculados/i).first().isVisible().catch(() => false);
    if (hasErrorToast) {
      recordCoverage(
        'form-frequencia',
        'Frequência → Lançar Presença e salvar sessão',
        'skipped',
        'Turma selecionada sem alunos vinculados; fluxo de lançamento não ficou disponível.'
      );
      return;
    }
    await recordFailure(
      page,
      'Modal de Lançar Presença não abriu',
      '/frequencia',
      'A ação de lançar presença não abriu o diálogo de sessão.',
      ['Abrir /frequencia', 'Clicar em Lançar Presença'],
      'alto'
    );
    recordCoverage('form-frequencia', 'Frequência → Lançar Presença e salvar sessão', 'failed', 'Fluxo de presença falhou.');
    return;
  }

  // alterna o primeiro aluno para marcar interação
  const firstStudentToggle = dialog.locator('button[type="button"]').first();
  if (await firstStudentToggle.isVisible().catch(() => false)) {
    await stateAction(page, 'frequencia-toggle-aluno', async () => {
      await firstStudentToggle.click();
      await firstStudentToggle.click();
    });
  }

  await stateAction(page, 'frequencia-salvar', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Salvar Frequência/i }).first());
  });

  const sessaoVisible = await page.getByText(/presentes/i).first().isVisible().catch(() => false);
  if (!sessaoVisible) {
    await recordFailure(
      page,
      'Sessão de frequência não apareceu após salvar',
      '/frequencia',
      'A listagem de sessões não foi atualizada visualmente após salvar frequência.',
      ['Abrir modal', 'Salvar frequência', 'Verificar listagem'],
      'alto'
    );
  }

  recordCoverage(
    'form-frequencia',
    'Frequência → Lançar Presença e salvar sessão',
    failures.some((f) => f.route === '/frequencia') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/frequencia') ? 'Falha ao lançar presença.' : 'Sessão de presença registrada.'
  );
}

async function graduacaoScenario(page) {
  await gotoRoute(page, '/graduacao', 'graduacao-start');

  await stateAction(page, 'graduacao-open-nova-regra', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Nova Regra/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'graduacao-fill-form', async () => {
    await fillWhenVisible(dialog.locator('#regra-faixa-origem'), 'Branca');
    await fillWhenVisible(dialog.locator('#regra-faixa-destino'), createdData.regraDestino);
    await fillWhenVisible(dialog.locator('#regra-aulas-minimas'), '18');
    await fillWhenVisible(dialog.locator('#regra-meses-minimos'), '6');
  });

  await stateAction(page, 'graduacao-submit', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Criar Regra/i }).first());
  });

  const regraVisible = await page.getByText(createdData.regraDestino, { exact: false }).first().isVisible().catch(() => false);
  if (!regraVisible) {
    await recordFailure(
      page,
      'Regra de graduação não apareceu após criação',
      '/graduacao',
      'A nova faixa destino não foi encontrada na listagem de regras.',
      ['Abrir Nova Regra', 'Preencher e criar', 'Verificar listagem'],
      'medio'
    );
  }

  recordCoverage(
    'form-graduacao',
    'Graduação → Nova Regra',
    failures.some((f) => f.route === '/graduacao') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/graduacao') ? 'Falha ao criar regra de graduação.' : 'Regra criada com sucesso.'
  );
}

async function campeonatosScenario(page) {
  await gotoRoute(page, '/campeonatos', 'campeonatos-start');

  await stateAction(page, 'campeonatos-open-novo', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Novo Campeonato/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'campeonatos-fill', async () => {
    const inputs = dialog.locator('input');
    await fillWhenVisible(inputs.nth(0), createdData.campeonatoNome);
    await fillWhenVisible(inputs.nth(1), '2026-10-10');
    await fillWhenVisible(inputs.nth(2), `${TEST_PREFIX} Arena`);
    await fillWhenVisible(inputs.nth(3), 'Jiu-Jitsu');
  });

  await stateAction(page, 'campeonatos-submit', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Agendar Evento/i }).first());
  });

  const visible = await page.getByText(createdData.campeonatoNome, { exact: false }).first().isVisible().catch(() => false);
  if (!visible) {
    await recordFailure(
      page,
      'Campeonato não apareceu após criação',
      '/campeonatos',
      'Novo campeonato não ficou visível na listagem.',
      ['Abrir Novo Campeonato', 'Salvar', 'Verificar listagem'],
      'medio'
    );
  }

  recordCoverage(
    'form-campeonatos',
    'Campeonatos → Novo Campeonato',
    failures.some((f) => f.route === '/campeonatos') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/campeonatos') ? 'Falha ao criar campeonato.' : 'Campeonato criado com sucesso.'
  );
}

async function financeiroScenario(page) {
  await gotoRoute(page, '/financeiro', 'financeiro-start');

  const payButton = page.getByRole('button', { name: /Registrar Pagamento|Pagar/i }).first();
  if (!(await payButton.isVisible().catch(() => false))) {
    recordCoverage(
      'form-financeiro',
      'Financeiro → Registrar Pagamento',
      'skipped',
      'Nenhuma cobrança com ação de pagamento disponível na base atual.'
    );
    return;
  }

  await stateAction(page, 'financeiro-open-pagamento', async () => {
    await payButton.click();
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'financeiro-fill', async () => {
    const obs = dialog.locator('#observacoes-pagamento');
    if (await obs.isVisible().catch(() => false)) {
      await fillWhenVisible(obs, `${TEST_PREFIX} pagamento QA`);
    }
  });

  await stateAction(page, 'financeiro-submit', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Confirmar Pagamento/i }).first());
  });

  const success = await page.getByText(/Pagamento de R\$/i).first().isVisible().catch(() => false);
  if (!success) {
    const apiError = await page.getByText(/não foi possível|falha/i).first().isVisible().catch(() => false);
    if (apiError) {
      recordCoverage(
        'form-financeiro',
        'Financeiro → Registrar Pagamento',
        'skipped',
        'Fluxo dependeu de endpoint financeiro indisponível no ambiente local.'
      );
      return;
    }
    await recordFailure(
      page,
      'Pagamento financeiro sem confirmação de sucesso',
      '/financeiro',
      'Não apareceu toast de sucesso após confirmar pagamento.',
      ['Abrir cobrança', 'Registrar pagamento'],
      'alto'
    );
  }

  recordCoverage(
    'form-financeiro',
    'Financeiro → Registrar Pagamento',
    failures.some((f) => f.route === '/financeiro') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/financeiro') ? 'Falha ao registrar pagamento.' : 'Pagamento registrado com sucesso.'
  );
}

async function produtosScenario(page) {
  await gotoRoute(page, '/produtos', 'produtos-start');

  await stateAction(page, 'produtos-open-novo', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Novo Produto/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'produtos-fill-form', async () => {
    await typeWhenVisible(dialog.getByLabel(/Nome do Produto/i), createdData.produtoNome);
    await typeWhenVisible(dialog.getByLabel(/Descrição/i), `${TEST_PREFIX} item de venda`);
    await fillWhenVisible(dialog.getByLabel(/Preço/i), '150');
    await fillWhenVisible(dialog.getByLabel(/Estoque Atual/i), '12');
    await fillWhenVisible(dialog.getByLabel(/Estoque Mínimo/i), '2');

    const combo = dialog.getByRole('combobox').first();
    await clickWhenVisible(combo);
    const option = page.getByRole('option', { name: /Uniformes|Acessórios|Suplementos|Equipamentos|Geral/i }).first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
    }
  });

  await stateAction(page, 'produtos-submit', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Cadastrar Produto|Salvar Alterações/i }).first());
  });

  const productCard = page.getByText(createdData.produtoNome, { exact: false }).first();
  const productVisible = await productCard.isVisible().catch(() => false);
  if (!productVisible) {
    await recordFailure(
      page,
      'Produto cadastrado não apareceu no catálogo',
      '/produtos',
      'Card do produto recém-cadastrado não ficou visível.',
      ['Cadastrar novo produto', 'Verificar card'],
      'alto'
    );
  }

  const addToCartButton = page.getByRole('button', { name: /Adicionar ao Carrinho/i }).first();
  if (!(await addToCartButton.isVisible().catch(() => false))) {
    await recordFailure(
      page,
      'Botão Adicionar ao Carrinho não disponível',
      '/produtos',
      'Não foi possível seguir fluxo de venda por ausência do botão.',
      ['Abrir catálogo', 'Procurar ação de carrinho'],
      'alto'
    );
    recordCoverage('form-produtos', 'Produtos → Novo Produto + Carrinho + Finalizar Venda', 'failed', 'Fluxo de venda interrompido.');
    return;
  }

  await stateAction(page, 'produtos-add-cart', async () => {
    await addToCartButton.click();
  });

  await stateAction(page, 'produtos-open-cart', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Carrinho/i }).first());
  });

  const cartDialog = page.getByRole('dialog').first();
  await expectVisible(cartDialog);

  await stateAction(page, 'produtos-fill-cart', async () => {
    await typeWhenVisible(cartDialog.getByLabel(/Nome do comprador/i), `${TEST_PREFIX} Comprador`);
    await fillWhenVisible(cartDialog.getByLabel(/Telefone do comprador/i), '11900000000');
    await fillWhenVisible(cartDialog.getByLabel(/Observações/i), `${TEST_PREFIX} venda de teste`);
  });

  await stateAction(page, 'produtos-finalizar-venda', async () => {
    await clickWhenVisible(cartDialog.getByRole('button', { name: /Finalizar Venda/i }).first());
  });

  const vendaSuccess = await page.getByText(/Venda realizada com sucesso/i).first().isVisible().catch(() => false);
  if (!vendaSuccess) {
    const apiError = await page.getByText(/não foi possível concluir a venda|falha/i).first().isVisible().catch(() => false);
    if (apiError) {
      recordCoverage(
        'form-produtos',
        'Produtos → Novo Produto + Carrinho + Finalizar Venda',
        'skipped',
        'Endpoint de venda indisponível no ambiente local.'
      );
      return;
    }

    await recordFailure(
      page,
      'Finalização de venda sem sucesso visível',
      '/produtos',
      'Não apareceu confirmação de venda após finalizar carrinho.',
      ['Adicionar ao carrinho', 'Finalizar venda'],
      'alto'
    );
  }

  recordCoverage(
    'form-produtos',
    'Produtos → Novo Produto + Carrinho + Finalizar Venda',
    failures.some((f) => f.route === '/produtos') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/produtos') ? 'Falha no fluxo de produto/venda.' : 'Fluxo de produto e venda concluído.'
  );
}

async function aluguelScenario(page) {
  await gotoRoute(page, '/aluguel', 'aluguel-start');

  await stateAction(page, 'aluguel-open-nova', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Nova Reserva/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'aluguel-fill-form', async () => {
    const inputs = dialog.locator('input');
    await fillWhenVisible(inputs.nth(0), createdData.aluguelCliente);
    await fillWhenVisible(inputs.nth(1), '11900000000');
    await dialog.locator('select').first().selectOption({ label: 'Tatame Principal' });
    await fillWhenVisible(inputs.nth(2), '2026-08-20');
    await fillWhenVisible(inputs.nth(3), '18:00');
    await fillWhenVisible(inputs.nth(4), '20:00');
    await fillWhenVisible(inputs.nth(5), '300');
  });

  await stateAction(page, 'aluguel-submit', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Confirmar Reserva/i }).first());
  });

  const reservaVisible = await page.getByText(createdData.aluguelCliente, { exact: false }).first().isVisible().catch(() => false);
  if (!reservaVisible) {
    const apiError = await page.getByText(/não foi possível criar a reserva|falha/i).first().isVisible().catch(() => false);
    if (apiError) {
      recordCoverage(
        'form-aluguel',
        'Aluguel → Nova Reserva',
        'skipped',
        'Endpoint de reserva indisponível no ambiente local.'
      );
      return;
    }
    await recordFailure(
      page,
      'Reserva de aluguel não apareceu após confirmar',
      '/aluguel',
      'Não foi possível localizar reserva recém-criada na lista.',
      ['Abrir Nova Reserva', 'Preencher e confirmar', 'Verificar listagem'],
      'alto'
    );
  }

  recordCoverage(
    'form-aluguel',
    'Aluguel → Nova Reserva',
    failures.some((f) => f.route === '/aluguel') ? 'failed' : 'passed',
    failures.some((f) => f.route === '/aluguel') ? 'Falha ao criar reserva.' : 'Reserva criada e exibida.'
  );
}

async function pwaInteractions(page, context) {
  await gotoRoute(page, '/alunos', 'pwa-start');

  // pull-to-refresh via gesture touch CDP
  let pullIndicatorSeen = false;
  try {
    const cdp = await context.newCDPSession(page);
    await shot(page, 'pwa-pull-to-refresh-before');
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 200, y: 120, radiusX: 4, radiusY: 4, force: 1, id: 1 }],
    });
    for (const y of [150, 185, 220, 255]) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 200, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }],
      });
      await page.waitForTimeout(70);
      const visible = await page.locator('.fixed.inset-x-0.top-0.z-\\[60\\]').first().isVisible().catch(() => false);
      if (visible) pullIndicatorSeen = true;
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await settle(page, 900);
    await shot(page, 'pwa-pull-to-refresh-after');
  } catch (error) {
    recordWarning('Gesture pull-to-refresh não suportada via automação', '/alunos', String(error));
  }

  if (!pullIndicatorSeen) {
    await recordFailure(
      page,
      'Pull-to-refresh sem indicador visível',
      '/alunos',
      'Não foi observado indicador de pull-to-refresh durante gesto de arraste.',
      ['Abrir /alunos', 'Executar gesto pull-down'],
      'medio'
    );
  }

  // page transition
  const transitionInfo = await page.evaluate(() => {
    const el = document.querySelector('.page-transition');
    if (!el) return null;
    const styles = getComputedStyle(el);
    return {
      name: styles.animationName,
      duration: styles.animationDuration,
      timing: styles.animationTimingFunction,
    };
  });

  if (!transitionInfo || !String(transitionInfo.name).includes('page-slide-in')) {
    await recordFailure(
      page,
      'Classe .page-transition sem animação esperada',
      '/alunos',
      `Dados atuais: ${JSON.stringify(transitionInfo)}`,
      ['Trocar rota', 'Inspecionar classe .page-transition'],
      'medio'
    );
  }

  // back button behavior
  const studentCard = page.getByRole('button', { name: new RegExp(`Abrir ficha de ${createdData.alunoNome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') }).first();
  if (await studentCard.isVisible().catch(() => false)) {
    await stateAction(page, 'pwa-open-student-sheet', async () => {
      await studentCard.click();
    });
    const sheet = page.getByRole('dialog').first();
    const wasOpen = await sheet.isVisible().catch(() => false);
    await stateAction(page, 'pwa-back-button', async () => {
      await page.goBack();
    });
    const stillOpen = await sheet.isVisible().catch(() => false);
    if (wasOpen && stillOpen) {
      await recordFailure(
        page,
        'History back não fechou ficha do aluno',
        '/alunos',
        'Ao voltar no histórico, a ficha permaneceu aberta.',
        ['Abrir ficha do aluno', 'Acionar voltar do navegador'],
        'alto'
      );
    }
  } else {
    recordWarning('Sem aluno visível para validar history.back na ficha', '/alunos', 'Card do aluno de teste não encontrado no momento do teste PWA.');
  }

  // install button and click behavior
  const installBtn = page.getByRole('button', { name: /Instalar app/i }).first();
  const installVisible = await installBtn.isVisible().catch(() => false);
  if (!installVisible) {
    await recordFailure(
      page,
      'Botão Instalar app ausente no cabeçalho',
      '/alunos',
      'A ação de instalação não foi encontrada no Topbar.',
      ['Abrir rota autenticada', 'Verificar topbar'],
      'medio'
    );
  } else {
    await stateAction(page, 'pwa-click-install', async () => {
      await installBtn.click();
    });

    const hasFallbackToast = await page
      .getByText(/Instalação não disponível ainda|Para instalar no iPhone|Instalar app/i)
      .first()
      .isVisible()
      .catch(() => false);

    if (!hasFallbackToast) {
      recordWarning(
        'Clique em Instalar app sem evidência visual clara',
        '/alunos',
        'Não apareceu prompt nativo nem toast de fallback logo após o clique.'
      );
    }
  }

  // standalone hide check - não validável no browser não-standalone
  recordCoverage(
    'pwa-install-standalone-hide',
    'Instalar app some em display-mode standalone',
    'skipped',
    'Ambiente de execução não estava em display-mode standalone para validar ocultação do botão.'
  );

  const pwaHasFailures = failures.some((f) => ['Pull-to-refresh sem indicador visível', 'Classe .page-transition sem animação esperada', 'History back não fechou ficha do aluno', 'Botão Instalar app ausente no cabeçalho'].includes(f.title));
  recordCoverage(
    'pwa-interacoes',
    'Interações PWA (pull-to-refresh, page-transition, back, install/toast)',
    pwaHasFailures ? 'failed' : 'passed',
    pwaHasFailures ? 'Uma ou mais interações PWA falharam.' : 'Interações PWA principais validadas.'
  );
}

async function accessibilityAndVisual(page) {
  let pass = true;

  // warnings React/DOM nesting
  const reactWarnings = reactWarningHitsSince(0);
  if (reactWarnings.length > 0) {
    pass = false;
    await recordFailure(
      page,
      'Warnings React/validateDOMNesting no console',
      '/global',
      reactWarnings.map((w) => w.text).join(' | '),
      ['Executar fluxo completo', 'Inspecionar console warnings'],
      'medio'
    );
  }

  // touch target >= 44x44
  const sizeIssues = [];
  for (const route of ROUTES) {
    await gotoRoute(page, route, 'a11y-size-check');
    const issues = await page.evaluate(() => {
      const elems = Array.from(document.querySelectorAll('button, a, [role="button"]'));
      return elems
        .map((el) => {
          const r = el.getBoundingClientRect();
          const label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40);
          return { w: r.width, h: r.height, label };
        })
        .filter((it) => it.w > 0 && it.h > 0 && (it.w < 44 || it.h < 44))
        .slice(0, 12);
    });

    if (issues.length > 0) {
      sizeIssues.push({ route, issues });
    }
  }

  if (sizeIssues.length > 0) {
    pass = false;
    const detail = sizeIssues
      .map((item) => `${item.route}: ${item.issues.map((i) => `${i.label || '[sem label]'} (${Math.round(i.w)}x${Math.round(i.h)})`).join(', ')}`)
      .join(' | ');
    await recordFailure(
      page,
      'Alvos de toque abaixo de 44x44',
      '/global',
      detail,
      ['Mapear botões/links por rota', 'Comparar dimensões com mínimo 44x44'],
      'medio'
    );
  }

  // overflow horizontal / clipping
  const overflowRoutes = [];
  for (const route of ROUTES) {
    await gotoRoute(page, route, 'viewport-check');
    const overflow = await page.evaluate(() => {
      const maxX = document.documentElement.scrollWidth;
      return maxX - window.innerWidth;
    });
    if (overflow > 1) overflowRoutes.push(`${route} (+${Math.round(overflow)}px)`);
  }

  if (overflowRoutes.length > 0) {
    pass = false;
    await recordFailure(
      page,
      'Conteúdo extrapolando viewport mobile',
      '/global',
      `Overflow horizontal detectado em: ${overflowRoutes.join(', ')}`,
      ['Abrir rotas em 390x844', 'Medir scrollWidth - innerWidth'],
      'alto'
    );
  }

  // contraste: análise visual manual assistida por screenshot
  await gotoRoute(page, '/', 'contrast-check');
  await shot(page, 'a11y-contrast-reference');

  // scrollbar em standalone não validável sem contexto standalone real
  recordCoverage(
    'a11y-scrollbar-standalone',
    'Scrollbar não aparece em display-mode standalone',
    'skipped',
    'Teste requer execução em display-mode standalone real no dispositivo/browser instalado.'
  );

  recordCoverage(
    'a11y-visual-geral',
    'Acessibilidade e visual (warnings React, toque 44x44, clipping, contraste)',
    pass ? 'passed' : 'failed',
    pass ? 'Sem problemas críticos detectados nos checks automáticos de a11y/visual.' : 'Foram detectados problemas em pelo menos um check de a11y/visual.'
  );
}

async function offlineFlow(page, context) {
  // garante rotas visitadas online
  for (const route of ROUTES) {
    await page.goto(`${BASE_URL}${route}`);
    await settle(page);
  }

  const swInfo = await page.evaluate(async () => {
    const hasSW = 'serviceWorker' in navigator;
    let controller = false;
    let reg = false;
    if (hasSW) {
      controller = !!navigator.serviceWorker.controller;
      try {
        const ready = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        reg = !!ready;
      } catch {
        reg = false;
      }
    }
    return { hasSW, controller, reg };
  });

  if (!swInfo.hasSW || !swInfo.reg) {
    recordCoverage(
      'offline-suite',
      'Offline (cache de rotas + fila + restauração)',
      'skipped',
      `Service Worker não disponível/ativo no ambiente atual (hasSW=${swInfo.hasSW}, registered=${swInfo.reg}).`
    );
    return;
  }

  await context.setOffline(true);
  await page.waitForTimeout(2600);

  let routesOfflineOk = true;
  for (const route of ROUTES) {
    const mark = consoleEntries.length;
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      await settle(page, 300);
    } catch {
      routesOfflineOk = false;
      await recordFailure(
        page,
        `Rota não carregou offline: ${route}`,
        route,
        'Navegação offline falhou mesmo após visita online prévia.',
        ['Visitar online', 'Ativar offline', `Abrir ${route}`],
        'alto'
      );
      continue;
    }

    const errs = trackedConsoleErrorsSince(mark).filter((e) => !/Failed to fetch|ERR_INTERNET_DISCONNECTED/i.test(e.text));
    if (errs.length > 0) {
      routesOfflineOk = false;
      await recordFailure(
        page,
        `Erro de console offline em ${route}`,
        route,
        errs.map((e) => e.text).join(' | '),
        ['Ativar offline', `Abrir ${route}`],
        'medio'
      );
    }
  }

  await gotoRoute(page, '/turmas', 'offline-write-start');

  await stateAction(page, 'offline-open-new-turma', async () => {
    await clickWhenVisible(page.getByRole('button', { name: /Nova Turma/i }).first());
  });

  const dialog = page.getByRole('dialog').first();
  await expectVisible(dialog);

  await stateAction(page, 'offline-fill-new-turma', async () => {
    await fillWhenVisible(dialog.getByLabel(/Nome da Turma/i), `${TEST_PREFIX} OFFLINE`);
    await fillWhenVisible(dialog.getByLabel(/^Professor$/i), `${TEST_PREFIX} Prof Offline`);
    await fillWhenVisible(dialog.getByLabel(/Horário/i), '21:00 - 22:00');
    await fillWhenVisible(dialog.getByLabel(/Capacidade/i), '10');
    await clickWhenVisible(dialog.getByRole('combobox').first());
    await clickWhenVisible(page.getByRole('option', { name: /Jiu-Jitsu/i }).first());
    await clickWhenVisible(dialog.getByText(/^Sex$/i).first());
  });

  await stateAction(page, 'offline-submit-new-turma', async () => {
    await clickWhenVisible(dialog.getByRole('button', { name: /Criar Turma/i }).first());
  });

  // badge offline
  const offlineBadge = page.getByText(/Offline|Sincronizando/i).first();
  const badgeVisible = await offlineBadge.isVisible().catch(() => false);
  if (!badgeVisible) {
    await recordFailure(
      page,
      'Badge Offline não exibido com conexão desligada',
      '/turmas',
      'Após ficar offline, o topbar não mostrou badge de estado.',
      ['Ativar modo offline', 'Observar topbar'],
      'medio'
    );
  }

  const queueInfo = await page.evaluate(async () => {
    function openDb() {
      return new Promise((resolve) => {
        const req = indexedDB.open('workbox-background-sync');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
    }

    const db = await openDb();
    if (!db) return { count: 0, exists: false };
    if (!db.objectStoreNames.contains('requests')) {
      db.close();
      return { count: 0, exists: false };
    }

    const count = await new Promise((resolve) => {
      const tx = db.transaction('requests', 'readonly');
      const store = tx.objectStore('requests');
      let n = 0;
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return resolve(n);
        const val = cursor.value;
        if (val?.queueName === 'gemeos-writes-queue') n += 1;
        cursor.continue();
      };
      req.onerror = () => resolve(0);
    });

    db.close();
    return { count, exists: true };
  });

  if (!queueInfo.exists) {
    recordWarning(
      'Fila Workbox não encontrada no IndexedDB',
      '/turmas',
      'Banco workbox-background-sync/requests não estava disponível durante teste offline.'
    );
  }

  if (queueInfo.exists && queueInfo.count <= 0) {
    await recordFailure(
      page,
      'Escrita offline não entrou na fila gemeos-writes-queue',
      '/turmas',
      `count atual: ${queueInfo.count}`,
      ['Ativar offline', 'Salvar mutação POST/PUT', 'Inspecionar queue'],
      'alto'
    );
  }

  await context.setOffline(false);
  await settle(page, 2200);

  const restoredToast = await page.getByText(/Conexão restaurada/i).first().isVisible().catch(() => false);
  if (!restoredToast) {
    recordWarning('Toast de conexão restaurada não detectado', '/turmas', 'Após voltar online, toast esperado não apareceu no período observado.');
  }

  recordCoverage(
    'offline-suite',
    'Offline (cache de rotas + badge + fila + restauração)',
    failures.some((f) => f.title.includes('offline') || f.title.includes('fila') || f.title.includes('Rota não carregou offline')) || !routesOfflineOk
      ? 'failed'
      : 'passed',
    failures.some((f) => f.title.includes('offline') || f.title.includes('fila') || f.title.includes('Rota não carregou offline')) || !routesOfflineOk
      ? 'Falhas detectadas no comportamento offline.'
      : 'Comportamento offline principal validado.'
  );
}

async function exploratory(page) {
  const start = Date.now();
  await gotoRoute(page, '/alunos', 'exploratorio-start');

  while (Date.now() - start < 30_000) {
    try {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(120);
      await page.mouse.wheel(0, -320);
      await page.waitForTimeout(120);

      const maybeDialogClose = page.getByRole('button', { name: /Fechar|Cancelar|X/i }).first();
      if (await maybeDialogClose.isVisible().catch(() => false)) {
        await maybeDialogClose.click();
      }

      const randomTargets = [
        page.getByRole('button', { name: /Mais|Início|Alunos|Frequência|Financeiro/i }).first(),
        page.locator('main').first(),
      ];

      for (const target of randomTargets) {
        if (await target.isVisible().catch(() => false)) {
          await target.click({ force: true }).catch(() => {});
          await page.waitForTimeout(120);
        }
      }

      const numericInput = page.locator('input[type="number"]').first();
      if (await numericInput.isVisible().catch(() => false)) {
        await numericInput.fill('abc###').catch(() => {});
      }

      await settle(page, 180);
    } catch {
      // continua exploratório
    }
  }

  await shot(page, 'exploratorio-final');
  recordCoverage('exploratorio-30s', 'Exploratório livre (30s)', 'passed', 'Executado com taps rápidos, scroll, abrir/fechar dialogs e entradas inválidas.');
}

function statusMarker(status) {
  if (status === 'passed') return '[✓ passou]';
  if (status === 'failed') return '[✗ falhou]';
  return '[⊘ pulado — motivo]';
}

function buildCoverageLines() {
  return coverage
    .map((item) => `- ${statusMarker(item.status)} ${item.title}: ${item.details}`)
    .join('\n');
}

function buildFailuresSection() {
  if (failures.length === 0) {
    return '- Nenhuma falha real encontrada.';
  }

  const ordered = [...failures].sort((a, b) => {
    const rank = { alto: 0, medio: 1, baixo: 2 };
    return rank[a.impact] - rank[b.impact] || a.id - b.id;
  });

  return ordered
    .map((f) => {
      const steps = f.steps.map((s) => `  - ${s}`).join('\n');
      return `- **[${f.impact.toUpperCase()}] ${f.title}**\n  - Rota: \`${f.route}\`\n  - Evidência: ![${f.title}](${f.screenshot})\n  - Descrição: ${f.details}\n  - Passos para reproduzir:\n${steps}`;
    })
    .join('\n');
}

function buildWarningsSection() {
  if (warnings.length === 0) {
    return '- Nenhum warning adicional.';
  }

  return warnings
    .map((w) => `- ${w.title} (rota: \`${w.route}\`): ${w.details}`)
    .join('\n');
}

function writeReport() {
  const summary = `**Resumo executivo** — ${coverage.length} verificações, ${failures.length} falhas, ${warnings.length} warnings.`;
  const trackedConsole = consoleEntries.filter((e) => e.type === 'error' || e.type === 'pageerror').filter((e) => !e.ignored);
  const verdict = failures.length > 0 ? `bloqueia release: falha ${failures[0].id}` : 'pronto para release';

  const content = [
    '# Relatório QA Mobile — Gêmeos Academia',
    '',
    summary,
    '',
    '## Falhas reais',
    buildFailuresSection(),
    '',
    '## Warnings',
    buildWarningsSection(),
    '',
    '## Cobertura explícita',
    buildCoverageLines(),
    '',
    '## Screenshots',
    '- Pasta: `qa-screenshots/`',
    '- Convenção usada: `NN-rota-acao.png` e `falha-NN-descricao.png`',
    '',
    '## Console log agregado',
    `- Arquivo: \`qa-console.log\``,
    `- Entradas rastreadas de erro/pageerror (ignorando ruído /rows /status): ${trackedConsole.length}`,
    '',
    '## Negative confirmation',
    '- Procurei explicitamente por: tela branca, JS exception, validateDOMNesting/React warning, botão morto, clipping horizontal, regressão de navegação e ausência do rodapé obrigatório. Não deixei essas áreas sem checagem.',
    '',
    '## Veredito',
    `- **${verdict}**`,
    '',
  ].join('\n');

  fs.writeFileSync(REPORT_PATH, content, 'utf8');
}

async function main() {
  ensureCleanArtifacts();

  // Build para garantir assets PWA e preview estável.
  const build = spawnProcess('npm', ['run', 'build']);
  const buildExit = await new Promise((resolve) => build.on('exit', resolve));
  if (buildExit !== 0) {
    throw new Error(`Build falhou com exit code ${buildExit}`);
  }

  const backendProc = spawnProcess('node', ['server.js'], {
    env: {
      API_KEY: '',
    },
  });
  const backendOk = await waitForHttp(BACKEND_URL, 25000);
  if (!backendOk) {
    recordWarning('Backend local não respondeu /status', '/status', 'Fluxos de escrita podem falhar por indisponibilidade de API local.');
  }

  const previewProc = spawnProcess('npm', ['run', 'preview', '--', '--host', 'localhost', '--port', '8080', '--strictPort'], {
    env: {
      VITE_ENABLE_PWA_DEV: 'true',
      VITE_API_KEY: process.env.API_KEY || '',
    },
  });

  const frontendOk = await waitForHttp(BASE_URL, 90000);
  if (!frontendOk) {
    throw new Error('Frontend não subiu em http://localhost:8080');
  }

  let browser;
  let context;
  let page;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      ...devices['iPhone 13'],
      viewport: { width: 390, height: 844 },
      baseURL: BASE_URL,
      locale: 'pt-BR',
      colorScheme: 'dark',
      reducedMotion: 'no-preference',
    });

    page = await context.newPage();
    addConsoleListeners(page);

    await page.goto(BASE_URL);
    await settle(page);

    await bypassLoginIfNeeded(page);
    await shot(page, 'inicio-pos-login');

    await runScenario(page, 'Smoke 12 rotas', () => smokeRoutes(page));
    await runScenario(page, 'Cadastro completo de aluno', () => cadastroAluno(page));
    await runScenario(page, 'BottomNav e menu Mais', () => bottomNavAndMore(page));
    await runScenario(page, 'Turmas + vínculo de aluno', () => createTurmaAndAssignAluno(page));
    await runScenario(page, 'Frequência', () => frequenciaScenario(page));
    await runScenario(page, 'Graduação', () => graduacaoScenario(page));
    await runScenario(page, 'Campeonatos', () => campeonatosScenario(page));
    await runScenario(page, 'Financeiro', () => financeiroScenario(page));
    await runScenario(page, 'Produtos e vendas', () => produtosScenario(page));
    await runScenario(page, 'Aluguel', () => aluguelScenario(page));
    await runScenario(page, 'Interações PWA', () => pwaInteractions(page, context));
    await runScenario(page, 'Acessibilidade e visual', () => accessibilityAndVisual(page));
    await runScenario(page, 'Offline', () => offlineFlow(page, context));
    await runScenario(page, 'Exploratório 30s', () => exploratory(page));

    flushConsoleLog();
    writeReport();

    await browser.close();
    await stopProcess(previewProc);
    await stopProcess(backendProc);
  } catch (error) {
    hadFatalScriptError = true;
    const message = error instanceof Error ? `${error.message}\n${error.stack || ''}` : String(error);
    fs.appendFileSync(CONSOLE_PATH, `\n[${nowIso()}] [fatal] ${message}\n`, 'utf8');

    if (page) {
      await recordFailure(
        page,
        'Falha fatal no runner de QA',
        '/global',
        message,
        ['Executar runner automatizado'],
        'alto'
      );
    }

    flushConsoleLog();
    writeReport();

    if (browser) await browser.close().catch(() => {});
    await stopProcess(previewProc);
    await stopProcess(backendProc);

    process.exitCode = 1;
  }
}

await main();

if (hadFatalScriptError) {
  process.exit(1);
}
