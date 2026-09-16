import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CircleCheck, X } from 'lucide-react';
import { notifySubmission, supabase, type Appointment, type Lead } from '@/lib/supabase';

type ContactMode = 'lead' | 'appointment';
type ScheduleModalProps = { open: boolean; onClose: () => void; presetService?: string };
type ContactForm = { name: string; email: string; phone: string; message: string; date: string; time: string; service: string };

const initialForm: ContactForm = { name: '', email: '', phone: '', message: '', date: '', time: '', service: 'Diagnóstico financiero' };
const topics = ['Diagnóstico financiero', 'Retiro e inversión', 'Protección familiar', 'Salud y patrimonio'];
const times = ['09:00', '11:00', '13:00', '16:00'];

export function ScheduleModal({ open, onClose, presetService }: ScheduleModalProps) {
  const [mode, setMode] = useState<ContactMode>('appointment');
  const [form, setForm] = useState<ContactForm>({ ...initialForm, service: presetService || initialForm.service });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setMode('appointment');
    setForm({ ...initialForm, service: presetService || initialForm.service });
    setSubmitted(false);
    setSubmitting(false);
    setError('');
  }, [open, presetService]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const isAppointment = mode === 'appointment';
  const setField = (key: keyof ContactForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const payload: Lead | Appointment = isAppointment
      ? { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), date: form.date, time: form.time, service: form.service, status: 'pending' }
      : { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), message: form.message.trim() };
    const { error: insertError } = await supabase.from(isAppointment ? 'appointments' : 'leads').insert([payload]);
    if (insertError) {
      setSubmitting(false);
      setError('No pudimos enviar tus datos. Intenta de nuevo o llámanos directamente.');
      return;
    }
    await notifySubmission(isAppointment ? 'appointment' : 'lead', payload);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="contact-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button className="contact-modal-close" onClick={onClose} aria-label="Cerrar"><X size={28} /></button>
        {submitted ? (
          <div className="contact-success"><CircleCheck size={34} /><h2>{isAppointment ? 'Tu cita está en camino.' : 'Ya estamos en contacto.'}</h2><p>{isAppointment ? 'Te confirmaremos el horario por teléfono o correo. Gracias por dar este primer paso.' : 'Una persona de nuestro equipo revisará tus datos y te contactará muy pronto.'}</p><button className="contact-submit" onClick={onClose}>Listo <ArrowRight size={18} /></button></div>
        ) : (
          <>
            <div className="contact-switch" role="tablist" aria-label="Tipo de contacto">
              <button className={mode === 'lead' ? 'selected' : ''} onClick={() => { setMode('lead'); setError(''); }} role="tab" aria-selected={mode === 'lead'}>Quiero orientación</button>
              <button className={mode === 'appointment' ? 'selected' : ''} onClick={() => { setMode('appointment'); setError(''); }} role="tab" aria-selected={mode === 'appointment'}>Agendar cita</button>
            </div>
            <h2 id="contact-title">{isAppointment ? 'Hagamos espacio para tu futuro.' : 'Empecemos por tu contexto.'}</h2>
            <p className="contact-intro">{isAppointment ? 'Elige un momento y conversemos sin tecnicismos. Una primera charla de 30 minutos puede cambiar la dirección.' : 'Cuéntanos qué te importa proteger. Te responderemos con claridad, no con presión.'}</p>
            <form className="contact-form" onSubmit={submit}>
              <label>Nombre completo<input value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="¿Cómo te llamamos?" required /></label>
              <div className="contact-form-split"><label>Correo<input type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="tu@correo.com" required /></label><label>Teléfono<input type="tel" minLength={7} value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="55 0000 0000" required /></label></div>
              {isAppointment ? <><div className="contact-form-split"><label>Fecha preferida<input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(event) => setField('date', event.target.value)} required /></label><label>Hora<select value={form.time} onChange={(event) => setField('time', event.target.value)} required><option value="">Elige una hora</option>{times.map((time) => <option key={time} value={time}>{time}</option>)}</select></label></div><label>Tema para la charla<select value={form.service} onChange={(event) => setField('service', event.target.value)}>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></label></> : <label>¿Qué te gustaría ordenar?<textarea value={form.message} onChange={(event) => setField('message', event.target.value)} placeholder="Retiro, protección, inversión…" /></label>}
              {error && <div className="contact-form-error" role="alert">{error}</div>}
              <button className="contact-submit" type="submit" disabled={submitting}>{submitting ? 'Enviando...' : isAppointment ? 'Reservar conversación' : 'Quiero que me contacten'} <ArrowRight size={18} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
