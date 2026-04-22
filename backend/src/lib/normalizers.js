const FORMULA_PREFIX_PATTERN = /^[\s\t\r]*[=+\-@]/;

export function sanitizeSheetCellValue(value) {
  if (value === null || value === undefined) return '';
  const asString = String(value);
  if (FORMULA_PREFIX_PATTERN.test(asString)) {
    return `'${asString}`;
  }
  return asString;
}

export function toIsoDate(dateLike) {
  if (!dateLike) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateLike)) return dateLike;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateLike)) {
    const [dd, mm, yyyy] = dateLike.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  const parsed = new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

export function parseNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function nowDateIso() {
  return new Date().toISOString().slice(0, 10);
}

export function normalizePaymentMethod(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'PIX';
  if (raw === 'cartao' || raw === 'cartão') return 'Cartao';
  if (raw === 'transferencia' || raw === 'transferência') return 'Transferencia';
  if (raw === 'dinheiro') return 'Dinheiro';
  if (raw === 'boleto') return 'Boleto';
  return 'PIX';
}
