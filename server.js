import express from 'express';
import dotenv from 'dotenv';
import { listRows, getRowById, insertRow, updateRow } from './index.js';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/rows', async (req, res) => {
  try {
    const rows = await listRows();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/rows/:id', async (req, res) => {
  try {
    const row = await getRowById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/rows', async (req, res) => {
  try {
    await insertRow(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.put('/rows/:id', async (req, res) => {
  try {
    const ok = await updateRow(req.params.id, req.body);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on', port));
