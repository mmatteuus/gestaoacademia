import { describe, it, expect, beforeAll } from 'vitest';
import { listRows, getRowById, insertRow, updateRow } from './index.js';

const runRealIntegration = process.env.RUN_REAL_INTEGRATION === 'true';
const describeReal = runRealIntegration ? describe : describe.skip;

describeReal('Google Sheets CRUD Integration Tests (aba Alunos)', () => {
  let testId;

  beforeAll(() => {
    testId = 'it_' + Date.now();
  });

  it('insere nova linha na planilha', async () => {
    const data = {
      id: testId,
      nome: 'Teste Integracao',
      email: `teste${testId}@example.com`,
      status: 'ativo',
      plano: 'mensal',
      data_matricula: new Date().toISOString().slice(0, 10),
    };
    const result = await insertRow(data);
    expect(result).toMatchObject({ success: true, sheet: 'Alunos', id: testId });
  }, 30000);

  it('lista todas as linhas e encontra a inserida', async () => {
    const rows = await listRows('Alunos');
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    const found = rows.find(r => r.id === testId);
    expect(found).toBeDefined();
    expect(found.nome).toBe('Teste Integracao');
  }, 30000);

  it('busca linha específica por ID', async () => {
    const row = await getRowById(testId, 'Alunos');
    expect(row).not.toBeNull();
    expect(row.id).toBe(testId);
    expect(row.nome).toBe('Teste Integracao');
  }, 30000);

  it('atualiza linha existente', async () => {
    const updated = await updateRow(testId, { nome: 'Atualizado', status: 'inativo' }, 'Alunos');
    expect(updated).toMatchObject({ success: true, sheet: 'Alunos', id: testId });
    const row = await getRowById(testId, 'Alunos');
    expect(row.nome).toBe('Atualizado');
    expect(row.status).toBe('inativo');
  }, 30000);
});
