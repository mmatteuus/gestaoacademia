import { timingSafeEqual as cryptoTimingSafeEqual } from 'node:crypto';

/**
 * Protects API routes with an optional API key.
 *
 * Production and Vercel deployments fail closed when API_KEY is missing.
 * Local development and tests stay open so the app can run without secrets.
 */
export function apiKeyMiddleware(req, res, next) {
  const expectedKey = process.env.API_KEY;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isTestRuntime = nodeEnv === 'test';
  const isProductionRuntime = nodeEnv === 'production' || (!isTestRuntime && !!process.env.VERCEL);
  const isStatusRoute = req.path === '/status' && req.method === 'GET';
  const isPublicRoute = req.path.startsWith('/api/public/');

  if (req.method === 'OPTIONS') {
    return next();
  }

  if (isStatusRoute || isPublicRoute) {
    return next();
  }

  if (!expectedKey) {
    if (isProductionRuntime) {
      return res.status(503).json({
        ok: false,
        error: 'service_unavailable',
        message: 'API key is not configured',
      });
    }

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
