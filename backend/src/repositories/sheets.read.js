import { env } from '../config/env.js';
import { SHEET_CONFIG } from '../config/sheet-config.js';
import { getSheets, withRetry } from './sheets.client.js';
import { listAllSheets, readSheetValuesSafe, rowToObject } from './sheets.metadata.js';

export async function listRows(type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo invalido: ${type}`);

  const values = await readSheetValuesSafe(config.name, 'A1:ZZ');
  if (!values || values.length <= 1) return [];

  const [headerRow, ...rows] = values;
  return rows.map((row) => rowToObject(headerRow, row, config.headers));
}

export async function batchListRows(types) {
  const validTypes = types.filter((type) => SHEET_CONFIG[type]);
  if (validTypes.length === 0) return {};

  const existingNames = await listAllSheets();
  const existingTypes = validTypes.filter((type) => existingNames.includes(SHEET_CONFIG[type].name));
  const output = Object.fromEntries(validTypes.map((type) => [type, []]));
  if (existingTypes.length === 0) return output;

  const sheets = getSheets();
  const ranges = existingTypes.map((type) => `${SHEET_CONFIG[type].name}!A1:ZZ`);
  const response = await withRetry(
    () => sheets.spreadsheets.values.batchGet({ spreadsheetId: env.spreadsheetId, ranges }),
    `batchGet:${existingTypes.join(',')}`,
  );

  const valueRanges = response.data.valueRanges || [];
  existingTypes.forEach((type, index) => {
    const config = SHEET_CONFIG[type];
    const values = valueRanges[index]?.values || [];
    if (values.length <= 1) return;
    const [headerRow, ...rows] = values;
    output[type] = rows.map((row) => rowToObject(headerRow, row, config.headers));
  });

  return output;
}

export async function getRowById(id, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo invalido: ${type}`);

  const values = await readSheetValuesSafe(config.name, 'A1:ZZ');
  if (!values || values.length <= 1) return null;

  const [headerRow, ...rows] = values;
  const idIndex = headerRow.indexOf('id');
  if (idIndex < 0) return null;

  const row = rows.find((item) => item[idIndex] === String(id));
  return row ? rowToObject(headerRow, row, config.headers) : null;
}
