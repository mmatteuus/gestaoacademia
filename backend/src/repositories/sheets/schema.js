import { env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';
import {
  cacheHeader,
  cacheSheetNames,
  getCachedHeader,
  getCachedSheetNames,
  isSheetEnsured,
  markSheetEnsured,
  setSheetKnown,
} from './cache.js';
import { getSheets, withRetry } from './client.js';

export async function listAllSheets() {
  const cached = getCachedSheetNames();
  if (cached) return cached;

  const sheets = getSheets();
  const response = await withRetry(
    () => sheets.spreadsheets.get({ spreadsheetId: env.spreadsheetId }),
    'spreadsheets.get',
  );
  const names = (response.data.sheets || []).map((sheet) => sheet.properties.title);
  cacheSheetNames(names);
  return names;
}

export async function getHeaderRow(sheetName, fallbackHeaders) {
  const cached = getCachedHeader(sheetName);
  if (cached) return cached;

  const sheets = getSheets();
  const response = await withRetry(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    }),
    `getHeaderRow:${sheetName}`,
  );

  const headers = (response.data.values && response.data.values[0]) || fallbackHeaders;
  cacheHeader(sheetName, headers);
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

export function colLetter(columnNumber) {
  let letters = '';
  let cursor = columnNumber;

  while (cursor > 0) {
    const remainder = (cursor - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    cursor = Math.floor((cursor - 1) / 26);
  }

  return letters;
}

export async function ensureSheetExists(sheetName, headers) {
  if (isSheetEnsured(sheetName)) return;

  const sheets = getSheets();
  const existingSheets = await listAllSheets();
  const lastColumn = colLetter(Math.max(headers.length, 1));

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
                gridProperties: {
                  rowCount: 1000,
                  columnCount: Math.max(headers.length + 4, 20),
                },
              },
            },
          },
        ],
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:${lastColumn}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });

    setSheetKnown(sheetName);
    cacheHeader(sheetName, headers);
    markSheetEnsured(sheetName);
    return;
  }

  const response = await withRetry(
    () => sheets.spreadsheets.values.get({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:ZZ1`,
    }),
    `ensureSheetExists:${sheetName}`,
  );

  const currentHeaders = (response.data.values && response.data.values[0]) || [];
  const missingHeaders = headers.filter((header) => !currentHeaders.includes(header));

  if (missingHeaders.length === 0) {
    cacheHeader(sheetName, currentHeaders);
    markSheetEnsured(sheetName);
    return;
  }

  const mergedHeaders = [...currentHeaders, ...missingHeaders];
  const patchColumn = colLetter(mergedHeaders.length);

  await withRetry(
    () => sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range: `${sheetName}!A1:${patchColumn}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [mergedHeaders] },
    }),
    `ensureSheetExists.patch:${sheetName}`,
  );

  cacheHeader(sheetName, mergedHeaders);
  markSheetEnsured(sheetName);
}

export function rowToObject(headerRow, row, expectedHeaders) {
  const output = {};

  for (const expectedHeader of expectedHeaders) output[expectedHeader] = '';
  headerRow.forEach((header, index) => {
    output[header] = row[index] ?? '';
  });

  return output;
}
