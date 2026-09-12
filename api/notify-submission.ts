import type { IncomingMessage, ServerResponse } from 'node:http';
<<<<<<< HEAD
import nodemailer from 'nodemailer';

type SubmissionType = 'lead' | 'appointment';
type Payload = Record<string, unknown>;

type RequestBody = {
  type?: SubmissionType;
  payload?: Payload;
};

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function subjectFor(type: SubmissionType, payload: Payload): string {
  const name = escapeHtml(typeof payload.name === 'string' ? payload.name : 'Cliente');
=======

type SubmissionType = 'lead' | 'appointment';
type Payload = Record<string, unknown>;
type RequestBody = { type?: SubmissionType; payload?: Payload };

function escapeHtml(value: unknown): string {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function subjectFor(type: SubmissionType, payload: Payload): string {
  const name = escapeHtml(payload.name);
>>>>>>> refs/remotes/origin/main
  return type === 'appointment' ? `Nueva cita solicitada - ${name}` : `Nuevo prospecto - ${name}`;
}

function htmlFor(type: SubmissionType, payload: Payload): string {
  const rows = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `<tr><td style="padding:8px 12px;font-weight:600">${escapeHtml(key)}</td><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`)
    .join('');
<<<<<<< HEAD

=======
>>>>>>> refs/remotes/origin/main
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

<<<<<<< HEAD
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;
  const recipient = process.env.NOTIFICATION_EMAIL ?? 'ximenalalith.allianzmlp@gmail.com';

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Configura SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y SMTP_FROM en Vercel.' }));
=======
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const recipient =
    process.env.NOTIFICATION_EMAIL ?? 'ximenalalith.allianzmlp@gmail.com';
  if (!resendApiKey || !fromEmail) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Configura RESEND_API_KEY y RESEND_FROM_EMAIL en Vercel.' }));
>>>>>>> refs/remotes/origin/main
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

<<<<<<< HEAD
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: recipient,
      replyTo: typeof payload.email === 'string' ? payload.email : undefined,
      subject: subjectFor(type, payload),
      html: htmlFor(type, payload),
    });
=======
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
      console.error('Resend rechazo el envio:', await resendResponse.text());
      response.statusCode = 502;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'Resend rechazo el envio.' }));
      return;
    }
>>>>>>> refs/remotes/origin/main

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ ok: true }));
<<<<<<< HEAD
  } catch (error) {
    console.error('SMTP envio fallido:', error);
    response.statusCode = 502;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'No se pudo enviar el correo por SMTP.' }));
=======
  } catch {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Solicitud invalida.' }));
>>>>>>> refs/remotes/origin/main
  }
}
