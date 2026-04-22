import dotenv from 'dotenv';

dotenv.config();

export const env = {
  spreadsheetId: process.env.SPREADSHEET_ID,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsAllowlist: (process.env.CORS_ALLOWLIST || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  bodyLimit: process.env.API_BODY_LIMIT || '64kb',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMaxMutations: Number(process.env.RATE_LIMIT_MAX_MUTATIONS || 120),
};

export function assertGoogleEnv() {
  if (!env.spreadsheetId || !env.googleClientId || !env.googleClientSecret || !env.googleRefreshToken) {
    throw new Error('Missing Google Sheets environment variables');
  }
}
