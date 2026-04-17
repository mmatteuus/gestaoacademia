const { chromium } = require('playwright');

async function testPages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  const pages = [
    { url: '/', name: 'Dashboard' },
    { url: '/alunos', name: 'Alunos' },
    { url: '/turmas', name: 'Turmas' },
    { url: '/frequencia', name: 'Frequência' },
    { url: '/graduacao', name: 'Graduação' },
    { url: '/ranking', name: 'Ranking' },
    { url: '/campeonato', name: 'Campeonatos' },
    { url: '/financeiro', name: 'Financeiro' },
    { url: '/financeiro-gerencial', name: 'Financeiro Gerencial' },
    { url: '/produtos', name: 'Produtos' },
    { url: '/aluguel', name: 'Aluguel' },
    { url: '/relatorios', name: 'Relatórios' },
  ];

  const baseUrl = 'http://localhost:8080';

  for (const p of pages) {
    try {
      console.log(`Testing: ${p.name} (${p.url})`);
      await page.goto(`${baseUrl}${p.url}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(1000);
      const title = await page.title();
      console.log(`  ✓ Loaded: ${title}`);
    } catch (err) {
      console.log(`  ✗ Error: ${p.name} - ${err.message}`);
    }
  }

  await browser.close();
  console.log('\nTest completed!');
}

testPages().catch(console.error);