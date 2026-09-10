import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CalendarCheck, MessageCircle, ArrowLeft, Check } from 'lucide-react';
import { getService } from '@/lib/services';
import { navigate } from '@/lib/router';
import { whatsappLink, whatsappQuote } from '@/lib/whatsapp';

type ServicePageProps = {
  slug: string;
  onSchedule: () => void;
};

export function ServicePage({ slug, onSchedule }: ServicePageProps) {
  const service = getService(slug);

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', paddingTop: '80px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="display" style={{ marginBottom: '16px' }}>Servicio no encontrado</h1>
          <button onClick={() => navigate('/')} className="arrow-link">Volver al inicio</button>
        </div>
      </div>
    );
  }

  const Icon = (Icons as unknown as Record<string, LucideIcon>)[service.icon] ?? Icons.ShieldCheck;

  return (
    <div style={{ background: 'var(--paper)' }}>
      <section style={{
        position: 'relative', minHeight: '65vh', overflow: 'hidden',
        background: 'var(--ink)', display: 'flex', alignItems: 'center',
        paddingTop: '80px',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--ink) 0%, rgba(26,43,66,0.92) 50%, rgba(0,30,95,0.7) 100%)' }} />
        </div>

        <div className="container-wide" style={{ position: 'relative', padding: '80px 24px' }}>
          <button onClick={() => navigate('/')} className="arrow-link" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
            <ArrowLeft size={15} /> Volver al inicio
          </button>

          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--paper)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
          }}>
            <Icon size={26} style={{ color: 'var(--ink)' }} />
          </div>

          <p style={{ fontSize: '1.1rem', color: 'var(--amber-soft)', fontWeight: 500, marginBottom: '12px' }}>
            {service.tagline}
          </p>
          <h1 className="display-lg" style={{ color: 'var(--paper)', maxWidth: '600px' }}>
            {service.title}
          </h1>
          <p style={{ marginTop: '24px', maxWidth: '540px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
            {service.description}
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onSchedule} className="button button-light">
              <CalendarCheck size={16} /> Agenda una cita
            </button>
            <a
              href={whatsappLink(whatsappQuote(service.title))}
              target="_blank" rel="noreferrer"
              className="button"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--paper)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <MessageCircle size={16} /> Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0', background: 'var(--paper-warm)', borderBottom: '1px solid var(--line)' }}>
        <div className="container-wide" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px' }}>
          {service.highlights.map((h) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'var(--ink)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={12} style={{ color: 'var(--paper)' }} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink-soft)' }}>{h}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div style={{ maxWidth: '640px', marginBottom: '64px' }}>
            <span className="section-kicker">Beneficios</span>
            <h2 className="display">Todo lo que incluye<br />{service.title}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="benefits-grid">
            {service.benefits.map((b) => {
              const BIcon = (Icons as unknown as Record<string, LucideIcon>)[b.icon] ?? Icons.Check;
              return (
                <div key={b.title} className="card">
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'var(--ink)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                  }}>
                    <BIcon size={20} style={{ color: 'var(--paper)' }} />
                  </div>
                  <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: '8px' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,102,255,0.08)', filter: 'blur(80px)' }} />
        <div className="container-narrow" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 className="display" style={{ color: 'var(--paper)', marginBottom: '16px' }}>
            ¿Listo para proteger tu futuro?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '32px' }}>
            Agenda una cita sin costo y recibe asesoria personalizada para {service.title.toLowerCase()}.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onSchedule} className="button button-light">
              <CalendarCheck size={16} /> Agenda una cita
            </button>
            <a
              href={whatsappLink(whatsappQuote(service.title))}
              target="_blank" rel="noreferrer"
              className="button"
              style={{ background: '#059669', color: 'white' }}
            >
              <MessageCircle size={16} /> Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
