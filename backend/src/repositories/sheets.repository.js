import { google } from 'googleapis';
import { env, assertGoogleEnv } from '../config/env.js';
import { SHEET_CONFIG, detectSheetType } from '../config/sheet-config.js';
import { sanitizeSheetCellValue } from '../lib/normalizers.js';
import { logger } from '../lib/logger.js';

let oauth2Client = null;
// Cache longo: nomes de abas e cabeçalhos quase nunca mudam em runtime;
// `setSheetKnown` e `headerCache.set` mantêm o cache atualizado quando há criação/patch.
const CACHE_TTL_MS = 5 * 60_000;
const sheetNamesCache = {
  expiresAt: 0,
  names: null,
};
const headerCache = new Map();
// Marca abas que já passaram por ensureSheetExists nesta sessão de processo,
// evitando o GET de cabeçalhos a cada insert.
const ensuredSheets = new Set();

async function withRetry(fn, label) {
  const delays = [400, 1000, 2500]; // 3 tentativas extras
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const code = err?.code || err?.response?.status;
      const message = String(err?.message || '');
      const retriable = code === 429 || code === 503 || code === 500 || /Quota exceeded|rateLimitExceeded/i.test(message);
      if (!retriable || attempt === delays.length) throw err;
      lastErr = err;
      logger.warn({ context: 'sheets_retry', label, attempt: attempt + 1, code, message: message.slice(0, 200) });
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  throw lastErr;
}

function initAuth() {
  assertGoogleEnv();
  oauth2Client = new google.auth.OAuth2(env.googleClientId, env.googleClientSecret);
  oauth2Client.setCredentials({ refresh_token: env.googleRefreshToken });
  logger.info({ context: 'google_oauth_initialized' });
  return oauth2Client;
}

function getOAuthClient() {
  if (!oauth2Client) {
    initAuth();
  }
  return oauth2Client;
}

function getSheets() {
  const auth = getOAuthClient();
  return google.sheets({ version: 'v4', auth });
}

async function listAllSheets() {
  const now = Date.now();
  if (sheetNamesCache.names && sheetNamesCache.expiresAt > now) {
    return [...sheetNamesCache.names];
  }

  const sheets = getSheets();
  const res = await withRetry(
    () => sheets.spreadsheets.get({ spreadsheetId: env.spreadsheetId }),
    'spreadsheets.get'
  );
  const names = (res.data.sheets || []).map((sheet) => sheet.properties.title);
  sheetNamesCache.names = names;
  sheetNamesCache.expiresAt = now + CACHE_TTL_MS;
  return names;
}

function setSheetKnown(sheetName) {
  const now = Date.now();
  if (sheetNamesCache.names) {
    if (!sheetNamesCache.names.includes(sheetName)) {
      sheetNamesCache.names.push(sheetName);
    }
    sheetNamesCache.expiresAt = now + CACHE_TTL_MS;
  }
}

function invalidateSheetCaches(_sheetName) {
  // Não invalida nome de aba nem header — eles foram atualizados na via que escreveu.
  // Invalidar aqui forçava re-fetch desnecessário e estourava quota de leitura.
}

async function getHeaderRow(sheetName, fallbackHeaders) {
  const now = Date.now();
  const cached = headerCache.get(sheetName);
  if (cached && cached.expiresAt > now) {
    return cached.headers;
  }

  const sheets = getSheets();
  const headRes = await withRetry(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    }),
    `getHeaderRow:${sheetName}`
  );

  const headers = (headRes.data.values && headRes.data.values[0]) || fallbackHeaders;
  headerCache.set(sheetName, { headers, expiresAt: now + CACHE_TTL_MS });
  return headers;
}

function isSheetTabNotFound(err) {
  const message = String(err?.message || '');
  return message.includes('Unable to parse range') || message.includes('Range not found');
}

async function readSheetValuesSafe(sheetName, rangeSuffix) {
  const sheets = getSheets();
  try {
    const res = await withRetry(
      () => sheets.spreadsheets.values.get({
        spreadsheetId: env.spreadsheetId,
        range: `${sheetName}!${rangeSuffix}`,
      }),
      `values.get:${sheetName}`
    );
    return res.data.values || [];
  } catch (err) {
    if (isSheetTabNotFound(err)) return null;
    throw err;
  }
}

function colLetter(n) {
  let s = '';
  let cursor = n;
  while (cursor > 0) {
    const r = (cursor - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    cursor = Math.floor((cursor - 1) / 26);
  }
  return s;
}

async function ensureSheetExists(sheetName, headers) {
  // Fast-path: já validamos esta aba no processo atual e o cache de headers cobre.
  if (ensuredSheets.has(sheetName)) return;

  const sheets = getSheets();
  const existingSheets = await listAllSheets();
  const lastCol = colLetter(Math.max(headers.length, 1));

  if (!existingSheets.includes(sheetName)) {
    logger.warn({ context: 'sheet_missing_creating', sheetName });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: env.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: { rowCount: 1000, columnCount: Math.max(headers.length + 4, 20) },
              },
            },
          },
        ],
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:${lastCol}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });

    setSheetKnown(sheetName);
    headerCache.set(sheetName, { headers: [...headers], expiresAt: Date.now() + CACHE_TTL_MS });
    ensuredSheets.add(sheetName);
    return;
  }

  const headRes = await withRetry(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    }),
    `ensureSheetExists:${sheetName}`
  );

  const current = (headRes.data.values && headRes.data.values[0]) || [];
  const missing = headers.filter((header) => !current.includes(header));

  if (missing.length === 0) {
    headerCache.set(sheetName, { headers: current, expiresAt: Date.now() + CACHE_TTL_MS });
    ensuredSheets.add(sheetName);
    return;
  }

  const merged = [...current, ...missing];
  const patchCol = colLetter(merged.length);

  await withRetry(
    () => sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:${patchCol}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [merged] },
    }),
    `ensureSheetExists.patch:${sheetName}`
  );

  headerCache.set(sheetName, { headers: merged, expiresAt: Date.now() + CACHE_TTL_MS });
  ensuredSheets.add(sheetName);
}

function rowToObject(headerRow, row, expectedHeaders) {
  const obj = {};
  for (const expectedHeader of expectedHeaders) {
    obj[expectedHeader] = '';
  }
  headerRow.forEach((header, index) => {
    obj[header] = row[index] ?? '';
  });
  return obj;
}

export async function listRows(type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo invalido: ${type}`);

  const values = await readSheetValuesSafe(config.name, 'A1:ZZ');
  if (!values || values.length <= 1) return [];

  const [headerRow, ...rows] = values;
  return rows.map((row) => rowToObject(headerRow, row, config.headers));
}

/**
 * batchListRows: faz UMA chamada Sheets (`values.batchGet`) para várias abas.
 * Reduz drasticamente o consumo de quota quando o frontend precisa carregar
 * muitas entidades de uma vez (ex.: Dashboard).
 */
export async function batchListRows(types) {
  const validTypes = types.filter((t) => SHEET_CONFIG[t]);
  if (validTypes.length === 0) return {};

  const sheets = getSheets();
  const ranges = validTypes.map((t) => `${SHEET_CONFIG[t].name}!A1:ZZ`);

  const res = await withRetry(
    () => sheets.spreadsheets.values.batchGet({
      spreadsheetId: env.spreadsheetId,
      ranges,
    }),
    `batchGet:${validTypes.join(',')}`
  );

  const out = {};
  const valueRanges = res.data.valueRanges || [];
  validTypes.forEach((type, idx) => {
    const config = SHEET_CONFIG[type];
    const values = valueRanges[idx]?.values || [];
    if (values.length <= 1) {
      out[type] = [];
      return;
    }
    const [headerRow, ...rows] = values;
    out[type] = rows.map((row) => rowToObject(headerRow, row, config.headers));
  });

  return out;
}

export async function getRowById(id, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo invalido: ${type}`);

  const values = await readSheetValuesSafe(config.name, 'A1:ZZ');
  if (!values || values.length <= 1) return null;

  const [headerRow, ...rows] = values;
  const idIdx = headerRow.indexOf('id');
  if (idIdx < 0) return null;

  const match = rows.find((row) => row[idIdx] === String(id));
  if (!match) return null;

  return rowToObject(headerRow, match, config.headers);
}

export class DuplicateIdError extends Error {
  constructor(id, type) {
    super(`Row with id "${id}" already exists in ${type}`);
    this.code = 'duplicate_id';
    this.id = id;
    this.type = type;
  }
}

export async function insertRow(data) {
  const type = detectSheetType(data);
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo nao reconhecido para os dados: ${JSON.stringify(data)}`);

  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  const rowData = { ...data };
  if (!rowData.id) rowData.id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  if (!rowData.created_at) rowData.created_at = new Date().toISOString();

  // Garante unicidade de ID — append cego sem essa checagem permitia sobrescrever
  // dados (atacante mandando id="demo_aluno" criava linha duplicada).
  // Se o caller passar um id explícito que já existe, recusa.
  if (data.id) {
    const existing = await getRowById(rowData.id, type);
    if (existing) {
      throw new DuplicateIdError(rowData.id, type);
    }
  }

  const headerRow = await getHeaderRow(config.name, config.headers);
  const newRow = headerRow.map((header) =>
    rowData[header] !== undefined && rowData[header] !== null ? sanitizeSheetCellValue(rowData[header]) : ''
  );

  const lastCol = colLetter(headerRow.length);

  await withRetry(
    () => sheets.spreadsheets.values.append({
      spreadsheetId: env.spreadsheetId,
      range: `${config.name}!A:${lastCol}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newRow] },
    }),
    `insertRow:${config.name}`
  );

  invalidateSheetCaches(config.name);
  return { success: true, sheet: config.name, id: rowData.id };
}

export async function updateRow(id, data, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo invalido: ${type}`);

  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);
  const values = await readSheetValuesSafe(config.name, 'A1:ZZ');

  if (!values || values.length <= 1) return false;

  const [headerRow, ...rows] = values;
  const idIdx = headerRow.indexOf('id');
  if (idIdx < 0) return false;

  const rowIndex = rows.findIndex((row) => row[idIdx] === String(id));
  if (rowIndex < 0) return false;

  const currentRow = rows[rowIndex];
  const updatedRow = headerRow.map((header, index) => {
    if (header === 'id') return id;
    if (data[header] !== undefined && data[header] !== null) return sanitizeSheetCellValue(data[header]);
    return currentRow[index] ?? '';
  });

  const lastCol = colLetter(headerRow.length);
  const targetRange = `${config.name}!A${rowIndex + 2}:${lastCol}${rowIndex + 2}`;

  await withRetry(
    () => sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range: targetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [updatedRow] },
    }),
    `updateRow:${config.name}`
  );

  invalidateSheetCaches(config.name);
  return { success: true, sheet: config.name, id };
}

export function getOAuthClientInstance() {
  return getOAuthClient();
}

export { detectSheetType, SHEET_CONFIG };
