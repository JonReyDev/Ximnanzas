import { useRef, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { requestAppointment } from '@/lib/whatsapp';
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

function ProfileLanyard() {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const drag = useRef({ x: 0, moved: false });
  const portrait = import.meta.env.VITE_ADVISOR_PORTRAIT || `${import.meta.env.BASE_URL}assets/retrato-asesora.png`;

  return (
    <div className="profile-lanyard">
      <span className="lanyard-anchor" aria-hidden="true" />
      <div className={`lanyard-swing ${dragging ? "is-dragging" : ""}`} style={{ transform: `rotate(${angle}deg)` }}>
        <span className="lanyard-strap" aria-hidden="true" />
        <button
          type="button"
          className="lanyard-badge"
          aria-label={flipped ? "Mostrar frente de la tarjeta de Ximnanzas" : "Girar tarjeta de Ximnanzas"}
          aria-pressed={flipped}
          onPointerDown={(event) => {
            if (event.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            drag.current = { x: event.clientX, moved: false };
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const distance = event.clientX - drag.current.x;
            if (Math.abs(distance) > 8) drag.current.moved = true;
            setAngle(Math.max(-24, Math.min(24, -distance / 5)));
          }}
          onLostPointerCapture={() => { setDragging(false); setAngle(0); }}
          onClick={(event) => {
            if (event.detail === 0 || !drag.current.moved) setFlipped((value) => !value);
            drag.current.moved = false;
          }}
        >
          <span className="lanyard-face" data-flipped={flipped}>
            <span className="lanyard-side lanyard-front" aria-hidden={flipped}>
              <img
                src={portrait && !photoFailed ? portrait : "/assets/ximnanzas-logo.png"}
                alt={portrait && !photoFailed ? "Retrato de la asesora patrimonial" : ""}
                onError={() => setPhotoFailed(true)}
                className={portrait && !photoFailed ? "lanyard-portrait" : ""}
                loading="lazy"
                draggable={false}
              />
              <strong>XIMNANZAS</strong>
            </span>
            <span className="lanyard-side lanyard-back" aria-hidden={!flipped}>
              <strong>XIMNANZAS</strong>
              <span>Asesoría patrimonial</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export function ContactSection({ onSchedule }: TestimonialsProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;
    requestAppointment([
      ['Nombre', form.name],
      ['Correo', form.email],
      ['Teléfono', form.phone],
      ['Mensaje', form.message],
    ]);
  };

  return (
      <section id="contacto" className="section" style={{ background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '0', right: '0', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(0,102,255,0.08)', filter: 'blur(80px)' }} />

        <div className="container-wide contact-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <span className="section-kicker" style={{ color: 'var(--amber)' }}>Hablemos</span>
            <h2 className="display" style={{ color: 'var(--paper)' }}>Tu futuro empieza<br />con una conversacion</h2>
            <ProfileLanyard />
            <p style={{ marginTop: '24px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: '480px' }}>
              Comparte tus datos por WhatsApp para solicitar una primera cita sin costo.
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
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 className="serif" style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '4px' }}>Solicita informacion</h3>
                <input className="input" type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-row">
                  <input className="input" type="email" placeholder="Correo electronico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input className="input" type="tel" placeholder="Telefono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <textarea className="input" placeholder="¿En que te podemos ayudar? (opcional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} style={{ resize: 'none' }} />
                <button type="submit" className="button button-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Solicitar cita por WhatsApp
                  <Send size={15} />
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center' }}>
                  Al enviar aceptas nuestro aviso de privacidad.
                </p>
              </form>
          </div>
        </div>
      </section>
  );
}
