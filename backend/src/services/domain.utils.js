import { nowDateIso, toIsoDate } from '../lib/normalizers.js';

export function toMinutes(time) {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + minutes;
}

export function overlaps(startA, endA, startB, endB) {
  return startB < endA && endB > startA;
}

export function normalizeReservationRow(row) {
  return {
    ...row,
    data_inicio: toIsoDate(row.data_inicio),
    data_fim: toIsoDate(row.data_fim) || toIsoDate(row.data_inicio),
  };
}

export function computePaymentStatus({ total, paid, dueDate }) {
  if (paid >= total) return 'paga';
  if (paid > 0) return 'parcial';
  const dueIso = toIsoDate(dueDate);
  if (dueIso && dueIso < nowDateIso()) return 'vencida';
  return 'aberta';
}
