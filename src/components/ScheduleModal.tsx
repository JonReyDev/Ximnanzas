import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CircleCheck, X } from 'lucide-react';
import { notifySubmission, supabase, type Appointment, type Lead } from '@/lib/supabase';
import { SERVICES } from '@/lib/services';

type ContactMode = 'lead' | 'appointment';

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  presetService?: string;
};

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  time: string;
  topic: string;
};

const INITIAL_FORM: ContactForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  date: '',
  time: '',
  topic: 'Diagnóstico financiero',
};

const TOPICS = ['Diagnóstico financiero', 'Retiro e inversión', 'Protección familiar', 'Salud y patrimonio'];
const TIME_SLOTS = ['09:00', '11:00', '13:00', '16:00'];

export function ScheduleModal({ open, onClose, presetService }: ScheduleModalProps) {
  const [mode, setMode] = useState<ContactMode>('appointment');
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setMode('appointment');
      setForm({ ...INITIAL_FORM, topic: presetService || INITIAL_FORM.topic });
      setSubmitted(false);
      setPending(false);
      setError('');
    }
  }, [open, presetService]);

  if (!open) return null;

  const setField = (key: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const changeMode = (nextMode: ContactMode) => {
    setMode(nextMode);
    setError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.phone.trim().length < 7) {
      setError('Completa tu nombre, correo y un teléfono válido.');
      return;
    }
    if (mode === 'appointment' && (!form.date || !form.time)) {
      setError('Elige una fecha y hora para la conversación.');
      return;
    }

    setPending(true);
    setError('');

    if (mode === 'appointment') {
      const appointment: Omit<Appointment, 'id'> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        service: form.topic,
        status: 'pending',
      };
      const { error: requestError } = await supabase.from('appointments').insert([appointment]);
      if (!requestError) {
        await notifySubmission('appointment', appointment);
        setSubmitted(true);
      } else {
        setError('No pudimos enviar tus datos. Intenta de nuevo o llámanos directamente.');
      }
    } else {
      const lead: Omit<Lead, 'id'> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      };
      const { error: requestError } = await supabase.from('leads').insert([lead]);
      if (!requestError) {
        await notifySubmission('lead', lead);
        setSubmitted(true);
      } else {
        setError('No pudimos enviar tus datos. Intenta de nuevo o llámanos directamente.');
      }
    }
    setPending(false);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar" data-testid="button-close-contact">
          <X size={21} />
        </button>
        {submitted ? (
          <div className="success-box" data-testid="status-contact-success">
            <CircleCheck size={28} />
            <h3>{mode === 'appointment' ? 'Tu cita está en camino.' : 'Ya estamos en contacto.'}</h3>
            <p>
              {mode === 'appointment'
                ? 'Te confirmaremos el horario por teléfono o correo. Gracias por dar este primer paso.'
                : 'Una persona de nuestro equipo revisará tus datos y te contactará muy pronto.'}
            </p>
            <button className="button button-dark" onClick={onClose} style={{ marginTop: 22 }} data-testid="button-success-close">
              Listo
            </button>
          </div>
        ) : (
          <>
            <div className="form-switch" role="tablist" aria-label="Tipo de contacto">
              <button
                className={mode === 'lead' ? 'selected' : ''}
                onClick={() => changeMode('lead')}
                role="tab"
                aria-selected={mode === 'lead'}
                data-testid="button-mode-diagnostico"
              >
                Quiero orientación
              </button>
              <button
                className={mode === 'appointment' ? 'selected' : ''}
                onClick={() => changeMode('appointment')}
                role="tab"
                aria-selected={mode === 'appointment'}
                data-testid="button-mode-appointment"
              >
                Agendar cita
              </button>
            </div>
            <h2 id="contact-title">{mode === 'appointment' ? 'Hagamos espacio para tu futuro.' : 'Empecemos por tu contexto.'}</h2>
            <p>
              {mode === 'appointment'
                ? 'Elige un momento y conversemos sin tecnicismos. Una primera charla puede cambiar la dirección.'
                : 'Cuéntanos qué te importa proteger. Te responderemos con claridad, no con presión.'}
            </p>
            <form className="modal-form" onSubmit={submit}>
              <div className="form-field">
                <label htmlFor="contact-name">Nombre completo</label>
                <input id="contact-name" value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="¿Cómo te llamamos?" required data-testid="input-contact-name" />
              </div>
              <div className="form-split">
                <div className="form-field">
                  <label htmlFor="contact-email">Correo</label>
                  <input id="contact-email" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="tu@correo.com" required data-testid="input-contact-email" />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-phone">Teléfono</label>
                  <input id="contact-phone" type="tel" value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="55 0000 0000" required data-testid="input-contact-phone" />
                </div>
              </div>
              {mode === 'appointment' ? (
                <>
                  <div className="form-split">
                    <div className="form-field">
                      <label htmlFor="contact-date">Fecha preferida</label>
                      <input id="contact-date" type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(event) => setField('date', event.target.value)} required data-testid="input-contact-date" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-time">Hora</label>
                      <select id="contact-time" value={form.time} onChange={(event) => setField('time', event.target.value)} required data-testid="select-contact-time">
                        <option value="">Elige una hora</option>
                        {TIME_SLOTS.map((time) => <option key={time} value={time}>{time}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-topic">Tema para la charla</label>
                    <select id="contact-topic" value={form.topic} onChange={(event) => setField('topic', event.target.value)} data-testid="select-contact-topic">
                      {presetService && !TOPICS.includes(presetService) && <option value={presetService}>{presetService}</option>}
                      {TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
                      {SERVICES.filter((service) => !TOPICS.includes(service.title)).map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div className="form-field">
                  <label htmlFor="contact-message">¿Qué te gustaría ordenar?</label>
                  <textarea id="contact-message" value={form.message} onChange={(event) => setField('message', event.target.value)} placeholder="Retiro, protección, inversión…" data-testid="input-contact-message" />
                </div>
              )}
              {error && <div className="form-error" role="alert" data-testid="status-contact-error">{error}</div>}
              <button className="button button-primary" type="submit" disabled={pending} data-testid="button-submit-contact">
                {pending ? 'Enviando…' : mode === 'appointment' ? 'Reservar conversación' : 'Quiero que me contacten'}
                <ArrowRight size={15} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
