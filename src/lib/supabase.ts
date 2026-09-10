import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
