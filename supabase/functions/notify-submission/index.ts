const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  const smtpHost = Deno.env.get('SMTP_HOST');
  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  const smtpFrom = Deno.env.get('SMTP_FROM');

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return new Response(
      JSON.stringify({ error: 'Configura SMTP_HOST, SMTP_USER, SMTP_PASS y SMTP_FROM en el entorno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const { type, payload } = await request.json();
    if (!['lead', 'appointment'].includes(type) || !payload || typeof payload !== 'object') {
      return new Response(JSON.stringify({ error: 'Payload invalido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const recipient = Deno.env.get('NOTIFICATION_EMAIL') ?? 'ximenalalith.allianzmlp@gmail.com';
    const subject = type === 'appointment' ? `Nueva cita solicitada - ${payload.name ?? 'Cliente'}` : `Nuevo prospecto - ${payload.name ?? 'Cliente'}`;
    const html = `
      <h2>${type === 'appointment' ? 'Nueva cita solicitada' : 'Nuevo prospecto'}</h2>
      <table style="border-collapse:collapse">
        ${Object.entries(payload)
          .filter(([, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => `<tr><td style="padding:8px 12px;font-weight:600">${String(key)}</td><td style="padding:8px 12px">${String(value)}</td></tr>`)
          .join('')}
      </table>
    `;

    const smtpResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient }] }],
        from: { email: smtpFrom, name: 'Ximnanzas' },
        reply_to: typeof payload.email === 'string' ? { email: payload.email } : undefined,
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (!smtpResponse.ok) {
      const detail = await smtpResponse.text();
      return new Response(JSON.stringify({ error: detail }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error inesperado' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
