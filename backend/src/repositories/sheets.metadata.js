import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { getSheets, withRetry } from './sheets.client.js';

const CACHE_TTL_MS = 5 * 60_000;
const sheetNamesCache = { expiresAt: 0, names: null };
const headerCache = new Map();
const ensuredSheets = new Set();

export function colLetter(n) {
  let result = '';
  let cursor = n;

  while (cursor > 0) {
    const remainder = (cursor - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    cursor = Math.floor((cursor - 1) / 26);
  }

  return result;
}

export function rowToObject(headerRow, row, expectedHeaders) {
  const object = {};
  for (const header of expectedHeaders) object[header] = '';
  headerRow.forEach((header, index) => {
    object[header] = row[index] ?? '';
  });
  return object;
}

export async function listAllSheets() {
  const now = Date.now();
  if (sheetNamesCache.names && sheetNamesCache.expiresAt > now) {
    return [...sheetNamesCache.names];
  }

  const sheets = getSheets();
  const response = await withRetry(
    () => sheets.spreadsheets.get({ spreadsheetId: env.spreadsheetId }),
    'spreadsheets.get',
  );
  const names = (response.data.sheets || []).map((sheet) => sheet.properties.title);
  sheetNamesCache.names = names;
  sheetNamesCache.expiresAt = now + CACHE_TTL_MS;
  return names;
}

function setSheetKnown(sheetName) {
  if (!sheetNamesCache.names) return;
  if (!sheetNamesCache.names.includes(sheetName)) sheetNamesCache.names.push(sheetName);
  sheetNamesCache.expiresAt = Date.now() + CACHE_TTL_MS;
}

export async function getHeaderRow(sheetName, fallbackHeaders) {
  const now = Date.now();
  const cached = headerCache.get(sheetName);
  if (cached && cached.expiresAt > now) return cached.headers;

  const sheets = getSheets();
  const response = await withRetry(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    }),
    `getHeaderRow:${sheetName}`,
  );
  const headers = response.data.values?.[0] || fallbackHeaders;
  headerCache.set(sheetName, { headers, expiresAt: now + CACHE_TTL_MS });
  return headers;
}

function isSheetTabNotFound(error) {
  const message = String(error?.message || '');
  return message.includes('Unable to parse range') || message.includes('Range not found');
}

export async function readSheetValuesSafe(sheetName, rangeSuffix) {
  const sheets = getSheets();

  try {
    const response = await withRetry(
      () => sheets.spreadsheets.values.get({
        spreadsheetId: env.spreadsheetId,
        range: `${sheetName}!${rangeSuffix}`,
      }),
      `values.get:${sheetName}`,
    );
    return response.data.values || [];
  } catch (error) {
    if (isSheetTabNotFound(error)) return null;
    throw error;
  }
}

export async function ensureSheetExists(sheetName, headers) {
  if (ensuredSheets.has(sheetName)) return;

  const sheets = getSheets();
  const existingSheets = await listAllSheets();
  const lastCol = colLetter(Math.max(headers.length, 1));

  if (!existingSheets.includes(sheetName)) {
    logger.warn({ context: 'sheet_missing_creating', sheetName });
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: env.spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: {
                rowCount: 1000,
                columnCount: Math.max(headers.length + 4, 20),
              },
            },
          },
        }],
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

  const response = await withRetry(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    }),
    `ensureSheetExists:${sheetName}`,
  );
  const current = response.data.values?.[0] || [];
  const missing = headers.filter((header) => !current.includes(header));

  if (missing.length > 0) {
    const merged = [...current, ...missing];
    await withRetry(
      () => sheets.spreadsheets.values.update({
        spreadsheetId: env.spreadsheetId,
        range: `${sheetName}!A1:${colLetter(merged.length)}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [merged] },
      }),
      `ensureSheetExists.patch:${sheetName}`,
    );
    headerCache.set(sheetName, { headers: merged, expiresAt: Date.now() + CACHE_TTL_MS });
  } else {
    headerCache.set(sheetName, { headers: current, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  ensuredSheets.add(sheetName);
}
