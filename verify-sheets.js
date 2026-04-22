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

async function verifySheetStructure() {
  console.log('Verificando estrutura das abas na planilha...\n');

  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetNames = (res.data.sheets || []).map((s) => s.properties?.title || '');
  console.log('Abas encontradas:', sheetNames.join(', '));
  console.log('');

  const expectedSheets = ['Alunos', 'Financeiro', 'Aulas'];

  for (const sheetName of expectedSheets) {
    console.log(`--- ABA: ${sheetName} ---`);

    if (!sheetNames.includes(sheetName)) {
      console.log('  ABA nao existe, criando...');
      const headers =
        sheetName === 'Alunos'
          ? ['id', 'nome', 'email', 'status', 'plano', 'created_at']
          : sheetName === 'Financeiro'
            ? ['id', 'aluno_id', 'descricao', 'valor', 'status_pagamento', 'data_vencimento', 'created_at']
            : ['id', 'aluno_id', 'nome_aula', 'data_assistida', 'duracao_min', 'created_at'];

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: { rowCount: 1000, columnCount: 20 },
                },
              },
            },
          ],
        },
      });

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] },
      });

      console.log('  Aba criada com cabecalhos');
    } else {
      console.log('  Aba existe');
    }

    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:ZZ50`,
    });

    const values = data.data.values || [];
    console.log(`  Total de linhas (incluindo header): ${values.length}`);

    if (values.length > 1) {
      console.log('  Cabecalho:', values[0].join(' | '));
      console.log('  Ultimas 2 entradas:');
      values.slice(-2).forEach((row, i) => {
        console.log(`     ${values.length - 2 + i}. ${row.slice(0, 4).join(' | ')}${row.length > 4 ? '...' : ''}`);
      });
    }

    console.log('');
  }

  console.log('Verificacao concluida!');
  console.log('Abra a planilha para confirmar visualmente as 3 abas separadas.');
}

verifySheetStructure().catch(console.error);
