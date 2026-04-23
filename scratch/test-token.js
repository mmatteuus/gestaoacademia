import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

async function testRefreshToken() {
  console.log('Testando validade do Refresh Token...');
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
  try {
    const { token } = await oauth2Client.getAccessToken();
    if (token) {
      console.log('✅ Refresh Token VÁLIDO. Novo Access Token gerado.');
    } else {
      console.log('❌ Falha ao obter Access Token. Token pode ser nulo.');
    }
  } catch (err) {
    console.error('❌ ERRO ao usar Refresh Token:', err.message);
    if (err.response && err.response.data) {
      console.error('Detalhes:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

testRefreshToken();
