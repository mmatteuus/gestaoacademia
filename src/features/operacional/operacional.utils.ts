import { ApiError } from '@/services/api/client';
import type { ActionResult } from './operacional.types';

export function toActionError(error: unknown, fallback: string): ActionResult {
  if (error instanceof ApiError) {
    return { ok: false, message: error.message || fallback };
  }

  return { ok: false, message: fallback };
}
