export const normalizeWhatsAppPhone = (phone: string): string => phone.replace(/\D/g, '');

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  if (!normalizedPhone) return '';

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message.trim())}`;
};

export const openWhatsAppChat = (phone: string, message: string): void => {
  const url = buildWhatsAppUrl(phone, message);
  if (!url) return;

  const popup = window.open(url, '_blank', 'noopener,noreferrer');

  if (!popup) {
    window.location.assign(url);
  }
};
