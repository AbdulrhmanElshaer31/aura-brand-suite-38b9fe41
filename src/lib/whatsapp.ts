export const normalizeWhatsAppPhone = (phone: string): string => phone.replace(/\D/g, "");

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  if (!normalizedPhone) return "";

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
};
