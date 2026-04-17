import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

async function checkAndFixSheets() {
  console.log('Checking sheets structure...\n');
  
  // Get all sheet names
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = res.data.sheets.map(s => s.properties.title);
  console.log('Existing sheets:', existing.join(', '));
  
  const configs = {
    'Alunos': ['id', 'nome', 'email', 'status', 'plano', 'created_at'],
    'Financeiro': ['id', 'aluno_id', 'descricao', 'valor', 'status_pagamento', 'data_vencimento', 'created_at'],
    'Aulas': ['id', 'aluno_id', 'nome_aula', 'data_assistida', 'duracao_min', 'created_at']
  };
  
  for (const [name, headers] of Object.entries(configs)) {
    if (!existing.includes(name)) {
      console.log(`Creating sheet: ${name}`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: name, gridProperties: { rowCount: 1000, columnCount: 20 } } } }]
        }
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${name}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] }
      });
      console.log(`  Created ${name} with headers`);
    } else {
      // Read first few rows to verify
      const data = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${name}!A1:Z10`
      });
      const count = (data.data.values || []).length - 1;
      console.log(`  ${name}: ${count} data rows`);
    }
  }
  
  console.log('\nDone! Check your spreadsheet now.');
}

checkAndFixSheets().catch(e => console.error('Error:', e.message, e.errors));
