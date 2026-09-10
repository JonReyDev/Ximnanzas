const FAQS = [
  {
    q: '¿La primera conversacion tiene costo?',
    a: 'No. La primera charla de orientacion no tiene costo ni compromiso. Es un espacio para entender tu contexto y decirte con honestidad si podemos ayudarte.',
  },
  {
    q: '¿Necesito tener mucho dinero para empezar?',
    a: 'No. Un plan inteligente empieza con claridad, no con una cifra perfecta. Diseñamos la conversacion alrededor de tus posibilidades actuales y de lo que quieres construir.',
  },
  {
    q: '¿Que significa que son distribuidores autorizados?',
    a: 'XIMNANZAS cuenta con autorizacion para distribuir soluciones Allianz. Ademas, trabajamos bajo credenciales AMIB y CNSF, con estandares y responsabilidades que puedes consultar.',
  },
  {
    q: '¿Puedo cambiar mi plan mas adelante?',
    a: 'Si. La vida cambia y una buena estrategia tiene revisiones. Cada etapa puede pedir ajustes de aportacion, proteccion o prioridades.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section" style={{ background: 'var(--paper)' }}>
      <div className="container-wide faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '48px' }}>
        <div>
          <div className="section-kicker">Preguntas honestas</div>
          <h2 className="display">Lo que necesitas<br />saber antes de<br />decidir.</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary>{item.q}</summary>
              <div className="faq-answer">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
