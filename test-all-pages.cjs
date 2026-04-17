const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testAllPages() {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:8080';
  
  const pages = [
    { path: '/', name: 'Dashboard', desc: 'Página inicial com métricas' },
    { path: '/alunos', name: 'Alunos', desc: 'Lista e gestão de alunos' },
    { path: '/turmas', name: 'Turmas', desc: 'Gestão de turmas' },
    { path: '/frequencia', name: 'Frequência', desc: 'Controle de presença' },
    { path: '/graduacao', name: 'Graduação', desc: 'Faixas e promoções' },
    { path: '/ranking', name: 'Ranking', desc: 'Ranking de alunos' },
    { path: '/campeonato', name: 'Campeonatos', desc: 'Competições' },
    { path: '/financeiro', name: 'Financeiro', desc: 'Financeiro escolar' },
    { path: '/financeiro-gerencial', name: 'FinanceiroGerencial', desc: 'Financeiro gerencial' },
    { path: '/produtos', name: 'Produtos', desc: 'Estoque e vendas' },
    { path: '/aluguel', name: 'Aluguel', desc: 'Aluguel de espaço' },
    { path: '/relatorios', name: 'Relatórios', desc: 'Relatórios' },
  ];

  const results = [];

  for (const p of pages) {
    console.log(`\n▶ Testing: ${p.name} (${p.path})`);
    console.log(`  Desc: ${p.desc}`);
    
    try {
      const response = await page.goto(`${baseUrl}${p.path}`, { 
        waitUntil: 'networkidle', 
        timeout: 15000 
      });
      
      const status = response?.status() || 200;
      console.log(`  Status: ${status}`);
      
      // Check for critical errors in console
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      
      // Wait for content to render
      await page.waitForTimeout(1500);
      
      // Check if main content loaded
      const hasContent = await page.evaluate(() => {
        const body = document.body;
        return body && body.innerText.length > 0;
      });
      
      console.log(`  Content: ${hasContent ? 'OK' : 'EMPTY'}`);
      
      // Get page title
      const title = await page.title();
      console.log(`  Title: ${title}`);
      
      // Check URL
      const currentUrl = page.url();
      console.log(`  URL: ${currentUrl}`);
      
      results.push({
        name: p.name,
        path: p.path,
        status: status,
        content: hasContent,
        title: title,
        success: status < 400 && hasContent
      });
      
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
      results.push({
        name: p.name,
        path: p.path,
        error: err.message,
        success: false
      });
    }
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('\nFailed pages:');
  
  for (const r of results) {
    if (!r.success) {
      console.log(`  - ${r.name}: ${r.error || 'Check failed'}`);
    }
  }

  return results;
}

testAllPages()
  .then(results => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });