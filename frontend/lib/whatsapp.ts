/**
 * Normalises a Pakistani mobile number to international digits (92XXXXXXXXXX), or returns null.
 * Accepts "03XXXXXXXXX" (11 digits) or "923XXXXXXXXX" (12 digits), with spaces/dashes/+ ignored.
 * It never trims, pads or "corrects" digits: a number of the wrong length is rejected, not repaired.
 */
export function normalizePkMobile(raw?: string): string | null {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (/^923\d{9}$/.test(digits)) return digits;
  if (/^03\d{9}$/.test(digits)) return `92${digits.slice(1)}`;
  return null;
}

export function buildWhatsAppUrl(number: string | null, message: string): string | null {
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}
