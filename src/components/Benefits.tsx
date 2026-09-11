import { IMAGES } from '@/lib/images';

const BENEFITS = [
  {
    number: '01',
    title: 'Deduccion de impuestos',
    description:
      'Tu prima de seguro es deducible hasta el 100% en tu declaracion anual. Al proteger a tu familia, tambien reduces tu carga fiscal. Una decision inteligente que te beneficia dos veces.',
    stat: '100%',
    statLabel: 'Deducible de tu prima',
    image: IMAGES.benefits,
  },
  {
    number: '02',
    title: 'Interes compuesto',
    description:
      'El interes compuesto es la octava maravilla del mundo. Tu dinero no solo crece, sino que los rendimientos generan mas rendimientos. Mientras mas joven empiezas, mas exponencial es el crecimiento.',
    stat: '3x',
    statLabel: 'Mas rendimiento al empezar joven',
    image: IMAGES.Simulador,
  },
  {
    number: '03',
    title: 'Proteccion total',
    description:
      'Un solo incidente puede destruir años de esfuerzo. Con la cobertura adecuada, tu patrimonio esta blindado ante enfermedades, accidentes y lo imprevisto. Tu familia nunca pasa por un momento dificil sola.',
    stat: '24/7',
    statLabel: 'Proteccion para los tuyos',
    image: IMAGES.testimonials[0],
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="section" style={{ background: 'var(--paper)' }}>
      <div className="container-wide">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '80px' }}>
          <span className="section-kicker">Por que empezar hoy</span>
          <h2 className="display">Tres razones que cambian <span style={{ color: 'var(--blue)' }}>tu futuro</span></h2>
          <p className="lead" style={{ marginTop: '24px' }}>
            No se trata de vender un producto. Se trata de construir una estrategia que proteja lo que amas
            y haga crecer tu patrimonio con proposito.
          </p>
        </div>

        {/* Chapters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {BENEFITS.map((b, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={b.number}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '48px',
                  alignItems: 'center',
                  direction: reversed ? 'rtl' : 'ltr',
                }}
                className="benefit-row"
              >
                <div style={{ direction: 'ltr' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <span className="serif" style={{ fontSize: '3.5rem', fontWeight: 300, color: 'rgba(10,22,40,0.12)' }}>
                      {b.number}
                    </span>
                  </div>
                  <h3 className="serif" style={{ fontSize: '1.8rem', fontWeight: 500, marginBottom: '16px', color: 'var(--ink)' }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '24px', maxWidth: '48ch' }}>
                    {b.description}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'baseline', gap: '8px',
                    background: 'var(--paper-warm)', padding: '12px 20px', borderRadius: '12px',
                  }}>
                    <span className="serif" style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--blue)' }}>
                      {b.stat}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{b.statLabel}</span>
                  </div>
                </div>

                <div style={{ direction: 'ltr' }}>
                  <div style={{
                    position: 'relative', aspectRatio: '4/3', borderRadius: '20px',
                    overflow: 'hidden', boxShadow: '0 16px 48px rgba(10,22,40,0.12)',
                  }}>
                    <img
                      src={b.image}
                      alt={b.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                      className="benefit-img"
                    />
                    <div style={{
                      position: 'absolute', bottom: '16px', left: '16px',
                      background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(8px)',
                      padding: '8px 16px', borderRadius: '10px',
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                        Capitulo {b.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
