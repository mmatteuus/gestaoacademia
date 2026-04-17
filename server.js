import express from 'express';
import dotenv from 'dotenv';
import { listRows, getRowById, insertRow, updateRow } from './index.js';

dotenv.config();
const app = express();
app.use(express.json());

// Rotas dinâmicas baseadas em query params (?type=Alunos, ?type=Financeiro, etc)
app.get('/rows', async (req, res) => {
  try {
    const type = req.query.type || 'Alunos';
    const rows = await listRows(type);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/rows/:id', async (req, res) => {
  try {
    const type = req.query.type || 'Alunos';
    const row = await getRowById(req.params.id, type);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/rows', async (req, res) => {
  try {
    // insertRow detecta o tipo automaticamente, mas podemos forçar via query se necessário
    await insertRow(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.put('/rows/:id', async (req, res) => {
  try {
    const type = req.query.type || 'Alunos';
    const ok = await updateRow(req.params.id, req.body, type);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Rota de status para health check
app.get('/status', (req, res) => {
  res.json({ status: 'online', sheets: Object.keys(SHEET_CONFIG) });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on', port));
