export const WHATSAPP_NUMBER = '525951069096';
export const NOTIFICATION_EMAIL = 'ximenalalith.allianzmlp@gmail.com';

export function whatsappLink(message: string, number?: string): string {
  const phone = number ?? WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function whatsappQuote(serviceName: string): string {
  return `Hola, me interesa solicitar una cotización para ${serviceName}. ¿Me pueden ayudar?`;
}
