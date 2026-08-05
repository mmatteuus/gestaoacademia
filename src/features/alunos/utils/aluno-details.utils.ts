export function isMinor(dataNascimento: string): boolean {
  if (!dataNascimento) return false;

  const birthDate = new Date(dataNascimento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age < 18;
}

export function formatDate(dateIso: string): string {
  if (!dateIso) return '-';

  const [year, month, day] = dateIso.split('-');
  if (!year || !month || !day) return dateIso;

  return `${day}/${month}/${year}`;
}

export function getWhatsAppLink(phone: string): string {
  return `https://wa.me/55${phone.replace(/\D/g, '')}`;
}
