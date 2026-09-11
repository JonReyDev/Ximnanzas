import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';

type Status = 'Nuevo' | 'Contactado' | 'En seguimiento' | 'Cerrado';
const VALID_STATUSES: Status[] = ['Nuevo', 'Contactado', 'En seguimiento', 'Cerrado'];

type RequestWithQuery = IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> };

type RequestBody = {
  status?: unknown;
};

function sendJson(response: ServerResponse, statusCode: number, body: Record<string, unknown>) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

async function readBody(request: IncomingMessage): Promise<RequestBody> {
  const parsedRequest = request as RequestWithQuery;
  if (parsedRequest.body && typeof parsedRequest.body === 'object') return parsedRequest.body as RequestBody;
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as RequestBody;
}

function leadIdFromRequest(request: RequestWithQuery): string | undefined {
  const queryId = request.query?.id;
  return Array.isArray(queryId) ? queryId[0] : queryId;
}

export default async function handler(request: RequestWithQuery, response: ServerResponse) {
  if (request.method !== 'PATCH') {
    response.setHeader('Allow', 'PATCH');
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  const authorization = request.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const leadId = leadIdFromRequest(request);

  if (!token) {
    sendJson(response, 401, { error: 'Authorization Bearer token requerido.' });
    return;
  }
  if (!leadId) {
    sendJson(response, 400, { error: 'Id de prospecto requerido.' });
    return;
  }

  try {
    const body = await readBody(request);
    if (typeof body.status !== 'string' || !VALID_STATUSES.includes(body.status as Status)) {
      sendJson(response, 400, { error: 'Estado invalido.', allowed: VALID_STATUSES });
      return;
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
      ?? process.env.SUPABASE_ANON_KEY
      ?? process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      sendJson(response, 500, { error: 'Supabase no esta configurado.' });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      sendJson(response, 401, { error: 'JWT invalido o expirado.' });
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .update({ status: body.status })
      .eq('id', leadId)
      .select('id, status')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        sendJson(response, 404, { error: 'Prospecto no encontrado.' });
        return;
      }
      sendJson(response, 400, { error: 'No se pudo actualizar el estado.' });
      return;
    }

    sendJson(response, 200, { data });
  } catch {
    sendJson(response, 400, { error: 'Solicitud invalida.' });
  }
}
