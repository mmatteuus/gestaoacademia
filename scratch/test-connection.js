import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tenta carregar o .env da raiz
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

console.log('ID:', SPREADSHEET_ID ? 'OK' : 'MISSING');
console.log('CLIENT_ID:', CLIENT_ID ? 'OK' : 'MISSING');

async function test() {
  try {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    console.log('Tentando obter metadados da planilha...');
    const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    console.log('Sucesso! Planilha:', res.data.properties.title);
  } catch (err) {
    console.error('ERRO DE CONEXÃO:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

test();
