import { env } from '../config/env.js';
import { detectSheetType, SHEET_CONFIG } from '../config/sheet-config.js';
import { sanitizeSheetCellValue } from '../lib/normalizers.js';
import { getSheets, withRetry } from './sheets.client.js';
import { colLetter, ensureSheetExists, getHeaderRow, readSheetValuesSafe } from './sheets.metadata.js';
import { getRowById } from './sheets.read.js';

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

  await ensureSheetExists(config.name, config.headers);
  const rowData = { ...data };
  if (!rowData.id) rowData.id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  if (!rowData.created_at) rowData.created_at = new Date().toISOString();

  if (data.id) {
    const existing = await getRowById(rowData.id, type);
    if (existing) throw new DuplicateIdError(rowData.id, type);
  }

  const headerRow = await getHeaderRow(config.name, config.headers);
  const newRow = headerRow.map((header) => (
    rowData[header] !== undefined && rowData[header] !== null
      ? sanitizeSheetCellValue(rowData[header])
      : ''
  ));
  const sheets = getSheets();
  await withRetry(
    () => sheets.spreadsheets.values.append({
      spreadsheetId: env.spreadsheetId,
      range: `${config.name}!A:${colLetter(headerRow.length)}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newRow] },
    }),
    `insertRow:${config.name}`,
  );

  return { success: true, sheet: config.name, id: rowData.id };
}

export async function updateRow(id, data, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo invalido: ${type}`);

  await ensureSheetExists(config.name, config.headers);
  const values = await readSheetValuesSafe(config.name, 'A1:ZZ');
  if (!values || values.length <= 1) return false;

  const [headerRow, ...rows] = values;
  const idIndex = headerRow.indexOf('id');
  if (idIndex < 0) return false;
  const rowIndex = rows.findIndex((row) => row[idIndex] === String(id));
  if (rowIndex < 0) return false;

  const currentRow = rows[rowIndex];
  const updatedRow = headerRow.map((header, index) => {
    if (header === 'id') return id;
    if (data[header] !== undefined && data[header] !== null) {
      return sanitizeSheetCellValue(data[header]);
    }
    return currentRow[index] ?? '';
  });

  const sheets = getSheets();
  const targetRange = `${config.name}!A${rowIndex + 2}:${colLetter(headerRow.length)}${rowIndex + 2}`;
  await withRetry(
    () => sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range: targetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [updatedRow] },
    }),
    `updateRow:${config.name}`,
  );

  return { success: true, sheet: config.name, id };
}
