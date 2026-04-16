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

// Helper para criar sheets API autenticada
function getSheets() {
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

// Listar todas as linhas da planilha (exceto header)
async function listRows() {
  const sheets = getSheets();
  const range = 'Página1'; // Troque se o nome da aba for diferente
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  const [header, ...rows] = res.data.values;
  return rows.map(row => Object.fromEntries(header.map((h, i) => [h, row[i]])));
}

// Buscar linha por ID
async function getRowById(id) {
  const sheets = getSheets();
  const range = 'Página1';
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  const [header, ...rows] = res.data.values;
  const idx = header.indexOf('id');
  const match = rows.find(r => r[idx] === String(id));
  return match ? Object.fromEntries(header.map((h, i) => [h, match[i]])) : null;
}

// Inserir uma nova linha (adiciona ao fim)
async function insertRow(data) {
  const sheets = getSheets();
  const range = 'Página1';
  const { data: { values } } = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range });
  const header = values[0];
  const newRow = header.map((h) => data[h] || '');
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [newRow] },
  });
  return true;
}

// Atualizar linha por ID
async function updateRow(id, data) {
  const sheets = getSheets();
  const range = 'Página1';
  // Busca todas linhas para localizar índice da row
  const { data: { values } } = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range });
  const [header, ...rows] = values;
  const idx = header.indexOf('id');
  const rowIndex = rows.findIndex(r => r[idx] === String(id));
  if (rowIndex < 0) return false;
  // Atualiza somente campos presentes em data
  const updatedRow = header.map((h, i) => (h === 'id' ? id : (data[h] ?? rows[rowIndex][i] || '')));
  const targetRange = `Página1!A${rowIndex + 2}`; // +2 = header + 1-based
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: targetRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [updatedRow] },
  });
  return true;
}

// INTERFACE DE TESTE SIMPLES SE EXECUTADO DIRETO
if (require.main === module) {
  (async () => {
    console.log('listRows():', await listRows());
    console.log('getRowById(1):', await getRowById(1));
    // Exemplo insert:
    // await insertRow({ id: '3', nome: 'Novo', email: 'teste@ex.com', status: 'ativo', created_at: new Date().toISOString() });
    // Exemplo update:
    // await updateRow('1', { nome: 'Atualizado' });
  })();
}

export { getAccessToken, oauth2Client, SPREADSHEET_ID, listRows, getRowById, insertRow, updateRow };
