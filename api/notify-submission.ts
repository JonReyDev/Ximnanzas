import type { IncomingMessage, ServerResponse } from 'node:http';

type SubmissionType = 'lead' | 'appointment';
type Payload = Record<string, unknown>;

type RequestBody = {
  type?: SubmissionType;
  payload?: Payload;
};

function escapeHtml(value: unknown): string {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function subjectFor(type: SubmissionType, payload: Payload): string {
  const name = escapeHtml(typeof payload.name === 'string' ? payload.name : 'Cliente');
  return type === 'appointment' ? `Nueva cita solicitada - ${name}` : `Nuevo prospecto - ${name}`;
}

function htmlFor(type: SubmissionType, payload: Payload): string {
  const rows = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `<tr><td style="padding:8px 12px;font-weight:600">${escapeHtml(key)}</td><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`)
    .join('');
  return `<h2>${type === 'appointment' ? 'Nueva cita solicitada' : 'Nuevo prospecto'}</h2><table style="border-collapse:collapse">${rows}</table>`;
}

async function readBody(request: IncomingMessage): Promise<RequestBody> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as RequestBody;
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Allow', 'POST');
    response.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const recipient = process.env.NOTIFICATION_EMAIL ?? 'ximenalalith.allianzmlp@gmail.com';
  if (!resendApiKey || !fromEmail) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Configura RESEND_API_KEY y RESEND_FROM_EMAIL en Vercel.' }));
    return;
  }

  try {
    const { type, payload } = await readBody(request);
    if (!type || !['lead', 'appointment'].includes(type) || !payload || typeof payload !== 'object') {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'Payload invalido.' }));
      return;
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: ['Bearer', resendApiKey].join(' '),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        reply_to: typeof payload.email === 'string' ? payload.email : undefined,
        subject: subjectFor(type, payload),
        html: htmlFor(type, payload),
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error('Resend rechazo el envio:', resendError);
      response.statusCode = 502;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'Resend rechazo el envio.', detail: resendError }));
      return;
    }

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ ok: true }));
  } catch {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Solicitud invalida.' }));
  }
}
