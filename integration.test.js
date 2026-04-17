import { describe, it, expect, beforeAll } from 'vitest';
import { listRows, getRowById, insertRow, updateRow } from './index.js';

describe('Google Sheets CRUD Integration Tests', () => {
  let testId;
  
  beforeAll(() => {
    testId = String(Date.now());
  });

  it('insere nova linha na planilha', async () => {
    const data = {
      id: testId,
      nome: 'Teste Integracao',
      email: `teste${testId}@example.com`,
      status: 'ativo',
      created_at: new Date().toISOString(),
    };
    const result = await insertRow(data);
    expect(result).toBe(true);
  }, 30000);

  it('lista todas as linhas e encontra a inserida', async () => {
    const rows = await listRows();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    const found = rows.find(r => r.id === testId);
    expect(found).toBeDefined();
    expect(found.nome).toBe('Teste Integracao');
  }, 30000);

  it('busca linha específica por ID', async () => {
    const row = await getRowById(testId);
    expect(row).not.toBeNull();
    expect(row.id).toBe(testId);
    expect(row.nome).toBe('Teste Integracao');
  }, 30000);

  it('atualiza linha existente', async () => {
    const updated = await updateRow(testId, { nome: 'Atualizado', status: 'inativo' });
    expect(updated).toBe(true);
    const row = await getRowById(testId);
    expect(row.nome).toBe('Atualizado');
    expect(row.status).toBe('inativo');
  }, 30000);
}, { timeout: 60000 });
