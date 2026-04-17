import express from 'express';
import { listRows, getRowById, insertRow, updateRow, SHEET_CONFIG } from './index.js';

const app = express();
app.use(express.json());

function normalizeType(rawType) {
  if (typeof rawType !== 'string' || !rawType.trim()) return 'Alunos';
  return rawType.trim();
}

function resolveType(req, res) {
  const type = normalizeType(req.query.type);
  if (!SHEET_CONFIG[type]) {
    res.status(400).json({ error: 'Invalid sheet type' });
    return null;
  }
  return type;
}

function errorSummary(err) {
  return {
    message: err?.message || 'Unknown error',
    code: err?.code,
    status: err?.status,
    responseStatus: err?.response?.status,
    responseData: err?.response?.data,
    stack: err?.stack,
  };
}

function logServerError(context, err, extra = {}) {
  console.error(
    JSON.stringify({
      level: 'error',
      context,
      ...extra,
      error: errorSummary(err),
      at: new Date().toISOString(),
    })
  );
}

function errorHttpStatus(err) {
  const message = String(err?.message || '');
  if (message.startsWith('Tipo inválido') || message.startsWith('Tipo não reconhecido')) {
    return 400;
  }
  return 500;
}

app.get('/rows', async (req, res) => {
  const type = resolveType(req, res);
  if (!type) return;

  try {
    const rows = await listRows(type);
    res.json(rows);
  } catch (err) {
    logServerError('list_rows_failed', err, { type });
    const status = errorHttpStatus(err);
    res.status(status).json({ error: status === 400 ? 'Invalid request' : 'Internal server error' });
  }
});

app.get('/rows/:id', async (req, res) => {
  const type = resolveType(req, res);
  if (!type) return;

  try {
    const row = await getRowById(req.params.id, type);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    logServerError('get_row_failed', err, { type, id: req.params.id });
    const status = errorHttpStatus(err);
    res.status(status).json({ error: status === 400 ? 'Invalid request' : 'Internal server error' });
  }
});

app.post('/rows', async (req, res) => {
  try {
    await insertRow(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    logServerError('insert_row_failed', err);
    const status = errorHttpStatus(err);
    res.status(status).json({ error: status === 400 ? 'Invalid request' : 'Internal server error' });
  }
});

app.put('/rows/:id', async (req, res) => {
  const type = resolveType(req, res);
  if (!type) return;

  try {
    const ok = await updateRow(req.params.id, req.body, type);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    logServerError('update_row_failed', err, { type, id: req.params.id });
    const status = errorHttpStatus(err);
    res.status(status).json({ error: status === 400 ? 'Invalid request' : 'Internal server error' });
  }
});

app.get('/status', (req, res) => {
  res.json({ status: 'online', sheets: Object.keys(SHEET_CONFIG) });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Endpoints: /rows?type=<Alunos|Financeiro|...> | /status');
  });
}

export default app;
