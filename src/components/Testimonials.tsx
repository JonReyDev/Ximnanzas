import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { notifySubmission, supabase, type Lead } from '@/lib/supabase';
import { IMAGES } from '@/lib/images';

const TESTIMONIALS = [
  {
    name: 'Maria Gonzalez',
    role: 'Empresaria, 42 años',
    image: IMAGES.testimonials[0],
    quote: 'Empece a invertir hace 5 años con una aportacion mensual modesta. Hoy mi patrimonio se ha triplicado y duermo tranquila sabiendo que mi familia esta protegida.',
    rating: 5,
  },
  {
    name: 'Carlos Ramirez',
    role: 'Ingeniero, 35 años',
    image: IMAGES.testimonials[1],
    quote: 'El seguro de gastos medicos mayores salvo mi economia cuando tuve un accidente. La atencion fue inmediata y no pague un solo peso del hospital.',
    rating: 5,
  },
  {
    name: 'Laura Mendoza',
    role: 'Madre de familia, 38 años',
    image: IMAGES.testimonials[2],
    quote: 'La asesoria fue clara y honesta. No me vendieron nada que no necesitara. Me ayudaron a deducir impuestos y proteger a mis hijos al mismo tiempo.',
    rating: 5,
  },
];

type TestimonialsProps = {
  onSchedule: () => void;
};

export function Testimonials() {
  return (
    <section id="testimonios" className="section testimonials-section" style={{ background: 'var(--paper)' }}>
      <div className="container-wide">
      
        <div className="testimonials-heading">
          <span className="section-kicker">Lo que dicen nuestros clientes</span>
          <div className="gold-rule"></div>
          <h2 className="display">Historias reales, <span style={{ color: 'var(--blue)' }}>decisiones claras</span></h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="testimonial-card">
              <div className="testimonial-card-meta">
                <span className="testimonial-stars" aria-label={`${t.rating} de 5 estrellas`}>★★★★★</span>
                <span className="testimonial-tag">Cliente verificado</span>
              </div>
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-attribution">
                <img src={t.image} alt={t.name} className="testimonial-avatar" />
                <span className="testimonial-who">
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ onSchedule }: TestimonialsProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;
    setStatus('submitting');
    const lead: Omit<Lead, 'id'> = {
      name: form.name, email: form.email, phone: form.phone, message: form.message,
    };
    const { error } = await supabase.from('leads').insert([lead]);
    if (error) { setStatus('error'); return; }
    await notifySubmission('lead', lead);
    setStatus('success');
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
      <section id="contacto" className="section" style={{ background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '0', right: '0', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(0,102,255,0.08)', filter: 'blur(80px)' }} />

        <div className="container-wide contact-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <span className="section-kicker" style={{ color: 'var(--amber)' }}>Hablemos</span>
            <h2 className="display" style={{ color: 'var(--paper)' }}>Tu futuro empieza<br />con una conversacion</h2>
            <p style={{ marginTop: '24px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: '480px' }}>
              Dejanos tus datos y un asesor te contactara en menos de 24 horas. La primera cita
              es sin costo y sin compromiso. Solo queremos ayudarte a tomar la mejor decision.
            </p>
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Asesoria personalizada sin costo', 'Respuesta en menos de 24 horas', 'Mas de 15 años de experiencia'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={18} style={{ color: '#4ade80', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={onSchedule} className="button button-light" style={{ marginTop: '32px' }}>
              Agenda una cita ahora
            </button>
          </div>

          {/* Right: form */}
          <div style={{ background: 'var(--paper)', borderRadius: '24px', padding: '36px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} style={{ color: '#16a34a' }} />
                </div>
                <h3 className="serif" style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '8px' }}>¡Gracias!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  Hemos recibido tu informacion. Un asesor te contactara muy pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 className="serif" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '4px' }}>Solicita informacion</h3>
                <input className="input" type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-row">
                  <input className="input" type="email" placeholder="Correo electronico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input className="input" type="tel" placeholder="Telefono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <textarea className="input" placeholder="¿En que te podemos ayudar? (opcional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} style={{ resize: 'none' }} />
                {status === 'error' && <p style={{ fontSize: '0.85rem', color: '#ef4444' }}>Ocurrio un error. Intenta de nuevo.</p>}
                <button type="submit" disabled={status === 'submitting'} className="button button-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {status === 'submitting' ? 'Enviando...' : 'Enviar informacion'}
                  {status !== 'submitting' && <Send size={15} />}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center' }}>
                  Al enviar aceptas nuestro aviso de privacidad.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
  );
}
