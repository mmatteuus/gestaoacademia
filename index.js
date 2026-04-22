import { env } from './backend/src/config/env.js';
import {
  listRows,
  getRowById,
  insertRow,
  updateRow,
  SHEET_CONFIG,
  detectSheetType,
  getOAuthClientInstance,
} from './backend/src/repositories/sheets.repository.js';

const SPREADSHEET_ID = env.spreadsheetId;

export function ensureOAuthClient() {
  return getOAuthClientInstance();
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === `file://${entryPath.replace(/\\/g, '/')}`) {
  (async () => {
    const alunos = await listRows('Alunos');
    const financeiro = await listRows('Financeiro');
    const aulas = await listRows('Aulas');
    console.log('Alunos:', alunos.length);
    console.log('Financeiro:', financeiro.length);
    console.log('Aulas:', aulas.length);
  })();
}

export {
  SPREADSHEET_ID,
  listRows,
  getRowById,
  insertRow,
  updateRow,
  SHEET_CONFIG,
  detectSheetType,
};
