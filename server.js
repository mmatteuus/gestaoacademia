import express from 'express';
import { env } from './backend/src/config/env.js';
import { createAppRouter } from './backend/src/routes/app.routes.js';
import { corsMiddleware } from './backend/src/middlewares/cors.middleware.js';
import { createMutationRateLimiter } from './backend/src/middlewares/rate-limit.middleware.js';
import { errorMiddleware } from './backend/src/middlewares/error.middleware.js';
import { logger } from './backend/src/lib/logger.js';

const app = express();
app.set('trust proxy', true);

app.use(corsMiddleware);
app.use(express.json({ limit: env.bodyLimit }));

const mutationLimiter = createMutationRateLimiter({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxMutations,
});

app.use(['/rows', '/api'], mutationLimiter);
app.use(createAppRouter());
app.use(errorMiddleware);

if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    logger.info({ context: 'server_started', port: env.port, endpoints: ['/rows', '/status', '/api/*'] });
  });
}

export default app;
