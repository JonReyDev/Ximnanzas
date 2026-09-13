const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
