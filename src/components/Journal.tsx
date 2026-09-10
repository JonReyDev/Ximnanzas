import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    tag: 'Retiro · 6 min',
    title: 'La pregunta que conviene responder antes de elegir un plan de retiro',
    excerpt: 'No es cuanto quieres ahorrar. Es como quieres que se vea un martes cualquiera cuando dejes de trabajar.',
    testId: 'button-journal-retirement',
  },
  {
    tag: 'Proteccion · 4 min',
    title: 'Proteger ingresos tambien es cuidar a tu familia',
    excerpt: 'La conversacion que solemos posponer hasta que se vuelve urgente.',
    testId: 'button-journal-protection',
  },
  {
    tag: 'Habitos · 3 min',
    title: 'La constancia le gana a la intencion',
    excerpt: 'Una forma mas amable de mirar tus metas financieras.',
    testId: 'button-journal-habits',
  },
];

type JournalProps = {
  onContact: () => void;
};

export function Journal({ onContact }: JournalProps) {
  return (
    <section className="section" style={{ background: 'var(--paper-warm)' }}>
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }} className="journal-top">
          <div>
            <div className="section-kicker">Notas para avanzar</div>
            <h2 className="display">Ideas que si<br />caben en tu semana.</h2>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '320px' }}>
            Pequeñas lecturas para tomar mejores decisiones cuando tienes un cafe, diez minutos y ganas de ordenar algo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="journal-grid">
          {ARTICLES.map((article) => (
            <article key={article.title} className="journal-card">
              <small>{article.tag}</small>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button className="arrow-link" onClick={onContact} data-testid={article.testId}>
                Leer nota <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
