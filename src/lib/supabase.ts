import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
export const isSupabaseConfigured = hasSupabaseConfig;

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      from: () => ({
        insert: async () => ({
          data: null,
          error: new Error('Supabase no esta configurado.'),
        }),
      }),
    } as unknown as ReturnType<typeof createClient>);

export async function notifySubmission(
  type: 'lead' | 'appointment',
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    const response = await fetch('/api/notify-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });
    if (!response.ok) console.error('No se pudo enviar la notificacion:', await response.text());
  } catch (error) {
    console.error('No se pudo conectar con el backend de Vercel:', error);
  }
}

export type Lead = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  service?: string;
  created_at?: string;
};

export type Appointment = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service?: string;
  notes?: string;
  status?: string;
  created_at?: string;
};

export type BlogPost = {
  id?: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at?: string;
};
