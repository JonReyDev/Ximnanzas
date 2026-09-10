import { useEffect, useState } from 'react';
import { LogOut, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Prospect = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  service?: string | null;
  created_at?: string;
};

type Appointment = Prospect & {
  date: string;
  time: string;
  status?: string | null;
};

export function ProspectosPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(false);
  const [leads, setLeads] = useState<Prospect[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    const [{ data: leadRows, error: leadsError }, { data: appointmentRows, error: appointmentsError }] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
    ]);
    setLoading(false);
    if (leadsError || appointmentsError) {
      setError('No se pudieron cargar los prospectos. Verifica tus permisos.');
      return;
    }
    setLeads((leadRows ?? []) as Prospect[]);
    setAppointments((appointmentRows ?? []) as Appointment[]);
  };

  useEffect(() => {
    if (session) void loadData();
  }, [session]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    setSession(true);
    setPassword('');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(false);
    setLeads([]);
    setAppointments([]);
  };

  if (!isSupabaseConfigured) {
    return <div className="prospectos-page"><h1>Panel de prospectos</h1><p>Configura Supabase para acceder al panel.</p></div>;
  }

  if (!session) {
    return (
      <div className="prospectos-page prospectos-login">
        <form onSubmit={signIn} className="prospectos-login-card">
          <span className="section-kicker">Acceso privado</span>
          <h1 className="display">Panel de prospectos</h1>
          <p>Ingresa con tu usuario administrativo de Supabase.</p>
          <input className="input" type="email" placeholder="Correo administrativo" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="input" type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="prospectos-error">{error}</p>}
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="prospectos-page">
      <div className="prospectos-header">
        <div><span className="section-kicker">Administración</span><h1 className="display">Prospectos</h1></div>
        <div className="prospectos-actions"><button className="button button-ghost" onClick={() => void loadData()}><RefreshCw size={15} /> Actualizar</button><button className="button button-primary" onClick={() => void signOut()}><LogOut size={15} /> Salir</button></div>
      </div>
      {error && <p className="prospectos-error">{error}</p>}
      <section className="prospectos-table-section"><h2>Solicitudes de información</h2><div className="prospectos-table-wrap"><table><thead><tr><th>Fecha</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Mensaje</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td>{lead.created_at ? new Date(lead.created_at).toLocaleString('es-MX') : '-'}</td><td>{lead.name}</td><td>{lead.email}</td><td>{lead.phone}</td><td>{lead.message || '-'}</td></tr>)}</tbody></table></div></section>
      <section className="prospectos-table-section"><h2>Citas</h2><div className="prospectos-table-wrap"><table><thead><tr><th>Fecha de registro</th><th>Nombre</th><th>Servicio</th><th>Fecha solicitada</th><th>Hora</th><th>Estado</th></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id}><td>{appointment.created_at ? new Date(appointment.created_at).toLocaleString('es-MX') : '-'}</td><td>{appointment.name}</td><td>{appointment.service || '-'}</td><td>{appointment.date}</td><td>{appointment.time}</td><td>{appointment.status || 'pending'}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}
