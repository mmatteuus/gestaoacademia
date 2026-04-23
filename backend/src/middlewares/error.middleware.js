import { logger } from '../lib/logger.js';

export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function toHttpError(error) {
  if (error instanceof HttpError) return error;

  const message = String(error?.message || 'Internal server error');

  // Body parser do Express joga SyntaxError quando JSON é inválido
  if (error?.type === 'entity.parse.failed' || error instanceof SyntaxError) {
    return new HttpError(400, 'validation_error', 'Invalid JSON body');
  }
  // Body parser quando estoura limite
  if (error?.type === 'entity.too.large') {
    return new HttpError(413, 'payload_too_large', 'Payload too large');
  }

  if (message.startsWith('Tipo invalido') || message.startsWith('Tipo nao reconhecido')) {
    return new HttpError(400, 'validation_error', 'Invalid request');
  }

  return new HttpError(500, 'operation_failed', 'Internal server error');
}

export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorMiddleware(err, req, res, _next) {
  const normalized = toHttpError(err);
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

  // Log completo no servidor (nunca vai pro cliente)
  logger.error({
    context: 'request_failed',
    path: req.path,
    method: req.method,
    status: normalized.status,
    code: normalized.code,
    message: normalized.message,
    details: normalized.details,
    // Stack trace apenas no log, nunca no response
    stack: isProduction ? undefined : err?.stack,
  });

  // Response sanitizado para o cliente
  const payload = {
    ok: false,
    error: normalized.code,
    // Em produção, erros 500 mostram mensagem genérica
    message: isProduction && normalized.status >= 500
      ? 'Internal server error'
      : normalized.message,
  };

  // Só expor detalhes de validação (400), nunca de erros internos
  if (normalized.details && normalized.status < 500) {
    payload.details = normalized.details;
  }

  res.status(normalized.status).json(payload);
}
