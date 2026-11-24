import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createOptimaxxPdf } from '../src/lib/optimaxx-pdf';
import { terms, type Quote } from '../src/lib/optimaxx';

function validate(body: Quote) {
  return typeof body.name === 'string' && body.name.trim().length >= 2 && body.name.length <= 100 &&
    typeof body.email === 'string' && body.email.length <= 254 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(body.email) &&
    Number.isInteger(body.age) && body.age >= 18 && body.age <= 65 &&
    Number.isInteger(body.monthly) && body.monthly >= terms.minimumMonthly && body.monthly <= 50000 &&
    Number.isInteger(body.years) && body.years >= 10 && body.years <= 25 &&
    [.06, .08, .10].includes(body.rate) &&
    Number.isFinite(body.income) && body.income >= 0 && body.income <= 100000000 &&
    Number.isFinite(body.isr) && body.isr >= 0 && body.isr <= .35;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const reply = (status: number, data: object) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(405, { error: 'Método no permitido.' });
  }
  if (!['https://ximnanzas.com', 'https://www.ximnanzas.com'].includes(req.headers.origin ?? '')) {
    return reply(403, { error: 'Origen no permitido.' });
  }
  let quote: Quote;
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      const buffer = Buffer.from(chunk);
      size += buffer.length;
      if (size > 4096) return reply(413, { error: 'Solicitud demasiado grande.' });
      chunks.push(buffer);
    }
    quote = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!quote || !validate(quote)) return reply(400, { error: 'Revisa tus datos y los parámetros de la proyección.' });
  } catch {
    return reply(400, { error: 'Solicitud inválida.' });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) return reply(503, { error: 'El envío por correo no está disponible en este momento.' });

  try {
    const pdf = Buffer.from(createOptimaxxPdf(quote)).toString('base64');
    const idempotency = createHash('sha256')
      .update(JSON.stringify([quote.email.toLowerCase(), quote.name, quote.age, quote.monthly, quote.years, quote.rate, quote.income, quote.isr, Math.floor(Date.now() / 600000)]))
      .digest('hex');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(12000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `projection-${idempotency}` },
      body: JSON.stringify({
        from,
        to: [quote.email],
        subject: 'Tu proyección de retiro | Ximnanzas',
        text: 'Gracias por solicitar tu proyección. Adjuntamos tu simulación ilustrativa de OptiMaxx plus. Si tienes dudas, responde a este correo para hablar con Ximnanzas.',
        attachments: [{ filename: 'Proyeccion_OptiMaxx_Ximnanzas.pdf', content: pdf }],
      }),
    });
    if (!response.ok) {
      console.error('Resend no aceptó la proyección', response.status);
      return reply(502, { error: 'No se pudo enviar la proyección. Intenta de nuevo en unos minutos.' });
    }
    return reply(200, { ok: true });
  } catch {
    return reply(502, { error: 'No se pudo enviar la proyección. Intenta de nuevo en unos minutos.' });
  }
}
