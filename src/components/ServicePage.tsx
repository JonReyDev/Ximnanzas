import { ArrowLeft, ArrowUpRight, CalendarDays, Check, MessageCircle } from 'lucide-react';
import { Marquee } from '@/components/Marquee';
import { getService, SERVICES } from '@/lib/services';
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

  const others = SERVICES.filter((item) => item.slug !== service.slug);

  return (
    <div data-testid={`product-page-${service.slug}`} style={{ background: 'var(--paper)' }}>
      <main>
        <section className="product-hero">
          <div className="container-wide product-hero-grid">
            <div>
              <button onClick={() => navigate('/')} data-testid="product-back-link" className="arrow-link product-back-link">
                <ArrowLeft size={15} /> Volver al inicio
              </button>
              <h1 className="product-title">
                {service.title}
                <em>{service.tagline}</em>
              </h1>
              <p className="lead product-description">{service.description}</p>
              <div className="product-actions">
                <a
                  data-testid="product-whatsapp-button"
                  href={whatsappLink(whatsappQuote(service.title))}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-product-primary"
                >
                  <MessageCircle size={16} /> WhatsApp directo
                </a>
                <button data-testid="product-agenda-button" onClick={onSchedule} className="button button-product-secondary">
                  <CalendarDays size={16} /> Hablar con un asesor
                </button>
              </div>
            </div>
            <div className="product-image-wrap">
              <div className="product-image-accent" aria-hidden="true" />
              <img src={service.image} alt={service.title} data-testid="product-image" className="product-image" />
              <span className="product-chapter">{service.chapter}</span>
            </div>
          </div>
        </section>

        <Marquee />

        <section className="product-benefits" data-testid="product-benefits-section">
          <div className="container-wide">
            <h2 className="display product-section-title">Lo que incluye.</h2>
            <div className="product-benefits-grid">
              {service.benefits.map((benefit, index) => (
                <div key={benefit.title} className="product-benefit" data-testid={`product-benefit-${index}`}>
                  <span className="product-check"><Check size={15} /></span>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="product-others" data-testid="product-others-section">
          <div className="container-wide">
            <p className="section-kicker">Explora también</p>
            <div className="product-others-list">
              {others.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => navigate(`/servicios/${item.slug}`)}
                  data-testid={`other-service-${item.slug}`}
                  className="product-other-link"
                >
                  <span>{item.title}</span>
                  <ArrowUpRight size={24} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}