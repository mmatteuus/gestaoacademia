export function isMinor(dataNascimento: string) {
  if (!dataNascimento) return false;

  const birth = new Date(dataNascimento);
  if (Number.isNaN(birth.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age < 18;
}

export function formatDate(dateIso: string) {
  if (!dateIso) return '-';
  const [year, month, day] = dateIso.split('-');
  if (!year || !month || !day) return dateIso;
  return `${day}/${month}/${year}`;
}

export function getWhatsAppLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const internationalNumber = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${internationalNumber}`;
}
