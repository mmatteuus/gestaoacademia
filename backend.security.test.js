import { describe, expect, it, vi } from 'vitest';
import { sanitizeSheetCellValue } from './backend/src/lib/normalizers.js';
import { corsMiddleware } from './backend/src/middlewares/cors.middleware.js';
import { createMutationRateLimiter } from './backend/src/middlewares/rate-limit.middleware.js';

describe('Security controls', () => {
  it('sanitizes spreadsheet formula injection payloads', () => {
    expect(sanitizeSheetCellValue('=SUM(A1:A2)')).toBe("'=SUM(A1:A2)");
    expect(sanitizeSheetCellValue('+cmd')).toBe("'+cmd");
    expect(sanitizeSheetCellValue('normal text')).toBe('normal text');
  });

  it('blocks CORS request from disallowed origin', () => {
    const req = { headers: { origin: 'https://evil.example.com' }, method: 'GET' };
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    const next = vi.fn();

    corsMiddleware(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('enforces mutation rate limit', () => {
    const limiter = createMutationRateLimiter({ windowMs: 60_000, max: 1 });
    const req = { method: 'POST', headers: {}, ip: '127.0.0.1' };
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        return this;
      },
    };
    const next = vi.fn();

    limiter(req, res, next);
    limiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(429);
  });
});
