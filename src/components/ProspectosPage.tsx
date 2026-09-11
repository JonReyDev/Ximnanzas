import { useEffect, useState } from 'react';
import { Download, LogOut, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const LEAD_STATUSES = ['Nuevo', 'Contactado', 'En seguimiento', 'Cerrado'] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

type Prospect = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  service?: string | null;
  status: LeadStatus;
  created_at?: string;
};

type Appointment = Prospect & {
  date: string;
  time: string;
  status?: string | null;
};

function csvValue(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows].map((row) => row.map(csvValue).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const statusColors: Record<LeadStatus, { background: string; color: string }> = {
  Nuevo: { background: '#e0edff', color: '#174ea6' },
  Contactado: { background: '#fff0c2', color: '#805b00' },
  'En seguimiento': { background: '#e5ddff', color: '#5735a6' },
  Cerrado: { background: '#d9f5e4', color: '#176b3a' },
};

export function ProspectosPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [leads, setLeads] = useState<Prospect[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'appointments'>('leads');

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
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    setSession(true);
    setAccessToken(data.session?.access_token ?? '');
    setPassword('');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(false);
    setAccessToken('');
    setLeads([]);
    setAppointments([]);
  };

  const updateLeadStatus = async (leadId: string, nextStatus: LeadStatus) => {
    const previousLeads = leads;
    setLeads((current) => current.map((lead) => lead.id === leadId ? { ...lead, status: nextStatus } : lead));
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error('No se pudo actualizar el estado.');
    } catch {
      setLeads(previousLeads);
      setError('No se pudo guardar el estado del prospecto.');
    }
  };

  const exportLeads = () => downloadCsv('prospectos.csv', ['Nombre', 'Correo', 'Telefono', 'Servicio', 'Estado', 'Mensaje', 'Registrada'], leads.map((lead) => [
    lead.name, lead.email, lead.phone, lead.service || '', lead.status, lead.message || '', lead.created_at ? new Date(lead.created_at).toLocaleString('es-MX') : '',
  ]));

  const exportAppointments = () => downloadCsv('citas.csv', ['Nombre', 'Telefono', 'Fecha', 'Hora', 'Registrada'], appointments.map((appointment) => [
    appointment.name, appointment.phone, appointment.date, appointment.time, appointment.created_at ? new Date(appointment.created_at).toLocaleString('es-MX') : '',
  ]));

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
      <div className="prospectos-tabs" role="tablist" aria-label="Datos del panel">
        <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => setActiveTab('leads')} role="tab" aria-selected={activeTab === 'leads'}>Prospectos ({leads.length})</button>
        <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')} role="tab" aria-selected={activeTab === 'appointments'}>Citas ({appointments.length})</button>
      </div>
      {activeTab === 'leads' ? (
        <section className="prospectos-table-section"><div className="prospectos-section-heading"><h2>Solicitudes de información</h2><button className="button button-ghost" onClick={exportLeads}><Download size={15} /> Exportar CSV</button></div><div className="prospectos-table-wrap"><table><thead><tr><th>Fecha</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Estado</th><th>Mensaje</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td>{lead.created_at ? new Date(lead.created_at).toLocaleString('es-MX') : '-'}</td><td>{lead.name}</td><td>{lead.email}</td><td>{lead.phone}</td><td><select aria-label={`Estado de ${lead.name}`} value={lead.status} onChange={(event) => void updateLeadStatus(lead.id, event.target.value as LeadStatus)} style={{ ...statusColors[lead.status], border: 0, borderRadius: '999px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700, padding: '7px 10px' }}>{LEAD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td>{lead.message || '-'}</td></tr>)}</tbody></table></div></section>
      ) : (
        <section className="prospectos-table-section"><div className="prospectos-section-heading"><h2>Citas</h2><button className="button button-ghost" onClick={exportAppointments}><Download size={15} /> Exportar CSV</button></div><div className="prospectos-table-wrap"><table><thead><tr><th>Fecha de registro</th><th>Nombre</th><th>Servicio</th><th>Fecha solicitada</th><th>Hora</th><th>Estado</th></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id}><td>{appointment.created_at ? new Date(appointment.created_at).toLocaleString('es-MX') : '-'}</td><td>{appointment.name}</td><td>{appointment.service || '-'}</td><td>{appointment.date}</td><td>{appointment.time}</td><td>{appointment.status || 'pending'}</td></tr>)}</tbody></table></div></section>
      )}
    </div>
  );
}
