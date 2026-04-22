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

  logger.error({
    context: 'request_failed',
    path: req.path,
    method: req.method,
    status: normalized.status,
    code: normalized.code,
    message: normalized.message,
    details: normalized.details,
    errorMessage: err?.message,
  });

  const payload = {
    ok: false,
    error: normalized.code,
    message: normalized.message,
  };

  if (normalized.details) {
    payload.details = normalized.details;
  }

  res.status(normalized.status).json(payload);
}
