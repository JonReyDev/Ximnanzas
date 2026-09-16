import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import { navigate } from '@/lib/router';

export function BentoGrid() {
  return (
    <section className="section section-paper" id="servicios">
      <div className="shell">
        <div className="section-head">
          <div className="section-kicker">Nuestros servicios
          <hr className="gold-rule" />  
          <div>
            <h2>
              Lo importante,
              <br />
              <em className="serif" style={{ color: 'var(--gold)' }}>bien pensado.</em>
            </h2>
            </div>
            </div>
          
          <p>
            Cuatro decisiones patrimoniales no se resuelven igual. Por eso empezamos por tu contexto, no por un producto.
          </p>
        </div>
        <div className="service-grid">
          {SERVICES.map((service) => (
            <a
              className="service-card"
              href={`#/servicios/${service.slug}`}
              key={service.slug}
              data-testid={`link-service-${service.slug}`}
              onClick={(event) => {
                event.preventDefault();
                navigate(`/servicios/${service.slug}`);
              }}
            >
              <div>
                <div className="service-num">
                  <span>{service.chapter}</span>
                  <ArrowRight size={15} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.tagline}</p>
              </div>
              <span className="service-arrow">
                <ArrowRight size={18} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
