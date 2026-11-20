export const WHATSAPP_NUMBER = '525951069096';
export const NOTIFICATION_EMAIL = 'ximenalalith.allianzmlp@gmail.com';

export function whatsappLink(message: string, number?: string): string {
  const phone = number ?? WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function whatsappQuote(serviceName: string): string {
  return `Hola, me interesa solicitar una cotización para ${serviceName}. ¿Me pueden ayudar?`;
}

export function requestAppointment(details: Array<[string, string]>) {
  const fields = details.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`);
  const message = ['Hola, Ximnanzas. Me gustaría solicitar una cita de asesoría patrimonial.', '', ...fields, '', '¿Podrían confirmarme su disponibilidad? Gracias.'].join('\n');
  window.location.assign(whatsappLink(message));
}
