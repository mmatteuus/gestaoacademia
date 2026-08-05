import type { FormaPagamento } from '@/types';

export type Row = Record<string, string>;

export function parseJsonArray<T>(raw: string | undefined, fallback: T[] = []): T[] {
  if (!raw?.trim()) return fallback;

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? (value as T[]) : fallback;
  } catch {
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean) as unknown as T[];
  }
}

export function stringifyArray(value: unknown[] | undefined) {
  return value?.length ? JSON.stringify(value) : '';
}

export function parseNumber(raw: string | undefined, fallback = 0) {
  if (!raw) return fallback;
  const value = Number(raw.replace(',', '.'));
  return Number.isFinite(value) ? value : fallback;
}

export function parseBool(raw: string | undefined) {
  return ['true', '1', 'TRUE', 'sim'].includes(raw ?? '');
}

export function parseFormaPagamento(raw: string | undefined): FormaPagamento | undefined {
  if (!raw) return undefined;

  const value = raw.toLocaleLowerCase('pt-BR');
  if (value === 'cartão' || value === 'cartao') return 'Cartao';
  if (value === 'transferência' || value === 'transferencia') return 'Transferencia';
  if (value === 'dinheiro') return 'Dinheiro';
  if (value === 'boleto') return 'Boleto';
  if (value === 'pix') return 'PIX';
  return undefined;
}

export function optionalString(value: string | undefined) {
  return value?.trim() ? value : undefined;
}

export function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
}
