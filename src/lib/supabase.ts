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
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.functions.invoke('notify-submission', {
    body: { type, payload },
  });
  if (error) console.error('No se pudo enviar la notificacion:', error);
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
