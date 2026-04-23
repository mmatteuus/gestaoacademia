import express from 'express';
import { env } from './backend/src/config/env.js';
import { createAppRouter } from './backend/src/routes/app.routes.js';
import { corsMiddleware } from './backend/src/middlewares/cors.middleware.js';
import { createMutationRateLimiter, createGlobalRateLimiter } from './backend/src/middlewares/rate-limit.middleware.js';
import { securityHeadersMiddleware } from './backend/src/middlewares/security-headers.middleware.js';
import { apiKeyMiddleware } from './backend/src/middlewares/api-key.middleware.js';
import { errorMiddleware } from './backend/src/middlewares/error.middleware.js';
import { logger } from './backend/src/lib/logger.js';

const app = express();
app.set('trust proxy', true);

// Desabilitar header que expõe tecnologia
app.disable('x-powered-by');

// Headers de segurança — primeiro de tudo
app.use(securityHeadersMiddleware);

// CORS
app.use(corsMiddleware);

// Body parser com limite
app.use(express.json({ limit: env.bodyLimit }));

// Rate limit global (inclui leitura)
const globalLimiter = createGlobalRateLimiter({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxReads,
});
app.use(globalLimiter);

// Rate limit para mutações (mais restritivo).
// Aplicado globalmente — o middleware já filtra internamente por método (POST/PUT/PATCH/DELETE).
// Usar `app.use(['/rows','/api'], ...)` antigamente fazia match só nos paths exatos
// `/rows` e `/api`, escapando `/rows/123` e `/api/sales` (rate limit ineficaz).
const mutationLimiter = createMutationRateLimiter({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxMutations,
});
app.use(mutationLimiter);

// API Key (se configurada)
app.use(apiKeyMiddleware);

// Rotas
app.use(createAppRouter());

// Error handler
app.use(errorMiddleware);

if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    logger.info({ context: 'server_started', port: env.port, endpoints: ['/rows', '/status', '/api/*'] });
  });
}

export default app;
