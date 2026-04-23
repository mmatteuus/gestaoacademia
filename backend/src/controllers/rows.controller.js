import { HttpError } from '../middlewares/error.middleware.js';
import { rowIdParamsSchema, rowPayloadSchema, rowsQuerySchema, validate } from '../validators/api.schemas.js';
import { createRow, editRow, getRow, listRowsByType } from '../services/rows.service.js';
import { SHEET_TYPES } from '../config/sheet-config.js';
import { DuplicateIdError, batchListRows } from '../repositories/sheets.repository.js';

function parseRowsQuery(query) {
  const parsed = validate(rowsQuerySchema, query);
  if (!parsed.ok) {
    throw new HttpError(400, 'validation_error', 'Invalid query params', parsed.details);
  }
  return parsed.data;
}

function parseRowId(params) {
  const parsed = validate(rowIdParamsSchema, params);
  if (!parsed.ok) {
    throw new HttpError(400, 'validation_error', 'Invalid row id', parsed.details);
  }
  return parsed.data;
}

function parsePayload(body) {
  const parsed = validate(rowPayloadSchema, body);
  if (!parsed.ok) {
    throw new HttpError(400, 'validation_error', 'Invalid payload', parsed.details);
  }
  return parsed.data;
}

export async function listRowsController(req, res) {
  const { type } = parseRowsQuery(req.query);
  const rows = await listRowsByType(type);
  res.json(rows);
}

export async function batchListRowsController(req, res) {
  const raw = String(req.query.types || '').trim();
  if (!raw) throw new HttpError(400, 'validation_error', 'types query is required (comma-separated)');
  const requested = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const valid = requested.filter((t) => SHEET_TYPES.includes(t));
  if (valid.length === 0) throw new HttpError(400, 'validation_error', 'no valid types in request');
  if (valid.length > 20) throw new HttpError(400, 'validation_error', 'too many types (max 20)');

  // Fallback gracioso: se o batchGet inteiro falhar (quota, network), devolve objeto vazio
  // com 200. O frontend pode tratar caches vazios sem quebrar a UI inteira, e as queries
  // individuais subsequentes ainda têm chance de funcionar (com cache server-side aquecido).
  try {
    const result = await batchListRows(valid);
    // Cache curto no navegador: F5 dentro de 30s não estoura quota Sheets.
    res.removeHeader('Pragma');
    res.removeHeader('Expires');
    res.removeHeader('Surrogate-Control');
    res.setHeader('Cache-Control', 'private, max-age=30');
    res.json(result);
  } catch (_err) {
    res.json({});
  }
}

export async function getRowController(req, res) {
  const { id } = parseRowId(req.params);
  const { type } = parseRowsQuery(req.query);

  const row = await getRow(type, id);
  if (!row) {
    throw new HttpError(404, 'operation_failed', 'Not found');
  }

  res.json(row);
}

export async function createRowController(req, res) {
  const payload = parsePayload(req.body || {});
  try {
    const result = await createRow(payload);
    res.status(201).json({ ok: true, data: result });
  } catch (err) {
    if (err instanceof DuplicateIdError) {
      throw new HttpError(409, 'duplicate_id', `id "${err.id}" já existe em ${err.type}`);
    }
    throw err;
  }
}

export async function updateRowController(req, res) {
  const { id } = parseRowId(req.params);
  const { type } = parseRowsQuery(req.query);
  const payload = parsePayload(req.body || {});

  const updated = await editRow(type, id, payload);
  if (!updated) {
    throw new HttpError(404, 'operation_failed', 'Not found');
  }

  res.json({ ok: true, data: updated });
}

export function statusController(_req, res) {
  res.json({ status: 'online', sheets: SHEET_TYPES });
}
