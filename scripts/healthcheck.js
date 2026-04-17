import { google } from 'googleapis';
import { oauth2Client, SPREADSHEET_ID, SHEET_CONFIG } from '../index.js';

(async () => {
  try {
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });

    const existingTabs = res.data.sheets.map(s => s.properties.title);
    const expectedTabs = Object.keys(SHEET_CONFIG);

    console.log('✅ Conexão Google Sheets OK');
    console.log('📄 Planilha:', res.data.properties.title);
    console.log('🔗 ID:', SPREADSHEET_ID);
    console.log('');
    console.log('Abas na planilha:', existingTabs.join(', '));
    console.log('');

    const missing = expectedTabs.filter(t => !existingTabs.includes(t));
    if (missing.length) {
      console.log('⚠️  Abas esperadas pelo SHEET_CONFIG e ainda não criadas:');
      missing.forEach(t => console.log('   -', t));
      console.log('   (serão criadas automaticamente na primeira operação)');
    } else {
      console.log('✅ Todas as abas esperadas existem.');
    }
  } catch (e) {
    console.error('❌ Falha na conexão:', e.message);
    if (e.response?.data) console.error(e.response.data);
    process.exit(1);
  }
})();
