/**
 * Middleware de headers HTTP de segurança.
 * Protege contra clickjacking, MIME sniffing, XSS refletido, etc.
 */
export function securityHeadersMiddleware(_req, res, next) {
  // Prevenir MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Controlar Referrer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // DNS prefetch
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Não cachear respostas da API por padrão
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // Remover header que expõe tecnologia do server
  res.removeHeader('X-Powered-By');

  // Permissions Policy — restringir recursos do browser
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // HSTS — forçar HTTPS (apenas em produção)
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  next();
}
