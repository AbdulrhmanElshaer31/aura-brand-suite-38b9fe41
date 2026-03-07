export const normalizeWhatsAppPhone = (phone: string): string => phone.replace(/\D/g, '');

const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const buildDesktopWhatsAppUrl = (phone: string, message: string): string =>
  `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message.trim())}`;

const buildMobileWhatsAppUrl = (phone: string, message: string): string =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  if (!normalizedPhone) return '';

  return isMobileDevice()
    ? buildMobileWhatsAppUrl(normalizedPhone, message)
    : buildDesktopWhatsAppUrl(normalizedPhone, message);
};

export const openWhatsAppChat = (phone: string, message: string): void => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  if (!normalizedPhone) return;

  const primaryUrl = buildWhatsAppUrl(normalizedPhone, message);
  const fallbackUrl = buildMobileWhatsAppUrl(normalizedPhone, message);

  const popup = window.open(primaryUrl, '_blank', 'noopener,noreferrer');

  if (!popup) {
    window.location.assign(fallbackUrl);
  }
};
