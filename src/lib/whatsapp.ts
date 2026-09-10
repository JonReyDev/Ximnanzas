export const WHATSAPP_NUMBER = '5215512345678';

export function whatsappLink(message: string, number?: string): string {
  const phone = number ?? WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function whatsappQuote(serviceName: string): string {
  return `Hola, me interesa solicitar una cotización para ${serviceName}. ¿Me pueden ayudar?`;
}
