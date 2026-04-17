import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import request from 'supertest';

process.env.VERCEL = '1';
const { default: app } = await import('./server.js');

describe('Backend audit guards', () => {
  it('keeps full-range sheet reads (no hard cap at row 1000)', () => {
    const sourcePath = path.resolve(process.cwd(), 'index.js');
    const source = readFileSync(sourcePath, 'utf8');
    expect(source.includes('A1:ZZ1000')).toBe(false);
  });

  it('exposes health route', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.body?.status).toBe('online');
    expect(Array.isArray(res.body?.sheets)).toBe(true);
  });

  it('rejects invalid sheet type on list route', async () => {
    const res = await request(app).get('/rows').query({ type: 'TipoInvalido' });
    expect(res.status).toBe(400);
    expect(res.body?.error).toBe('Invalid sheet type');
  });
});
