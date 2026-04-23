import { env } from '../config/env.js';

/**
 * Monta a lista de origens permitidas.
 * Em produção: apenas CORS_ALLOWLIST e VERCEL_URL (sem localhost).
 * Em desenvolvimento: inclui localhost para dev local.
 */
function getAllowedOrigins() {
  const isProduction = env.nodeEnv === 'production' || !!process.env.VERCEL;

  const defaults = isProduction
    ? []
    : [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:3000',
      ];

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  return new Set([...defaults, ...(vercelUrl ? [vercelUrl] : []), ...env.corsAllowlist]);
}

const allowedOrigins = getAllowedOrigins();
const isProduction = env.nodeEnv === 'production' || !!process.env.VERCEL;

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (!origin) {
    if (req.method === 'OPTIONS') return res.status(204).end();
    // Em produção, request sem Origin (curl/Postman/server-to-server) só passa se:
    // - for GET/HEAD (same-origin do navegador frequentemente omite Origin em GET);
    // - OU tiver API key;
    // - OU for endpoint público.
    const safeMethod = req.method === 'GET' || req.method === 'HEAD';
    if (isProduction && !safeMethod && !req.headers['x-api-key'] && !req.path.startsWith('/api/public/')) {
      return res.status(403).json({ ok: false, error: 'operation_failed', message: 'Origin required' });
    }
    return next();
  }

  // Same-origin (frontend e API hospedados no mesmo domínio na Vercel) sempre passa.
  // Cobrimos os dois casos: Origin batendo com o Host atual (req.headers.host).
  const host = req.headers.host;
  const sameOrigin = host && (origin === `https://${host}` || origin === `http://${host}`);

  if (!sameOrigin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ ok: false, error: 'operation_failed', message: 'Origin not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,X-API-Key');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  return next();
}
