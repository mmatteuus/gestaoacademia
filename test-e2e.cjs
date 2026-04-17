const { chromium } = require('playwright');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAppHumanLike() {
  console.log('🚀 Starting human-like testing...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({ 
    viewport: { width: 1920, height: 1080 },
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo'
  });
  
  const page = await context.newPage();
  
  // Enable console logging  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });
  
  const baseUrl = 'http://127.0.0.1:8080';
  let passed = 0;
  let failed = 0;
  
  const pages = [
    { path: '/', name: 'Dashboard', actions: ['scroll', 'wait'] },
    { path: '/alunos', name: 'Alunos', actions: ['search', 'scroll', 'wait'] },
    { path: '/turmas', name: 'Turmas', actions: ['scroll', 'wait'] },
    { path: '/frequencia', name: 'Frequência', actions: ['scroll', 'wait'] },
    { path: '/graduacao', name: 'Graduação', actions: ['scroll', 'wait'] },
    { path: '/ranking', name: 'Ranking', actions: ['scroll', 'wait'] },
    { path: '/campeonato', name: 'Campeonatos', actions: ['scroll', 'wait'] },
    { path: '/financeiro', name: 'Financeiro', actions: ['scroll', 'wait'] },
    { path: '/financeiro-gerencial', name: 'Financeiro Gerencial', actions: ['scroll', 'wait'] },
    { path: '/produtos', name: 'Produtos', actions: ['scroll', 'wait'] },
    { path: '/aluguel', name: 'Aluguel', actions: ['scroll', 'wait'] },
    { path: '/relatorios', name: 'Relatórios', actions: ['scroll', 'wait'] },
  ];

  for (const p of pages) {
    console.log(`\n📄 Testing: ${p.name} (${p.path})`);
    
    try {
      const response = await page.goto(`${baseUrl}${p.path}`, {
        waitUntil: 'networkidle',
        timeout: 20000
      });
      
      if (!response) throw new Error('No response');
      
      const status = response.status();
      if (status >= 400) throw new Error(`HTTP ${status}`);
      
      await sleep(800);
      
      // Human-like actions
      if (p.actions.includes('search')) {
        // Try to find a search input
        const searchInput = await page.$('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]');
        if (searchInput) {
          await searchInput.fill('João');
          await sleep(500);
          await searchInput.clear();
          console.log(`  ✓ Search tested`);
        }
      }
      
      if (p.actions.includes('scroll')) {
        // Scroll down slowly like a human
        await page.evaluate(() => window.scrollTo(0, 300));
        await sleep(400);
        await page.evaluate(() => window.scrollTo(0, 0));
        console.log(`  ✓ Scroll tested`);
      }
      
      // Check if page has content
      const body = await page.evaluate(() => document.body?.innerText || '');
      if (body.length < 50) {
        throw new Error('Empty or very small content');
      }
      
      console.log(`  ✅ OK - Status: ${status}, Content: ${body.length} chars`);
      passed++;
      
    } catch (err) {
      console.log(`  ❌ FAILED: ${err.message}`);
      failed++;
    }
  }
  
  // Test navigation menu
  console.log('\n\n🧭 Testing Navigation Menu...');
  
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await sleep(500);
  
  // Click through menu items
  const navItems = [
    'Alunos', 'Turmas', 'Frequência', 'Graduação', 
    'Ranking', 'Campeonatos', 'Financeiro', 'Produtos', 'Aluguel', 'Relatórios'
  ];
  
  for (const item of navItems) {
    try {
      // Find and click nav link
      const link = await page.$(`a[href="/${item.toLowerCase().replace(' ', '-').replace('ã', 'a')}"]`);
      if (link) {
        await link.click();
        await sleep(600);
        console.log(`  ✓ Clicked: ${item}`);
      }
    } catch (e) {
      console.log(`  ⚠ Could not click: ${item}`);
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${pages.length}`);
  console.log(`❌ Failed: ${failed}/${pages.length}`);
  console.log('\n🎉 Testing complete!');
  
  process.exit(failed > 0 ? 1 : 0);
}

testAppHumanLike().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});