import { HttpError } from '../middlewares/error.middleware.js';
import { rowIdParamsSchema, rowPayloadSchema, rowsQuerySchema, validate } from '../validators/api.schemas.js';
import { createRow, editRow, getRow, listRowsByType } from '../services/rows.service.js';
import { SHEET_TYPES } from '../config/sheet-config.js';

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
  const result = await createRow(payload);
  res.status(201).json({ ok: true, data: result });
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
