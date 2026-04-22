import { env } from '../config/env.js';

function getAllowedOrigins() {
  const defaults = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
  ];

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  return new Set([...defaults, ...(vercelUrl ? [vercelUrl] : []), ...env.corsAllowlist]);
}

const allowedOrigins = getAllowedOrigins();

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (!origin) {
    if (req.method === 'OPTIONS') return res.status(204).end();
    return next();
  }

  if (!allowedOrigins.has(origin)) {
    return res.status(403).json({ ok: false, error: 'operation_failed', message: 'Origin not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  return next();
}
