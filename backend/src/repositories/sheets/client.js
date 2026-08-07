import { google } from 'googleapis';
import { env, assertGoogleEnv } from '../../config/env.js';
import { logger } from '../../lib/logger.js';

let oauth2Client = null;

export async function withRetry(fn, label) {
  const delays = [400, 1000, 2500];
  let lastError;

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const code = error?.code || error?.response?.status;
      const message = String(error?.message || '');
      const retriable =
        code === 429 ||
        code === 503 ||
        code === 500 ||
        /Quota exceeded|rateLimitExceeded/i.test(message);

      if (!retriable || attempt === delays.length) throw error;

      lastError = error;
      logger.warn({
        context: 'sheets_retry',
        label,
        attempt: attempt + 1,
        code,
        message: message.slice(0, 200),
      });
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  }

  throw lastError;
}

function initAuth() {
  assertGoogleEnv();
  oauth2Client = new google.auth.OAuth2(env.googleClientId, env.googleClientSecret);
  oauth2Client.setCredentials({ refresh_token: env.googleRefreshToken });
  logger.info({ context: 'google_oauth_initialized' });
  return oauth2Client;
}

export function getOAuthClient() {
  if (!oauth2Client) initAuth();
  return oauth2Client;
}

export function getSheets() {
  return google.sheets({ version: 'v4', auth: getOAuthClient() });
}
