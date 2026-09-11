import { ArrowUpRight, HeartPulse, ShieldCheck, Stethoscope, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import { navigate } from '@/lib/router';

const serviceIcons: Record<string, LucideIcon> = {
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
};

export function BentoGrid() {
  return (
    <section id="servicios" className="section" style={{ background: 'var(--paper)' }}>
      <div className="container-wide">
        <div style={{ maxWidth: '640px', marginBottom: '64px' }}>
          <span className="section-kicker">Nuestros servicios</span>
          <h2 className="display">Soluciones a la medida <span style={{ color: 'var(--blue)' }}>para cada etapa</span></h2>
          <p className="lead" style={{ marginTop: '20px' }}>
            Desde proteger a tu familia hasta hacer crecer tu patrimonio, tenemos un plan para ti.
            Explora cada servicio y agenda tu cita sin costo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="bento-grid">
          {SERVICES.map((service, i) => {
            const Icon = serviceIcons[service.icon] ?? ShieldCheck;
            const isLarge = i === 0 || i === 3;
            return (
              <button
                key={service.slug}
                onClick={() => navigate(`/servicios/${service.slug}`)}
                style={{
                  gridColumn: isLarge ? 'span 2' : 'span 1',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '28px',
                  background: 'white',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="bento-card"
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--ink)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                }}>
                  <Icon size={22} style={{ color: 'var(--paper)' }} />
                </div>
                <h3 className="serif" style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '8px', color: 'var(--ink)' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--blue)', fontWeight: 500, marginBottom: '12px' }}>
                  {service.tagline}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6, flex: 1 }}>
                  {service.description}
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginTop: '20px',
                }}>
                  Ver mas <ArrowUpRight size={15} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
