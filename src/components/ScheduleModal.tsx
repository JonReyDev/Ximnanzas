import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { requestAppointment } from '@/lib/whatsapp';
import { SERVICES } from '@/lib/services';

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  presetService?: string;
};

const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDay = (first: Date | null, second: Date) =>
  Boolean(first) &&
  first!.getFullYear() === second.getFullYear() &&
  first!.getMonth() === second.getMonth() &&
  first!.getDate() === second.getDate();

export function ScheduleModal({ open, onClose, presetService }: ScheduleModalProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [viewMonth, setViewMonth] = useState(new Date());
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: presetService || '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setDate(null);
    setTime('');
    setViewMonth(new Date());
    setForm({ name: '', email: '', phone: '', service: presetService || '' });
    setError('');
  }, [open, presetService]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const days = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), index + 1))];
  const canSubmit = Boolean(date && time && form.name.trim() && form.email.trim() && form.phone.trim());

  const updateForm = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !date) {
      setError('Completa tus datos, la fecha y el horario.');
      return;
    }
    requestAppointment([
      ['Nombre', form.name],
      ['Correo', form.email],
      ['Teléfono', form.phone],
      ['Servicio', form.service],
      ['Fecha preferida', dateKey(date)],
      ['Horario preferido', `${time} h (Ciudad de México)`],
    ]);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="schedule-title" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div aria-hidden="true" onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div className="fade-up appointment-glass" style={{ position: 'relative', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <h2 id="schedule-title" className="serif" style={{ fontSize: '1.5rem', fontWeight: 500 }}>Agenda una cita</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Elige fecha y horario. WhatsApp abrirá la solicitud para que la revises y envíes.</p>
            </div>
            <button type="button" aria-label="Cerrar" onClick={onClose} style={{ alignSelf: 'flex-start', background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
          </div>
        </div>

          <form className="schedule-form" onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '28px', padding: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button type="button" aria-label="Mes anterior" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} className="button button-ghost" style={{ padding: '8px' }}><ChevronLeft size={16} /></button>
                <strong>{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</strong>
                <button type="button" aria-label="Mes siguiente" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="button button-ghost" style={{ padding: '8px' }}><ChevronRight size={16} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {WEEKDAYS.map((weekday) => <span key={weekday} className="mono" style={{ color: 'var(--muted)', padding: '4px 0' }}>{weekday}</span>)}
                {days.map((day, index) => day ? (
                  <button
                    key={dateKey(day)}
                    type="button"
                    disabled={day < today || day.getDay() === 0}
                    onClick={() => { setDate(day); setTime(''); }}
                    style={{ aspectRatio: '1', borderRadius: '8px', border: isSameDay(date, day) ? 0 : '1px solid var(--line-soft)', background: isSameDay(date, day) ? 'var(--ink)' : 'transparent', color: isSameDay(date, day) ? 'var(--paper)' : day < today || day.getDay() === 0 ? '#b8c0c2' : 'var(--ink-soft)', cursor: day < today || day.getDay() === 0 ? 'not-allowed' : 'pointer' }}
                  >{day.getDate()}</button>
                ) : <span key={`empty-${index}`} />)}
              </div>
              {date && <div style={{ marginTop: '24px' }}><p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 500 }}><Clock size={15} /> Horario preferido</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>{TIME_SLOTS.map((slot) => <button key={slot} type="button" onClick={() => setTime(slot)} style={{ padding: '10px 4px', borderRadius: '8px', border: time === slot ? 0 : '1px solid var(--line)', background: time === slot ? 'var(--ink)' : 'white', color: time === slot ? 'var(--paper)' : 'var(--ink-soft)', cursor: 'pointer' }}>{slot}</button>)}</div></div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(['name', 'email', 'phone'] as const).map((field) => <label key={field} style={{ display: 'grid', gap: '6px', fontSize: '0.82rem', fontWeight: 500 }}>{field === 'name' ? 'Nombre completo' : field === 'email' ? 'Correo electrónico' : 'Teléfono'}<input className="input" required type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} placeholder={field === 'name' ? 'Tu nombre' : field === 'email' ? 'tucorreo@ejemplo.com' : '55 1234 5678'} value={form[field]} onChange={(event) => updateForm(field, event.target.value)} /></label>)}
              <label style={{ display: 'grid', gap: '6px', fontSize: '0.82rem', fontWeight: 500 }}>Servicio de interés<select className="input" value={form.service} onChange={(event) => updateForm('service', event.target.value)}><option value="">Selecciona un servicio</option>{SERVICES.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}</select></label>
              {date && <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '0.85rem' }}><CalendarDays size={16} /> {date.getDate()} de {MONTHS[date.getMonth()]} {time && `· ${time} hrs`}</p>}
              {error && <p style={{ color: 'var(--destructive)', fontSize: '0.85rem' }}>{error}</p>}
              <button type="submit" disabled={!canSubmit} className="button button-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', opacity: !canSubmit ? 0.5 : 1 }}>Solicitar cita por WhatsApp</button>
            </div>
          </form>
      </div>
    </div>
  );
}
