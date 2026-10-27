const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const recipient = Deno.env.get('NOTIFICATION_EMAIL') ?? 'ximenalalith.allianzmlp@gmail.com';
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');

function escapeHtml(value: unknown): string {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function subjectFor(type: string, payload: Record<string, unknown>): string {
  return type === 'appointment' ? `Nueva cita solicitada - ${escapeHtml(payload.name)}` : `Nuevo prospecto - ${escapeHtml(payload.name)}`;
}
function htmlFor(type: string, payload: Record<string, unknown>): string {
  const rows = Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '').map(([key, value]) => `<tr><td style="padding:8px 12px;font-weight:600">${escapeHtml(key)}</td><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`).join('');
  return `<h2>${type === 'appointment' ? 'Nueva cita solicitada' : 'Nuevo prospecto'}</h2><table style="border-collapse:collapse">${rows}</table>`;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  if (!resendApiKey || !fromEmail) return new Response(JSON.stringify({ error: 'Configura RESEND_API_KEY y RESEND_FROM_EMAIL' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  try {
    const { type, payload } = await request.json();
    if (!['lead', 'appointment'].includes(type) || !payload || typeof payload !== 'object') return new Response(JSON.stringify({ error: 'Payload invalido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: ['Bearer', resendApiKey].join(' '), 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromEmail, to: [recipient], reply_to: typeof payload.email === 'string' ? payload.email : undefined, subject: subjectFor(type, payload), html: htmlFor(type, payload) }),
    });
    if (!response.ok) return new Response(JSON.stringify({
      error: await response.text(),
      hint: 'Verifica que RESEND_FROM_EMAIL use un dominio verificado en Resend. Para este proyecto usa contacto@ximnanzas.com.',
    }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error inesperado' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
