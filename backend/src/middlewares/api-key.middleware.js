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

  // Se não tem API_KEY configurada, passa direto (modo aberto)
  if (!expectedKey) {
    return next();
  }

  // Rotas que não precisam de autenticação
  if (req.path === '/status' && req.method === 'GET') {
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
