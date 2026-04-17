import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

if (!SPREADSHEET_ID || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  throw new Error('Configure corretamente o arquivo .env com todos os campos necessários.');
}

// Autenticador OAuth
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) throw new Error('Falha ao obter access token');
    return token;
  } catch (error) {
    console.error('Erro ao obter access token:', error);
    throw error;
  }
}

// Mapeamento de tipos para abas
const SHEET_CONFIG = {
  Alunos: { name: 'Alunos', headers: ['id', 'nome', 'email', 'status', 'plano', 'created_at'] },
  Financeiro: { name: 'Financeiro', headers: ['id', 'aluno_id', 'descricao', 'valor', 'status_pagamento', 'data_vencimento', 'created_at'] },
  Aulas: { name: 'Aulas', headers: ['id', 'aluno_id', 'nome_aula', 'data_assistida', 'duracao_min', 'created_at'] }
};

function getSheets() {
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function ensureSheetExists(sheetName, headers) {
  const sheets = getSheets();
  try {
    // Tenta ler a primeira célula para ver se a aba existe
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });
  } catch (error) {
    // Se der erro (aba não existe), cria uma nova aba
    console.log(`Criando aba: ${sheetName}`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: { rowCount: 1000, columnCount: 20 }
            }
          }
        }]
      }
    });
    // Cria o cabeçalho
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] }
    });
  }
}

function detectSheetType(data) {
  if (data.plano) return 'Alunos';
  if (data.valor || data.status_pagamento) return 'Financeiro';
  if (data.nome_aula || data.duracao_min) return 'Aulas';
  return 'Alunos'; // Default
}

async function listRows(type = 'Alunos') {
  const config = SHEET_CONFIG[type] || SHEET_CONFIG.Alunos;
  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: config.name,
  });
  const [header, ...rows] = res.data.values || [];
  if (!header) return [];
  return rows.map(row => Object.fromEntries(config.headers.map((h, i) => [h, row[i] || ''])));
}

async function getRowById(id, type = 'Alunos') {
  const config = SHEET_CONFIG[type] || SHEET_CONFIG.Alunos;
  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: config.name,
  });
  const [header, ...rows] = res.data.values || [];
  if (!header) return null;
  
  const idx = header.indexOf('id');
  const match = rows.find(r => r[idx] === String(id));
  return match ? Object.fromEntries(config.headers.map((h, i) => [h, match[i] || ''])) : null;
}

async function insertRow(data) {
  const type = detectSheetType(data);
  const config = SHEET_CONFIG[type];
  const sheets = getSheets();
  
  await ensureSheetExists(config.name, config.headers);
  
  // Garante que o ID exista, se não fornecido
  if (!data.id) data.id = String(Date.now());
  if (!data.created_at) data.created_at = new Date().toISOString();

  const newRow = config.headers.map(h => data[h] || '');
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: config.name,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [newRow] },
  });
  return true;
}

async function updateRow(id, data, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: config.name });
  const [header, ...rows] = res.data.values || [];
  if (!header) return false;

  const idx = header.indexOf('id');
  const rowIndex = rows.findIndex(r => r[idx] === String(id));
  if (rowIndex < 0) return false;

  const updatedRow = config.headers.map((h, i) => {
    if (h === 'id') return id;
    return data[h] !== undefined ? data[h] : (rows[rowIndex][i] || '');
  });

  const targetRange = `${config.name}!A${rowIndex + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: targetRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [updatedRow] },
  });
  return true;
}

// INTERFACE DE TESTE SIMPLES SE EXECUTADO DIRETO
// Se executado como script principal em ESM, checamos import.meta.url
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  (async () => {
    console.log('listRows():', await listRows());
    console.log('getRowById(1):', await getRowById(1));
  })();
}

export { getAccessToken, oauth2Client, SPREADSHEET_ID, listRows, getRowById, insertRow, updateRow };
