import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Schema de validação para variáveis de ambiente.
 * Falha rápido se alguma var crítica estiver ausente.
 */
const envSchema = z.object({
  // Google Sheets — obrigatórias para o backend funcionar
  spreadsheetId: z.string().min(1, 'SPREADSHEET_ID é obrigatória'),
  googleClientId: z.string().min(1, 'GOOGLE_CLIENT_ID é obrigatória'),
  googleClientSecret: z.string().min(1, 'GOOGLE_CLIENT_SECRET é obrigatória'),
  googleRefreshToken: z.string().min(1, 'GOOGLE_REFRESH_TOKEN é obrigatória'),

  // Server
  port: z.number().int().min(1).max(65535),
  nodeEnv: z.enum(['development', 'production', 'test']),

  // Segurança
  corsAllowlist: z.array(z.string()),
  bodyLimit: z.string().min(1),
  rateLimitWindowMs: z.number().int().positive(),
  rateLimitMaxMutations: z.number().int().positive(),
  rateLimitMaxReads: z.number().int().positive(),

  // API Key (opcional — se ausente, API fica aberta)
  apiKey: z.string().min(16).optional(),
});

const rawEnv = {
  spreadsheetId: process.env.SPREADSHEET_ID || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsAllowlist: (process.env.CORS_ALLOWLIST || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  bodyLimit: process.env.API_BODY_LIMIT || '64kb',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMaxMutations: Number(process.env.RATE_LIMIT_MAX_MUTATIONS || 120),
  rateLimitMaxReads: Number(process.env.RATE_LIMIT_MAX_READS || 300),
  apiKey: process.env.API_KEY || undefined,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  const formatted = Object.entries(errors)
    .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
    .join('\n');
  console.error(`\n❌ Configuração de ambiente inválida:\n${formatted}\n`);
  process.exit(1);
}

export const env = parsed.data;

export function assertGoogleEnv() {
  if (!env.spreadsheetId || !env.googleClientId || !env.googleClientSecret || !env.googleRefreshToken) {
    throw new Error('Missing Google Sheets environment variables');
  }
}
