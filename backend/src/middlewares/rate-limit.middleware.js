const buckets = new Map();
const GC_SCAN_LIMIT = 64;

function sanitizePositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function cleanupBuckets(now, maxBuckets) {
  let scanned = 0;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
    scanned += 1;
    if (scanned >= GC_SCAN_LIMIT) break;
  }

  if (buckets.size <= maxBuckets) return;

  const orderedByExpiry = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
  while (buckets.size > maxBuckets && orderedByExpiry.length > 0) {
    const [key] = orderedByExpiry.shift();
    buckets.delete(key);
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

/**
 * Rate limiter para rotas de mutação (POST/PUT/PATCH/DELETE).
 */
export function createMutationRateLimiter({ windowMs, max, maxBuckets = 10_000 }) {
  const normalizedWindowMs = sanitizePositiveInt(windowMs, 60_000);
  const normalizedMax = sanitizePositiveInt(max, 120);
  const normalizedMaxBuckets = sanitizePositiveInt(maxBuckets, 10_000);

  return function mutationRateLimiter(req, res, next) {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const now = Date.now();
    cleanupBuckets(now, normalizedMaxBuckets);
    const key = `mut:${getClientIp(req)}`;
    const entry = buckets.get(key);

    if (!entry || entry.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + normalizedWindowMs });
      return next();
    }

    if (entry.count >= normalizedMax) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ ok: false, error: 'operation_failed', message: 'Too many requests' });
    }

    entry.count += 1;
    return next();
  };
}

/**
 * Rate limiter global (inclui leitura).
 * Mais permissivo que o de mutação.
 */
export function createGlobalRateLimiter({ windowMs, max, maxBuckets = 10_000 }) {
  const normalizedWindowMs = sanitizePositiveInt(windowMs, 60_000);
  const normalizedMax = sanitizePositiveInt(max, 300);
  const normalizedMaxBuckets = sanitizePositiveInt(maxBuckets, 10_000);

  return function globalRateLimiter(req, res, next) {
    const now = Date.now();
    cleanupBuckets(now, normalizedMaxBuckets);
    const key = `global:${getClientIp(req)}`;
    const entry = buckets.get(key);

    if (!entry || entry.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + normalizedWindowMs });
      return next();
    }

    if (entry.count >= normalizedMax) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ ok: false, error: 'operation_failed', message: 'Too many requests' });
    }

    entry.count += 1;
    return next();
  };
}
