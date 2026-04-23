import { timingSafeEqual as cryptoTimingSafeEqual } from 'node:crypto';

/**
 * Middleware de API Key simples para proteger rotas da API.
 * 
 * Se API_KEY está definida no env, todas as requests precisam enviar
 * o header `X-API-Key` com o valor correto.
 * 
 * Se API_KEY NÃO está definida, o middleware passa direto (modo aberto).
 * Isso permite migração gradual.
 */
export function apiKeyMiddleware(req, res, next) {
  const expectedKey = process.env.API_KEY;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isTestRuntime = nodeEnv === 'test';
  const isProductionRuntime = nodeEnv === 'production' || (!isTestRuntime && !!process.env.VERCEL);
  const isStatusRoute = req.path === '/status' && req.method === 'GET';
  const isPublicRoute = req.path.startsWith('/api/public/');

  // OPTIONS é tratado pelo CORS, mas mantemos bypass explícito por segurança.
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Rotas que não precisam de autenticação
  if (isStatusRoute || isPublicRoute) {
    return next();
  }

  // Em produção, ausência de API_KEY é falha de configuração e deve falhar fechado.
  // Em desenvolvimento/teste mantemos comportamento aberto para DX.
  if (!expectedKey) {
    // Se a chave não estiver configurada, permitimos a passagem (modo aberto).
    // O aviso de configuração ausente já é emitido pelo env.js no boot.
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

  // Comparação em tempo constante para prevenir timing attacks
  if (!safeCompare(expectedKey, String(providedKey))) {
    return res.status(403).json({
      ok: false,
      error: 'forbidden',
      message: 'Invalid API key',
    });
  }

  return next();
}

/**
 * Comparação em tempo constante para prevenir timing attacks.
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  // Se tamanhos diferentes, compara bufA consigo mesmo para gastar o mesmo tempo
  if (bufA.length !== bufB.length) {
    cryptoTimingSafeEqual(bufA, bufA);
    return false;
  }

  return cryptoTimingSafeEqual(bufA, bufB);
}
