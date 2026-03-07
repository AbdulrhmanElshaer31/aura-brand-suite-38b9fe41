export const normalizeWhatsAppPhone = (phone: string): string => phone.replace(/\D/g, '');

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message.trim())}`;
};

export const openWhatsAppChat = (phone: string, message: string): void => {
  const url = buildWhatsAppUrl(phone, message);

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
