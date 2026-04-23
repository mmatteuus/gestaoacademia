import { describe, expect, it, vi } from 'vitest';
import { sanitizeSheetCellValue } from './backend/src/lib/normalizers.js';
import { corsMiddleware } from './backend/src/middlewares/cors.middleware.js';
import { createMutationRateLimiter } from './backend/src/middlewares/rate-limit.middleware.js';
import { apiKeyMiddleware } from './backend/src/middlewares/api-key.middleware.js';
import { securityHeadersMiddleware } from './backend/src/middlewares/security-headers.middleware.js';

function restoreEnvVar(key, value) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }
  process.env[key] = value;
}

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

  it('fails closed in production when API_KEY is not configured', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevApiKey = process.env.API_KEY;
    process.env.NODE_ENV = 'production';
    delete process.env.API_KEY;

    const req = { method: 'GET', path: '/rows', headers: {} };
    const res = {
      statusCode: 200,
      payload: null,
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

    apiKeyMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(503);
    expect(res.payload).toMatchObject({ ok: false, error: 'service_unavailable' });

    restoreEnvVar('NODE_ENV', prevNodeEnv);
    restoreEnvVar('API_KEY', prevApiKey);
  });

  it('keeps public route open even in production without API_KEY', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    const prevApiKey = process.env.API_KEY;
    process.env.NODE_ENV = 'production';
    delete process.env.API_KEY;

    const req = { method: 'POST', path: '/api/public/aluno-cadastro', headers: {} };
    const res = {
      status() {
        return this;
      },
      json() {
        return this;
      },
    };
    const next = vi.fn();

    apiKeyMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    restoreEnvVar('NODE_ENV', prevNodeEnv);
    restoreEnvVar('API_KEY', prevApiKey);
  });

  it('sets strict security headers including CSP', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const headers = {};
    const req = {};
    const res = {
      setHeader(name, value) {
        headers[name] = value;
      },
      removeHeader() {
        return undefined;
      },
    };
    const next = vi.fn();

    securityHeadersMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Content-Security-Policy']).toContain("default-src 'none'");
    expect(headers['Strict-Transport-Security']).toContain('max-age=');

    restoreEnvVar('NODE_ENV', prevNodeEnv);
  });
});
