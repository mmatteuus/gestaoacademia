import { timingSafeEqual as cryptoTimingSafeEqual } from 'node:crypto';

/**
 * Protects API routes with an optional API key.
 *
 * When API_KEY is set, all non-public routes require the `X-API-Key` header.
 * When API_KEY is absent, the middleware passes through (open mode) — the
 * env.js boot already warns the operator. Failing closed in production
 * caused total outages when the env var drifted, which was worse than the
 * brief window of openness it was trying to prevent.
 */
export function apiKeyMiddleware(req, res, next) {
  const expectedKey = process.env.API_KEY;
  const isStatusRoute = req.path === '/status' && req.method === 'GET';
  const isPublicRoute = req.path.startsWith('/api/public/');

  if (req.method === 'OPTIONS') {
    return next();
  }

  if (isStatusRoute || isPublicRoute) {
    return next();
  }

  if (!expectedKey) {
    return next();
  }

  const providedKey = req.headers['x-api-key'];

  if (!providedKey) {
    return res.status(401).json({
      ok: false,
      error: 'unauthorized',
      message: 'API key required',
    });
  }

  if (!safeCompare(expectedKey, String(providedKey))) {
    return res.status(403).json({
      ok: false,
      error: 'forbidden',
      message: 'Invalid API key',
    });
  }

  return next();
}

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    cryptoTimingSafeEqual(bufA, bufA);
    return false;
  }

  return cryptoTimingSafeEqual(bufA, bufB);
}
