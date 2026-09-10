import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Calendar, Clock, User, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { notifySubmission, supabase, type Appointment } from '@/lib/supabase';
import { SERVICES } from '@/lib/services';

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  presetService?: string;
};

const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export function ScheduleModal({ open, onClose, presetService }: ScheduleModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: presetService || '' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [viewMonth, setViewMonth] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm({ name: '', email: '', phone: '', service: presetService || '' });
      setSelectedDate(null);
      setSelectedTime('');
      setViewMonth(new Date());
      setError('');
    }
  }, [open, presetService]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const isSunday = (d: Date) => d.getDay() === 0;
  const isPast = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const getCalendarDays = () => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError('');
    const dateStr = selectedDate.toISOString().split('T')[0];
    const appointment: Omit<Appointment, 'id'> = {
      name: form.name, email: form.email, phone: form.phone,
      date: dateStr, time: selectedTime,
      service: form.service || undefined, status: 'pending',
    };
    const { error: dbError } = await supabase.from('appointments').insert([appointment]);
    setSubmitting(false);
    if (dbError) { setError('No pudimos agendar tu cita. Intenta de nuevo.'); return; }
    await notifySubmission('appointment', appointment);
    setStep(2);
  };

  const formatDate = (d: Date) => `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px 12px 40px', border: '1px solid var(--line)',
    borderRadius: '12px', fontSize: '0.9rem', fontFamily: 'inherit',
    background: 'white', color: 'var(--ink)', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="fade-up" style={{
        position: 'relative', width: '100%', maxWidth: '480px', maxHeight: '90vh',
        overflowY: 'auto', background: 'var(--paper)', borderRadius: '24px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--ink)', padding: '24px', borderRadius: '24px 24px 0 0',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="serif" style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--paper)' }}>Agenda tu cita</h2>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                Paso {step + 1} de 3 — {['Tus datos', 'Fecha y hora', 'Confirmacion'][step]}
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '8px' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                height: '4px', flex: 1, borderRadius: '999px',
                background: i <= step ? 'var(--paper)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.4s',
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Step 0 */}
          {step === 0 && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-soft)', marginBottom: '6px', display: 'block' }}>Nombre completo</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input style={inputStyle} type="text" placeholder="Tu nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-soft)', marginBottom: '6px', display: 'block' }}>Correo electronico</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input style={inputStyle} type="email" placeholder="tucorreo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-soft)', marginBottom: '6px', display: 'block' }}>Telefono</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input style={inputStyle} type="tel" placeholder="55 1234 5678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-soft)', marginBottom: '6px', display: 'block' }}>Servicio de interes</label>
                <select style={{ ...inputStyle, paddingLeft: '16px' }} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                  <option value="">Selecciona un servicio</option>
                  {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!form.name.trim() || !form.email.trim() || !form.phone.trim()}
                className="button button-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: (!form.name.trim() || !form.email.trim() || !form.phone.trim()) ? 0.4 : 1, cursor: (!form.name.trim() || !form.email.trim() || !form.phone.trim()) ? 'not-allowed' : 'pointer' }}
              >
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                  <ChevronLeft size={18} style={{ color: 'var(--ink-soft)' }} />
                </button>
                <h3 className="serif" style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--ink)' }}>
                  {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </h3>
                <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                  <ChevronRight size={18} style={{ color: 'var(--ink-soft)' }} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {WEEKDAYS.map((d) => <div key={d} className="mono" style={{ color: 'var(--muted)', padding: '4px 0' }}>{d}</div>)}
                {getCalendarDays().map((d, i) => {
                  if (!d) return <div key={i} />;
                  const disabled = isSunday(d) || isPast(d);
                  const selected = selectedDate && d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
                  return (
                    <button
                      key={i}
                      disabled={disabled}
                      onClick={() => { setSelectedDate(d); setSelectedTime(''); }}
                      style={{
                        aspectRatio: '1', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 500,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        background: selected ? 'var(--ink)' : 'transparent',
                        color: selected ? 'var(--paper)' : disabled ? '#d1d5db' : 'var(--ink-soft)',
                        border: selected ? 'none' : '1px solid var(--line-soft)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-soft)', marginBottom: '12px' }}>
                    <Clock size={15} style={{ color: 'var(--blue)' }} /> Horario disponible — 10:00 a 18:00
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        style={{
                          padding: '10px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 500,
                          border: selectedTime === t ? 'none' : '1px solid var(--line)',
                          background: selectedTime === t ? 'var(--ink)' : 'white',
                          color: selectedTime === t ? 'var(--paper)' : 'var(--ink-soft)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(0)} className="button button-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                  <ChevronLeft size={16} /> Atras
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime || submitting}
                  className="button button-primary"
                  style={{ flex: 1, justifyContent: 'center', opacity: (!selectedDate || !selectedTime || submitting) ? 0.4 : 1 }}
                >
                  {submitting ? 'Confirmando...' : 'Confirmar cita'}
                  {!submitting && <Check size={16} />}
                </button>
              </div>
              {error && <p style={{ fontSize: '0.85rem', color: '#ef4444', textAlign: 'center' }}>{error}</p>}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && selectedDate && (
            <div className="fade-in" style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle2 size={40} style={{ color: '#16a34a' }} />
              </div>
              <h3 className="serif" style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '8px' }}>¡Cita confirmada!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '24px' }}>
                Hemos agendado tu cita. Recibiras un correo de confirmacion en breve.
              </p>
              <div style={{ background: 'var(--paper-warm)', borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem' }}>
                  <Calendar size={18} style={{ color: 'var(--blue)' }} /> <span>{formatDate(selectedDate)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem' }}>
                  <Clock size={18} style={{ color: 'var(--blue)' }} /> <span>{selectedTime} hrs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem' }}>
                  <User size={18} style={{ color: 'var(--blue)' }} /> <span>{form.name}</span>
                </div>
                {form.service && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem' }}>
                    <Mail size={18} style={{ color: 'var(--blue)' }} /> <span>{form.service}</span>
                  </div>
                )}
              </div>
              <button onClick={onClose} className="button button-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Listo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
