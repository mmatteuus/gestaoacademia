export const DEFAULT_MENSALIDADE = 180;
export const DEFAULT_AULAS_GRADUACAO = 20;
export const FAIXAS_ORDEM = ['Branca', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'];

export function toMonthKey(dateIso: string) {
  if (!dateIso || dateIso.length < 7) return '';
  return dateIso.slice(0, 7);
}

export function parseIsoDate(value: string | undefined) {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function monthLabel(month: Date) {
  const mm = String(month.getMonth() + 1).padStart(2, '0');
  return `${mm}/${month.getFullYear()}`;
}

export function addMonths(base: Date, months: number) {
  const clone = new Date(base);
  clone.setMonth(clone.getMonth() + months);
  return clone;
}

export function dueDateForMonth(month: Date, preferredDay: number) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const day = Math.min(Math.max(preferredDay, 1), lastDay);
  const mm = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${mm}-${String(day).padStart(2, '0')}`;
}

export function nextFaixaFrom(currentFaixa: string) {
  const currentIndex = FAIXAS_ORDEM.findIndex(
    (faixa) => faixa.toLocaleLowerCase('pt-BR') === currentFaixa.toLocaleLowerCase('pt-BR'),
  );

  if (currentIndex === -1 || currentIndex >= FAIXAS_ORDEM.length - 1) {
    return FAIXAS_ORDEM[0];
  }

  return FAIXAS_ORDEM[currentIndex + 1];
}
